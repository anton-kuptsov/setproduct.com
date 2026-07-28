#!/usr/bin/env node
// Phase 2 of Wave 5 — image alt proposals generator.
// Reads .ai/image-alt-audit.csv, writes .ai/image-alt-proposals.csv
// and .ai/image-alt-proposals-summary.md.
// Run: node scripts/generate-alt-proposals.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content/blog");
const AUDIT_CSV = path.join(ROOT, ".ai/image-alt-audit.csv");
const PROPOSALS_CSV = path.join(ROOT, ".ai/image-alt-proposals.csv");
const SUMMARY_MD = path.join(ROOT, ".ai/image-alt-proposals-summary.md");

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

function csvCell(v) {
  const s = String(v ?? "");
  return /[,"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function csvRow(arr) { return arr.map(csvCell).join(",") + "\n"; }

function findImagesInBody(body) {
  const matches = [];
  let m;
  const mdRe = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  while ((m = mdRe.exec(body)) !== null) {
    matches.push({ offset: m.index, alt: m[1], src: m[2] });
  }
  const htmlA = /<img\b[^>]*\balt=["']([^"']*)["'][^>]*\bsrc=["']([^"']+)["'][^>]*\/?>/g;
  while ((m = htmlA.exec(body)) !== null) {
    matches.push({ offset: m.index, alt: m[1], src: m[2] });
  }
  const htmlB = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*\balt=["']([^"']*)["'][^>]*\/?>/g;
  while ((m = htmlB.exec(body)) !== null) {
    matches.push({ offset: m.index, alt: m[2], src: m[1] });
  }
  matches.sort((a, b) => a.offset - b.offset);
  const seen = new Set();
  return matches.filter(x => {
    const k = x.offset + "-" + x.src;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function stripMd(s) {
  return (s || "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\\([.\-_*#`~()\[\]])/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractContext(body, imgOffset) {
  const before = body.slice(0, imgOffset);
  const after = body.slice(imgOffset);

  const headingRe = /^(#{2,3})\s+(.+)$/gm;
  let lastHeading = "";
  let mh;
  while ((mh = headingRe.exec(before)) !== null) lastHeading = mh[2].trim();

  const beforeLines = before.split("\n").reverse();
  let paragraphBefore = "";
  for (const line of beforeLines) {
    const t = line.trim();
    if (!t) { if (paragraphBefore) break; else continue; }
    if (t.startsWith("#") || t.startsWith("![") || t.startsWith("<img")) break;
    paragraphBefore = t + " " + paragraphBefore;
    if (paragraphBefore.length > 600) break;
  }

  const afterLines = after.split("\n");
  let paragraphAfter = "";
  let skippedImg = false;
  for (const line of afterLines) {
    const t = line.trim();
    if (!skippedImg && (t.startsWith("![") || t.startsWith("<img"))) { skippedImg = true; continue; }
    skippedImg = true;
    if (!t) { if (paragraphAfter) break; else continue; }
    if (t.startsWith("#") || t.startsWith("![") || t.startsWith("<img")) break;
    paragraphAfter += " " + t;
    if (paragraphAfter.length > 600) break;
  }

  return {
    heading: lastHeading,
    paragraphBefore: paragraphBefore.trim().slice(-600),
    paragraphAfter: paragraphAfter.trim().slice(0, 600),
  };
}

const PLACE_WORDS = new Set([
  "Greece","Vietnam","Israel","Tel","Aviv","London","Berlin","Paris","Ukraine",
  "Russia","India","Germany","France","Spain","Italy","Canada","Brazil","Poland",
  "Netherlands","Sweden","Norway","Finland","Denmark","Portugal","Turkey","China",
  "Japan","Korea","Australia","Mexico","Argentina","Egypt","Dubai","USA","UK",
  "Twitter","Instagram","Dribbble","Behance","YouTube","LinkedIn","Figma","Google",
]);

function componentFromTitle(title) {
  if (!title) return "";
  const m = title.match(/^([A-Z][a-zA-Z\s-]*?)\s+UI\b/);
  if (m) return m[1].trim();
  return "";
}

function cleanHeading(h) {
  return stripMd(h).replace(/^[#\s]+/, "").replace(/^\d+[.)]\s*/, "").trim();
}

function headingLooksLikeName(cleaned) {
  if (!/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/.test(cleaned)) return false;
  return !cleaned.split(/\s+/).some(p => PLACE_WORDS.has(p));
}

function findAttribution(text) {
  const byMatch = text.match(/\bby\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/);
  if (byMatch) {
    const name = byMatch[1];
    if (!name.split(/\s+/).some(p => PLACE_WORDS.has(p))) return { person: name };
  }
  return null;
}

function sentenceCase(s) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}

function generateAlt(ctx) {
  const { frontmatter, position, heading, paragraphBefore, paragraphAfter } = ctx;
  const component = componentFromTitle(frontmatter.title);
  const subject = component || "Design";
  const beforeClean = stripMd(paragraphBefore);
  const afterClean = stripMd(paragraphAfter);

  if (position === 0) {
    if (frontmatter.description) {
      const first = frontmatter.description.split(/[.!?]/)[0].trim();
      return { alt: sentenceCase(first), confidence: "medium", reasoning: "Cover from frontmatter description" };
    }
    return { alt: sentenceCase(subject + " article cover image"), confidence: "low", reasoning: "Cover fallback to subject" };
  }

  const attr = findAttribution(afterClean) || findAttribution(beforeClean);
  if (attr) {
    return { alt: attr.person + " design work featured in the article", confidence: "high", reasoning: "Person attribution detected" };
  }

  if (heading) {
    const rawH = cleanHeading(heading);
    if (!component && headingLooksLikeName(rawH)) {
      return { alt: rawH + " design work featured in the article", confidence: "high", reasoning: "Person name from heading" };
    }
    const h = rawH.toLowerCase();
    if (h) {
      if (/\b(state|hover|active|disabled|focus|error|loading|default|expanded|collapsed)\b/i.test(h)) {
        return { alt: sentenceCase(subject + " " + h + " shown in example"), confidence: "high", reasoning: "State or variant from heading" };
      }
      if (/\banatomy|structure|parts\b/i.test(h)) {
        return { alt: sentenceCase(subject + " anatomy diagram with key parts labeled"), confidence: "high", reasoning: "Anatomy heading" };
      }
      if (/\buse\s*case|example|usage\b/i.test(h)) {
        return { alt: sentenceCase(subject + " usage example showing " + h), confidence: "medium", reasoning: "Use case heading" };
      }
      return { alt: sentenceCase(subject + " example illustrating " + h), confidence: "medium", reasoning: "Generic heading-based alt" };
    }
  }

  if (beforeClean.length > 30) {
    const first = beforeClean.split(/[.!?]/)[0].trim();
    if (first.length >= 15 && first.length <= 100) {
      return { alt: sentenceCase(first), confidence: "low", reasoning: "Built from first sentence before image" };
    }
  }

  return { alt: "", confidence: "needs-human-review", reasoning: "Insufficient context for safe generation" };
}

function main() {
  console.log("Reading audit CSV...");
  const auditText = fs.readFileSync(AUDIT_CSV, "utf8");
  const rows = parseCSV(auditText);
  if (rows.length < 2) { console.error("Audit CSV empty"); process.exit(1); }
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));

  const bySlug = new Map();
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const status = r[idx.status];
    if (status === "ok") continue;
    const slug = r[idx.post_slug];
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push({
      position: parseInt(r[idx.image_position], 10),
      path: r[idx.image_path],
      currentAlt: r[idx.current_alt] || "",
      status,
    });
  }
  console.log("Posts with problematic images: " + bySlug.size);

  const outHeader = ["post_slug","image_position","image_path","current_alt","status","proposed_alt","confidence","reasoning"];
  fs.writeFileSync(PROPOSALS_CSV, csvRow(outHeader));

  let total = 0;
  const counters = { high: 0, medium: 0, low: 0, "needs-human-review": 0 };
  for (const slug of [...bySlug.keys()].sort()) {
    const mdxPath = path.join(BLOG_DIR, slug + ".mdx");
    let raw;
    try { raw = fs.readFileSync(mdxPath, "utf8"); }
    catch { console.warn("Skip missing: " + slug); continue; }
    const { data: frontmatter, content: body } = matter(raw);
    const images = findImagesInBody(body);

    for (const p of bySlug.get(slug)) {
      let ctx;
      if (p.position === 0) {
        ctx = { frontmatter, position: 0, heading: "", paragraphBefore: "", paragraphAfter: "" };
      } else {
        const img = images[p.position - 1] || images.find(i => i.src === p.path);
        const c = img ? extractContext(body, img.offset) : { heading: "", paragraphBefore: "", paragraphAfter: "" };
        ctx = { frontmatter, position: p.position, ...c };
      }
      const r = generateAlt(ctx);
      counters[r.confidence] = (counters[r.confidence] || 0) + 1;
      fs.appendFileSync(PROPOSALS_CSV, csvRow([slug, p.position, p.path, p.currentAlt, p.status, r.alt, r.confidence, r.reasoning]));
      total++;
    }
  }

  console.log("Total processed: " + total);
  console.log("Distribution:", counters);

  const pct = k => total ? ((counters[k] || 0) / total * 100).toFixed(1) : "0";
  const summary = "# Image alt proposals — summary\n\nGenerated " + new Date().toISOString().slice(0, 10) + ".\n\n## Confidence distribution\n\n| Confidence | Count | % |\n| --- | --- | --- |\n| high | " + (counters.high || 0) + " | " + pct("high") + "% |\n| medium | " + (counters.medium || 0) + " | " + pct("medium") + "% |\n| low | " + (counters.low || 0) + " | " + pct("low") + "% |\n| needs-human-review | " + (counters["needs-human-review"] || 0) + " | " + pct("needs-human-review") + "% |\n\nTotal: " + total + "\n\n## Next step\n\nOpen .ai/image-alt-proposals.csv, sort by confidence, spot-check.\n";
  fs.writeFileSync(SUMMARY_MD, summary);
  console.log("Summary written to " + SUMMARY_MD);
}

main();
