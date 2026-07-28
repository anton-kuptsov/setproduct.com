#!/usr/bin/env node
// Phase 3 of Wave 5 — apply alt text proposals to MDX files.
// Reads .ai/image-alt-proposals.csv, updates content/blog/*.mdx.
//
// Usage:
//   node scripts/apply-alt-proposals.mjs --posts slug1,slug2 [--dry-run]
//   node scripts/apply-alt-proposals.mjs --offset N --limit M [--dry-run]
//   node scripts/apply-alt-proposals.mjs --dry-run   (all posts, no write)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");
const PROPOSALS_CSV = path.join(ROOT, ".ai/image-alt-proposals.csv");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const n = text[i + 1];
    if (inQuotes) {
      if (c === '"' && n === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++;
    } else {
      if (c === '"') { inQuotes = true; i++; }
      else if (c === ",") { row.push(field); field = ""; i++; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; }
      else if (c === "\r") { i++; }
      else { field += c; i++; }
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(f => f !== ""));
}

function findImagesInBody(body) {
  const matches = [];
  let m;
  const mdRe = /!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g;
  while ((m = mdRe.exec(body)) !== null) {
    matches.push({ offset: m.index, length: m[0].length, alt: m[1], src: m[2], title: m[3] || "", kind: "md" });
  }
  const htmlRe = /<img\b[^>]*\/?>/g;
  while ((m = htmlRe.exec(body)) !== null) {
    const tag = m[0];
    const altMatch = tag.match(/\balt=["']([^"']*)["']/);
    const srcMatch = tag.match(/\bsrc=["']([^"']+)["']/);
    if (srcMatch) {
      matches.push({ offset: m.index, length: tag.length, alt: altMatch ? altMatch[1] : "", src: srcMatch[1], kind: "html" });
    }
  }
  matches.sort((a, b) => a.offset - b.offset);
  return matches;
}

function escapeYamlString(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function updateCoverImageAlt(frontmatterRaw, newAlt) {
  const value = '"' + escapeYamlString(newAlt) + '"';
  if (/^coverImageAlt:\s*.*$/m.test(frontmatterRaw)) {
    return frontmatterRaw.replace(/^coverImageAlt:\s*.*$/m, "coverImageAlt: " + value);
  }
  if (/^coverImage:\s*.*$/m.test(frontmatterRaw)) {
    return frontmatterRaw.replace(/^(coverImage:\s*.*)$/m, "$1\ncoverImageAlt: " + value);
  }
  return frontmatterRaw.replace(/\n---\s*$/, "\ncoverImageAlt: " + value + "\n---");
}

function replaceImageAlt(body, image, newAlt) {
  const before = body.slice(0, image.offset);
  const after = body.slice(image.offset + image.length);
  let replacement;
  if (image.kind === "md") {
    replacement = "![" + newAlt + "](" + image.src + (image.title || "") + ")";
  } else {
    const original = body.slice(image.offset, image.offset + image.length);
    if (/\balt=["'][^"']*["']/.test(original)) {
      replacement = original.replace(/\balt=["'][^"']*["']/, 'alt="' + newAlt.replace(/"/g, "&quot;") + '"');
    } else {
      replacement = original.replace(/<img\b/, '<img alt="' + newAlt.replace(/"/g, "&quot;") + '"');
    }
  }
  return before + replacement + after;
}

function splitFrontmatter(raw) {
  if (!raw.startsWith("---\n") && !raw.startsWith("---\r\n")) return null;
  const endMatch = raw.match(/\n---\s*(\r?\n|$)/);
  if (!endMatch) return null;
  const endIdx = endMatch.index + endMatch[0].length;
  return { frontmatter: raw.slice(0, endIdx), body: raw.slice(endIdx) };
}

function applyToPost(slug, proposals, dryRun) {
  const mdxPath = path.join(BLOG_DIR, slug + ".mdx");
  if (!fs.existsSync(mdxPath)) {
    return { updated: 0, skipped: 0, missingPost: true, changes: [] };
  }
  const raw = fs.readFileSync(mdxPath, "utf8");
  const split = splitFrontmatter(raw);
  if (!split) return { updated: 0, skipped: 0, badFrontmatter: true, changes: [] };
  let frontmatter = split.frontmatter;
  let body = split.body;
  let updated = 0, skipped = 0;
  const changes = [];

  const cover = proposals.find(p => p.position === 0);
  if (cover && cover.proposedAlt && cover.confidence !== "needs-human-review") {
    const newFm = updateCoverImageAlt(frontmatter, cover.proposedAlt);
    if (newFm !== frontmatter) {
      changes.push({ pos: 0, old: cover.currentAlt, neu: cover.proposedAlt });
      frontmatter = newFm;
      updated++;
    } else skipped++;
  }

  const bodyProposals = proposals
    .filter(p => p.position >= 1 && p.proposedAlt && p.confidence !== "needs-human-review")
    .sort((a, b) => b.position - a.position);

  const images = findImagesInBody(body);
  for (const p of bodyProposals) {
    const img = images[p.position - 1];
    if (!img) { skipped++; continue; }
    const newBody = replaceImageAlt(body, img, p.proposedAlt);
    if (newBody !== body) {
      changes.push({ pos: p.position, old: img.alt, neu: p.proposedAlt });
      body = newBody;
      updated++;
    } else skipped++;
  }

  if (updated > 0 && !dryRun) {
    fs.writeFileSync(mdxPath, frontmatter + body);
  }
  return { updated, skipped, changes };
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const args = { posts: null, offset: null, limit: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--posts" && argv[i + 1]) { args.posts = argv[i + 1].split(",").map(s => s.trim()); i++; }
    else if (a === "--offset" && argv[i + 1]) { args.offset = parseInt(argv[i + 1], 10); i++; }
    else if (a === "--limit" && argv[i + 1]) { args.limit = parseInt(argv[i + 1], 10); i++; }
    else if (a === "--dry-run") { args.dryRun = true; }
  }
  return args;
}

function main() {
  const args = parseArgs();
  const csv = fs.readFileSync(PROPOSALS_CSV, "utf8");
  const rows = parseCSV(csv);
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));

  const bySlug = new Map();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const slug = r[idx.post_slug];
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push({
      position: parseInt(r[idx.image_position], 10),
      currentAlt: r[idx.current_alt] || "",
      proposedAlt: r[idx.proposed_alt] || "",
      confidence: r[idx.confidence] || "",
    });
  }

  let slugList = [...bySlug.keys()].sort();
  if (args.posts) slugList = args.posts.filter(s => bySlug.has(s));
  else if (args.offset !== null || args.limit !== null) {
    const off = args.offset || 0;
    const lim = args.limit || slugList.length;
    slugList = slugList.slice(off, off + lim);
  }

  console.log("Applying to " + slugList.length + " posts. Dry-run: " + args.dryRun);
  let totUpd = 0, totSkip = 0, postsChanged = 0;

  for (const slug of slugList) {
    const r = applyToPost(slug, bySlug.get(slug), args.dryRun);
    if (r.missingPost) { console.warn("  MISSING " + slug); continue; }
    if (r.badFrontmatter) { console.warn("  BAD-FRONTMATTER " + slug); continue; }
    if (r.updated > 0) postsChanged++;
    totUpd += r.updated;
    totSkip += r.skipped;
    console.log(slug + ": " + r.updated + " updated, " + r.skipped + " skipped");
    if (args.dryRun) {
      for (const ch of r.changes.slice(0, 3)) {
        console.log("    [pos " + ch.pos + "] " + (ch.old || "(empty)").slice(0, 60) + " -> " + ch.neu.slice(0, 60));
      }
      if (r.changes.length > 3) console.log("    ... " + (r.changes.length - 3) + " more");
    }
  }

  console.log("\nTotal updated: " + totUpd + ", skipped: " + totSkip + ", posts changed: " + postsChanged);
}

main();
