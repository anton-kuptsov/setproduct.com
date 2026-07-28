#!/usr/bin/env node
/**
 * audit-image-alts.mjs
 *
 * READ-ONLY audit of image alt-texts across all blog posts.
 *
 * Scans every .mdx file in content/blog/, extracts:
 *   - the frontmatter cover image (coverImage / coverImageAlt) as position 0
 *   - every body image: Markdown ![alt](path) plus defensive HTML/JSX
 *     <img>, <MDXImage>, <Image> handling
 *
 * For each image it captures document-order context (preceding heading,
 * preceding paragraph, following paragraph) and classifies the alt status
 * (missing / duplicate / generic-templated / short / ok).
 *
 * Outputs (idempotent — re-running overwrites with the same result):
 *   - .ai/image-alt-audit.csv     (facts only, one row per image)
 *   - .ai/image-alt-summary.md    (aggregate statistics)
 *
 * This script NEVER edits any .mdx file. It only reads and writes the two
 * report files above.
 *
 * Usage:
 *   node scripts/audit-image-alts.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const AI_DIR = path.join(ROOT, ".ai");
const CSV_PATH = path.join(AI_DIR, "image-alt-audit.csv");
const SUMMARY_PATH = path.join(AI_DIR, "image-alt-summary.md");

const EXCERPT_LEN = 100;
const GENERIC_RE = /\b(tutorial|guide|best practices|ux tips)\b/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip light Markdown/HTML inline syntax so context text is human-readable. */
function cleanInline(s) {
  return String(s || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // markdown images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/[*_]{1,3}/g, "") // emphasis
    .replace(/<[^>]+>/g, "") // html tags
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract every image (markdown + html/jsx) from a single line, in order. */
function extractImages(line) {
  const results = [];

  const mdRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let m;
  while ((m = mdRe.exec(line)) !== null) {
    const alt = m[1];
    const src = m[2]
      .trim()
      .split(/\s+/)[0]
      .replace(/^<|>$/g, "");
    results.push({ index: m.index, alt, path: src });
  }

  const htmlRe = /<(?:img|MDXImage|Image)\b[^>]*>/gi;
  let h;
  while ((h = htmlRe.exec(line)) !== null) {
    const tag = h[0];
    const altM = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
    const srcM = tag.match(/src\s*=\s*["']([^"']*)["']/i);
    results.push({
      index: h.index,
      alt: altM ? altM[1] : "",
      path: srcM ? srcM[1] : "",
    });
  }

  results.sort((a, b) => a.index - b.index);
  return results;
}

/** Tokenize MDX body into an ordered stream of headings, paragraphs, images. */
function tokenizeBody(body) {
  const lines = body.split(/\r?\n/);
  const tokens = [];
  let inFence = false;
  let paraBuffer = [];

  const flushPara = () => {
    if (paraBuffer.length) {
      const text = cleanInline(paraBuffer.join(" "));
      if (text) tokens.push({ type: "paragraph", text });
      paraBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (/^```/.test(trimmed) || /^~~~/.test(trimmed)) {
      inFence = !inFence;
      flushPara();
      continue;
    }
    if (inFence) continue;

    if (trimmed === "") {
      flushPara();
      continue;
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      flushPara();
      tokens.push({ type: "heading", text: cleanInline(heading[2]) });
      continue;
    }

    const imgs = extractImages(rawLine);
    if (imgs.length) {
      flushPara();
      const residual = cleanInline(
        rawLine
          .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
          .replace(/<(?:img|MDXImage|Image)\b[^>]*>/gi, "")
      );
      if (residual) tokens.push({ type: "paragraph", text: residual });
      for (const im of imgs) {
        tokens.push({ type: "image", alt: im.alt, path: im.path });
      }
      continue;
    }

    paraBuffer.push(trimmed);
  }
  flushPara();

  return tokens;
}

/** Nearest preceding token of a given type before index i. */
function nearestBefore(tokens, i, type) {
  for (let j = i - 1; j >= 0; j -= 1) {
    if (tokens[j].type === type) return tokens[j].text;
  }
  return "";
}

/** Nearest following token of a given type after index i. */
function nearestAfter(tokens, i, type) {
  for (let j = i + 1; j < tokens.length; j += 1) {
    if (tokens[j].type === type) return tokens[j].text;
  }
  return "";
}

function excerpt(s) {
  return String(s || "").slice(0, EXCERPT_LEN);
}

function fileNameFromPath(p) {
  if (!p) return "";
  const clean = String(p).split(/[?#]/)[0];
  return clean.split("/").pop() || "";
}

function classify(alt, altCounts) {
  const raw = String(alt || "").trim();
  if (!raw) return "missing";
  const norm = raw.toLowerCase();
  if ((altCounts[norm] || 0) >= 2) return "duplicate";
  if (GENERIC_RE.test(norm)) return "generic-templated";
  if (raw.split(/\s+/).filter(Boolean).length < 4) return "short";
  return "ok";
}

/** Quote every field for safe, standard CSV. */
function csvField(value) {
  const s = String(value === null || value === undefined ? "" : value);
  return `"${s.replace(/"/g, '""')}"`;
}

function csvRow(fields) {
  return fields.map(csvField).join(",");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function run() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(AI_DIR)) {
    fs.mkdirSync(AI_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const rows = []; // flat list of all image records (for CSV)
  const perPost = []; // { slug, total, statusCounts, maxRepeatAlt, maxRepeatCount }
  const globalAltCounts = Object.create(null); // normalized alt -> count across all posts

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");

    let data = {};
    let body = raw;
    try {
      const parsed = matter(raw);
      data = parsed.data || {};
      body = parsed.content || "";
    } catch {
      // Fall back to whole file as body if frontmatter parsing fails.
      data = {};
      body = raw;
    }

    const tokens = tokenizeBody(body);
    const firstParagraph = (() => {
      const p = tokens.find((t) => t.type === "paragraph");
      return p ? p.text : "";
    })();

    const images = [];

    // Cover image -> position 0
    if (data.coverImage) {
      images.push({
        path: String(data.coverImage),
        alt: data.coverImageAlt ? String(data.coverImageAlt) : "",
        precedingHeading: "",
        precedingParagraph: "",
        followingParagraph: firstParagraph,
      });
    }

    // Body images in document order
    tokens.forEach((tok, i) => {
      if (tok.type !== "image") return;
      images.push({
        path: tok.path,
        alt: tok.alt,
        precedingHeading: nearestBefore(tokens, i, "heading"),
        precedingParagraph: nearestBefore(tokens, i, "paragraph"),
        followingParagraph: nearestAfter(tokens, i, "paragraph"),
      });
    });

    // Per-post duplicate counts for classification
    const localAltCounts = Object.create(null);
    for (const im of images) {
      const norm = String(im.alt || "").trim().toLowerCase();
      if (norm) localAltCounts[norm] = (localAltCounts[norm] || 0) + 1;
    }

    const statusCounts = {
      ok: 0,
      duplicate: 0,
      "generic-templated": 0,
      missing: 0,
      short: 0,
    };

    images.forEach((im, position) => {
      const status = classify(im.alt, localAltCounts);
      statusCounts[status] += 1;

      const norm = String(im.alt || "").trim().toLowerCase();
      if (norm) {
        globalAltCounts[norm] = (globalAltCounts[norm] || 0) + 1;
      }

      rows.push([
        slug,
        position,
        im.path,
        fileNameFromPath(im.path),
        String(im.alt || ""),
        status,
        excerpt(im.precedingHeading),
        excerpt(im.precedingParagraph),
        excerpt(im.followingParagraph),
      ]);
    });

    // Worst single-alt repetition within this post
    let maxRepeatAlt = "";
    let maxRepeatCount = 0;
    for (const [norm, count] of Object.entries(localAltCounts)) {
      if (count > maxRepeatCount) {
        maxRepeatCount = count;
        maxRepeatAlt = norm;
      }
    }

    perPost.push({
      slug,
      total: images.length,
      statusCounts,
      maxRepeatAlt,
      maxRepeatCount,
    });
  }

  // -------------------------------------------------------------------------
  // Write CSV
  // -------------------------------------------------------------------------
  const header = [
    "post_slug",
    "image_position",
    "image_path",
    "image_filename",
    "current_alt",
    "status",
    "preceding_heading",
    "preceding_paragraph_excerpt",
    "following_paragraph_excerpt",
  ];
  const csv = [csvRow(header), ...rows.map(csvRow)].join("\n") + "\n";
  fs.writeFileSync(CSV_PATH, csv, "utf8");

  // -------------------------------------------------------------------------
  // Build summary.md
  // -------------------------------------------------------------------------
  const totalPosts = files.length;
  const totalImages = rows.length;

  const totals = {
    ok: 0,
    duplicate: 0,
    "generic-templated": 0,
    missing: 0,
    short: 0,
  };
  for (const r of rows) {
    totals[r[5]] += 1;
  }
  const pct = (n) =>
    totalImages === 0 ? "0.0" : ((n / totalImages) * 100).toFixed(1);

  // Top 10 posts by problematic images
  const problematic = (sc) =>
    sc.duplicate + sc["generic-templated"] + sc.missing;
  const topProblem = [...perPost]
    .map((p) => ({
      slug: p.slug,
      total: p.total,
      problematic: problematic(p.statusCounts),
    }))
    .filter((p) => p.problematic > 0)
    .sort((a, b) => b.problematic - a.problematic || b.total - a.total)
    .slice(0, 10);

  // Most common duplicate alt phrases across all posts
  const dupPhrases = Object.entries(globalAltCounts)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Posts with worst single-alt repetition (one alt repeats 5+ times)
  const worstRepetition = perPost
    .filter((p) => p.maxRepeatCount >= 5)
    .sort((a, b) => b.maxRepeatCount - a.maxRepeatCount)
    .slice(0, 20);

  const today = new Date().toISOString().slice(0, 10);
  const lines = [];

  lines.push(`# Image alt audit — summary (${today})`);
  lines.push("");
  lines.push(
    "Read-only baseline generated by [`scripts/audit-image-alts.mjs`](../scripts/audit-image-alts.mjs). " +
      "Raw per-image facts live in [`.ai/image-alt-audit.csv`](image-alt-audit.csv)."
  );
  lines.push("");

  lines.push("## Overall statistics");
  lines.push("");
  lines.push(`- Total posts scanned: ${totalPosts}`);
  lines.push(`- Total images: ${totalImages}`);
  lines.push("");
  lines.push("| Status | Count | % of images |");
  lines.push("| --- | ---: | ---: |");
  lines.push(`| ok | ${totals.ok} | ${pct(totals.ok)}% |`);
  lines.push(
    `| duplicate | ${totals.duplicate} | ${pct(totals.duplicate)}% |`
  );
  lines.push(
    `| generic-templated | ${totals["generic-templated"]} | ${pct(
      totals["generic-templated"]
    )}% |`
  );
  lines.push(`| missing | ${totals.missing} | ${pct(totals.missing)}% |`);
  lines.push(`| short | ${totals.short} | ${pct(totals.short)}% |`);
  lines.push("");

  lines.push("## Top 10 posts by number of problematic images");
  lines.push("");
  lines.push(
    "_Problematic = duplicate + generic-templated + missing._"
  );
  lines.push("");
  if (topProblem.length === 0) {
    lines.push("_No problematic images found._");
  } else {
    lines.push("| Post | Total images | Problematic | % problematic |");
    lines.push("| --- | ---: | ---: | ---: |");
    for (const p of topProblem) {
      const ratio =
        p.total === 0 ? "0.0" : ((p.problematic / p.total) * 100).toFixed(1);
      lines.push(
        `| ${p.slug} | ${p.total} | ${p.problematic} | ${ratio}% |`
      );
    }
  }
  lines.push("");

  lines.push("## Most common duplicate alt phrases (across all posts)");
  lines.push("");
  if (dupPhrases.length === 0) {
    lines.push("_No alt phrase is repeated across posts._");
  } else {
    lines.push("| Alt phrase | Occurrences |");
    lines.push("| --- | ---: |");
    for (const [phrase, count] of dupPhrases) {
      const safe = phrase.replace(/\|/g, "\\|");
      lines.push(`| ${safe} | ${count} |`);
    }
  }
  lines.push("");

  lines.push("## Posts with worst single-alt repetition");
  lines.push("");
  lines.push("_Posts where a single alt-text repeats 5 or more times._");
  lines.push("");
  if (worstRepetition.length === 0) {
    lines.push("_No post repeats a single alt-text 5+ times._");
  } else {
    lines.push("| Post | Repeated alt | Repeat count |");
    lines.push("| --- | --- | ---: |");
    for (const p of worstRepetition) {
      const safe = p.maxRepeatAlt.replace(/\|/g, "\\|");
      lines.push(`| ${p.slug} | ${safe} | ${p.maxRepeatCount} |`);
    }
  }
  lines.push("");

  lines.push("## Recommendations for Phase 2");
  lines.push("");
  lines.push(
    "- Prioritise the posts listed under \"Top 10 posts by number of problematic images\" — they concentrate the most alt issues."
  );
  lines.push(
    "- Replace duplicate and generic-templated alts with specific descriptions of what each screenshot actually shows, using the preceding heading and surrounding paragraph in the CSV as context."
  );
  lines.push(
    "- Fill every `missing` alt; the CSV already provides nearby text to ground an accurate description."
  );
  lines.push(
    "- Expand `short` alts (fewer than four words) into descriptive, sentence-case phrases."
  );
  lines.push(
    "- Keep all new alt-texts in sentence case and avoid keyword-stuffed templates per the project conventions in [`AGENTS.md`](../AGENTS.md)."
  );
  lines.push("");

  fs.writeFileSync(SUMMARY_PATH, lines.join("\n"), "utf8");

  // -------------------------------------------------------------------------
  // Console summary
  // -------------------------------------------------------------------------
  console.log("Image alt audit complete.");
  console.log(`  Posts scanned : ${totalPosts}`);
  console.log(`  Images found  : ${totalImages}`);
  console.log(
    `  ok=${totals.ok} duplicate=${totals.duplicate} ` +
      `generic-templated=${totals["generic-templated"]} ` +
      `missing=${totals.missing} short=${totals.short}`
  );
  console.log(`  CSV     -> ${path.relative(ROOT, CSV_PATH)}`);
  console.log(`  Summary -> ${path.relative(ROOT, SUMMARY_PATH)}`);
}

run();
