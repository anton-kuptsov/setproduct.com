#!/usr/bin/env tsx
/**
 * Migration script: converts legacy Webflow HTML blog posts to MDX with frontmatter.
 * Usage: npm run migrate:blog [-- --dry-run] [-- --slug=<slug>] [-- --overwrite] [-- --verbose]
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { URL } from "url";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// CLI flag parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const OVERWRITE = args.includes("--overwrite");
const VERBOSE = args.includes("--verbose");
const HELP = args.includes("--help") || args.includes("-h");
const SLUG_ARG = args.find((a) => a.startsWith("--slug="));
const TARGET_SLUG = SLUG_ARG ? SLUG_ARG.replace("--slug=", "") : null;

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const ROOT = path.resolve(process.cwd());
const LEGACY_DIR = path.join(ROOT, "legacy-pages", "blog");
const CONTENT_DIR = path.join(ROOT, "content", "blog");
const COVERS_DIR = path.join(ROOT, "public", "blog", "covers");
const ASSETS_DIR_BASE = path.join(ROOT, "public", "blog", "assets");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function log(msg: string) {
  if (VERBOSE) process.stdout.write(msg + "\n");
}

function logAlways(msg: string) {
  process.stdout.write(msg + "\n");
}

function logError(msg: string) {
  process.stderr.write("[ERROR] " + msg + "\n");
}

function logWarn(msg: string) {
  process.stderr.write("[WARN] " + msg + "\n");
}

/** Download a URL to a local file path. Returns true on success. */
async function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const destDir = path.dirname(dest);
    if (!DRY_RUN) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const makeRequest = (requestUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        logWarn(`Too many redirects for ${requestUrl}`);
        resolve(false);
        return;
      }
      const parsed = new URL(requestUrl);
      const protocol = parsed.protocol === "https:" ? https : http;
      protocol
        .get(requestUrl, (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            const redirectTo = new URL(
              res.headers.location,
              requestUrl
            ).toString();
            makeRequest(redirectTo, redirectCount + 1);
            return;
          }
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            logWarn(`Failed to download ${requestUrl}: HTTP ${res.statusCode}`);
            resolve(false);
            return;
          }
          if (DRY_RUN) {
            res.resume();
            resolve(true);
            return;
          }
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on("finish", () => {
            file.close(() => resolve(true));
          });
          file.on("error", (err) => {
            logWarn(`File write error for ${dest}: ${err.message}`);
            resolve(false);
          });
        })
        .on("error", (err) => {
          logWarn(`Download error for ${requestUrl}: ${err.message}`);
          resolve(false);
        });
    };

    makeRequest(url);
  });
}

/** Get file extension from URL, defaulting to .jpg */
function extFromUrl(url: string, defaultExt = ".jpg"): string {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const last = pathname.split("/").pop() ?? "";
    const dotIdx = last.lastIndexOf(".");
    if (dotIdx > 0) {
      const ext = last.slice(dotIdx).toLowerCase();
      // Sanity check — only well-known image extensions
      if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg", ".ico"].includes(ext)) {
        return ext;
      }
    }
  } catch {
    // ignore
  }
  return defaultExt;
}

/** Rewrite internal links the same way rewriteLegacyLinks does */
function rewriteLinks(html: string): string {
  return html
    .replace(/href="\.\.\/index\.html"/g, 'href="/"')
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(
      /href="\/(blog|templates|freebies|dashboard-templates)\/([^"]+)\.html"/g,
      'href="/$1/$2"'
    )
    .replace(
      /href="\.\.\/(blog|templates|freebies|dashboard-templates)\/([^"]+)\.html"/g,
      'href="/$1/$2"'
    )
    .replace(
      /href="(blog|templates|freebies|dashboard-templates)\/([^"]+)\.html"/g,
      'href="/$1/$2"'
    )
    .replace(/href="\.\.\/legal\/license\.html"/g, 'href="/legal/license"')
    .replace(
      /href="\.\.\/legal\/refunds-policy\.html"/g,
      'href="/legal/refunds-policy"'
    )
    .replace(/href="\/legal\/license\.html"/g, 'href="/legal/license"')
    .replace(
      /href="\/legal\/refunds-policy\.html"/g,
      'href="/legal/refunds-policy"'
    );
}

// ---------------------------------------------------------------------------
// Main per-file migration
// ---------------------------------------------------------------------------
async function migrateFile(
  htmlPath: string
): Promise<{ status: "migrated" | "skipped" | "error"; message?: string }> {
  const filename = path.basename(htmlPath, ".html");
  log(`\nProcessing: ${filename}`);

  let html: string;
  try {
    html = fs.readFileSync(htmlPath, "utf8");
  } catch (err) {
    return { status: "error", message: `Could not read file: ${(err as Error).message}` };
  }

  // Rewrite links before cheerio parse
  html = rewriteLinks(html);

  const $ = cheerio.load(html);

  // ------------------------------------------------------------------
  // 1. Extract metadata
  // ------------------------------------------------------------------
  const slug =
    $("html").attr("data-wf-item-slug") ||
    filename;

  log(`  slug: ${slug}`);

  // If --slug filter is active and doesn't match, skip
  // (This check is done upstream, but guard here too)
  if (TARGET_SLUG && slug !== TARGET_SLUG) {
    return { status: "skipped", message: "slug mismatch" };
  }

  // Idempotency check
  const targetPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!OVERWRITE && fs.existsSync(targetPath)) {
    log(`  Skipped (already exists): ${targetPath}`);
    return { status: "skipped", message: "already exists" };
  }

  const title =
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    slug;

  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  const canonical =
    $('link[rel="canonical"]').attr("href") ||
    `https://www.setproduct.com/blog/${slug}`;

  // ------------------------------------------------------------------
  // 2. Extract author / date
  // ------------------------------------------------------------------
  // Try explicit article meta
  let author =
    $('meta[property="article:author"]').attr("content") ||
    "";
  let date =
    $('meta[property="article:published_time"]').attr("content") ||
    "";

  // Try JSON-LD for date/author
  if (!author || !date) {
    $("script[type='application/ld+json']").each((_, el) => {
      try {
        const jsonText = $(el).html() || "";
        const jsonData = JSON.parse(jsonText);
        const schemas = Array.isArray(jsonData) ? jsonData : [jsonData];
        for (const schema of schemas) {
          if (!author && schema.author) {
            const a = Array.isArray(schema.author) ? schema.author[0] : schema.author;
            author = (a?.name ?? a ?? "").toString();
          }
          if (!date && (schema.datePublished || schema.dateCreated)) {
            date = schema.datePublished || schema.dateCreated;
          }
        }
      } catch {
        // ignore parse errors
      }
    });
  }

  // Try DOM: author name near .blogpost_author-wr
  if (!author) {
    const authorEl = $(".blogpost_author-wr .text-weight-semibold, .blogpost_author-wr p").first();
    author = authorEl.text().trim();
  }

  // Try DOM: date from hero info
  if (!date) {
    const heroParagraphs = $(".blogpost_hero-info-intro p");
    let rawDate = "";
    heroParagraphs.each((_, el) => {
      const txt = $(el).text().trim();
      // Look for patterns like "September 5, 2021" or "Oct 02, 2023"
      if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2},?\s+\d{4}/i.test(txt)) {
        rawDate = txt;
      }
    });
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        date = parsed.toISOString().split("T")[0];
      }
    }
  }

  // Defaults
  if (!author) author = "Setproduct Team";
  if (!date) {
    try {
      date = fs.statSync(htmlPath).mtime.toISOString().split("T")[0];
    } catch {
      date = new Date().toISOString().split("T")[0];
    }
  } else {
    // Normalize to YYYY-MM-DD if not already
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      date = parsed.toISOString().split("T")[0];
    }
  }

  log(`  author: ${author}`);
  log(`  date: ${date}`);

  // ------------------------------------------------------------------
  // 3. Extract cover image
  // ------------------------------------------------------------------
  let coverImage = "";
  let coverImageAlt = "";

  // First look in hero section
  const heroSection = $(".blogpost_hero-img-wr, .hero, .header, .banner").first();
  let coverSrc = "";
  let coverAlt = "";
  if (heroSection.length) {
    const img = heroSection.find("img").first();
    coverSrc = img.attr("src") || "";
    coverAlt = img.attr("alt") || "";
  }

  // Fallback: og:image
  if (!coverSrc) {
    coverSrc = $('meta[property="og:image"]').attr("content") || "";
  }

  // Fallback: first img in body that looks like a content image
  if (!coverSrc) {
    $("body img").each((_, el) => {
      if (coverSrc) return;
      const src = $(el).attr("src") || "";
      // Prefer Webflow CDN images
      if (
        src.includes("website-files.com") ||
        src.includes("webflow.com") ||
        src.includes("uploads-ssl")
      ) {
        coverSrc = src;
        coverAlt = $(el).attr("alt") || "";
      }
    });
  }

  if (coverSrc) {
    // Local /external/... path: convert to absolute URL for potential downloading
    // These are already local in this project, just rewrite to a nice path
    const isLocalExternal = coverSrc.startsWith("/external/");
    const isRemote = coverSrc.startsWith("http://") || coverSrc.startsWith("https://");

    const ext = extFromUrl(coverSrc);
    const localName = `${slug}${ext}`;
    const localPublicPath = `/blog/covers/${localName}`;
    const localFsPath = path.join(COVERS_DIR, localName);

    if (isLocalExternal) {
      // Already downloaded to /external/ — copy to public/blog/covers
      const externalFsPath = path.join(ROOT, coverSrc.slice(1));
      if (!DRY_RUN) {
        fs.mkdirSync(COVERS_DIR, { recursive: true });
        if (fs.existsSync(externalFsPath)) {
          if (!fs.existsSync(localFsPath) || OVERWRITE) {
            fs.copyFileSync(externalFsPath, localFsPath);
            log(`  Copied cover: ${externalFsPath} → ${localFsPath}`);
          }
        } else {
          logWarn(`  Cover source not found: ${externalFsPath}`);
        }
      }
      coverImage = localPublicPath;
      coverImageAlt = coverAlt;
    } else if (isRemote) {
      log(`  Downloading cover: ${coverSrc}`);
      const success = await downloadFile(coverSrc, localFsPath);
      if (success) {
        coverImage = localPublicPath;
        coverImageAlt = coverAlt;
        log(`  Cover downloaded to: ${localFsPath}`);
      } else {
        logWarn(`  Could not download cover for ${slug}`);
      }
    } else {
      // Relative or other — just keep as-is or skip
      coverImage = coverSrc;
      coverImageAlt = coverAlt;
    }
  }

  log(`  coverImage: ${coverImage}`);

  // ------------------------------------------------------------------
  // 4. Extract body content (the rich-text column)
  // ------------------------------------------------------------------

  // Target: the main article content div
  let $content = $(".blogpost_content-column2 .w-richtext, .rich-text-18.w-richtext").first();

  if (!$content.length) {
    // Fallback: any richtext
    $content = $(".w-richtext").first();
  }

  if (!$content.length) {
    // Final fallback: the full body stripped of nav/footer
    $("nav, .w-nav, [class*='navbar'], footer, .footer, [class*='footer']").remove();
    $("style, script").remove();
    $content = $("body");
  }

  // ------------------------------------------------------------------
  // 5. Clean the content element
  // ------------------------------------------------------------------

  $content.find("nav, .w-nav, [class*='navbar']").remove();
  $content.find("footer, .footer").remove();
  $content.find("style, script").remove();
  $content.find("form, .w-form").remove();
  $content.find(".blogpost_navigation-wr").remove();
  $content.find(".blogpost_content-cta-wr").remove();
  $content.find(".blogpost_content-share-wr").remove();
  $content.find(".blogpost_soc-links-wr").remove();
  $content.find(".hide-on-mobile, .hide-on-desktop").remove();

  // ------------------------------------------------------------------
  // 6. Handle inline images — download or rewrite paths
  // ------------------------------------------------------------------
  const assetDir = path.join(ASSETS_DIR_BASE, slug);
  let imgCounter = 0;

  const imgPromises: Promise<void>[] = [];

  $content.find("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    if (!src) return;

    const isLocalExternal = src.startsWith("/external/");
    const isRemote = src.startsWith("http://") || src.startsWith("https://");

    if (isLocalExternal || isRemote) {
      imgCounter++;
      const imgIndex = imgCounter;
      const ext = extFromUrl(src);
      const imgFilename = `img-${imgIndex}${ext}`;
      const imgLocalPath = path.join(assetDir, imgFilename);
      const imgPublicPath = `/blog/assets/${slug}/${imgFilename}`;

      if (isLocalExternal) {
        const externalFsPath = path.join(ROOT, src.slice(1));
        imgPromises.push(
          (async () => {
            if (!DRY_RUN) {
              fs.mkdirSync(assetDir, { recursive: true });
              if (fs.existsSync(externalFsPath)) {
                if (!fs.existsSync(imgLocalPath) || OVERWRITE) {
                  fs.copyFileSync(externalFsPath, imgLocalPath);
                }
              } else {
                logWarn(`  Inline image not found: ${externalFsPath}`);
              }
            }
            $(el).attr("src", imgPublicPath);
          })()
        );
      } else if (isRemote) {
        imgPromises.push(
          (async () => {
            log(`  Downloading inline img: ${src}`);
            const success = await downloadFile(src, imgLocalPath);
            if (success) {
              $(el).attr("src", imgPublicPath);
            } else {
              logWarn(`  Could not download inline image: ${src}`);
            }
          })()
        );
      }
    }
  });

  await Promise.all(imgPromises);

  // ------------------------------------------------------------------
  // 7. Convert HTML to Markdown via Turndown
  // ------------------------------------------------------------------
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    hr: "---",
    bulletListMarker: "-",
  });

  // Keep iframes as raw HTML
  td.addRule("iframe", {
    filter: "iframe",
    replacement: (_content, node) => {
      const el = node as Element;
      return "\n\n" + (el as unknown as { outerHTML: string }).outerHTML + "\n\n";
    },
  });

  // Convert figures with images
  td.addRule("figure", {
    filter: "figure",
    replacement: (content) => {
      return "\n\n" + content.trim() + "\n\n";
    },
  });

  // Images with proper markdown
  td.addRule("img", {
    filter: "img",
    replacement: (_content, node) => {
      const el = node as HTMLImageElement;
      const src = el.getAttribute("src") || "";
      const alt = el.getAttribute("alt") || "";
      if (!src) return "";
      return `![${alt}](${src})`;
    },
  });

  // Remove Webflow template placeholders like {{spacer-64}} from p tags
  // (they'll be stripped by turndown as empty paragraphs)

  const contentHtml = $content.html() || "";
  let markdownBody = td.turndown(contentHtml);

  markdownBody = markdownBody.replace(/\{\{[^}]+\}\}/g, "");
  markdownBody = markdownBody.replace(/\n{3,}/g, "\n\n");
  markdownBody = markdownBody.trim();

  // ------------------------------------------------------------------
  // 8. Build frontmatter
  // ------------------------------------------------------------------
  const frontmatter: Record<string, unknown> = {
    title,
    description,
    slug,
    date,
    author,
    coverImage,
    coverImageAlt,
    tags: [],
    canonical,
  };

  // ------------------------------------------------------------------
  // 9. Stringify and write
  // ------------------------------------------------------------------
  const mdxContent = matter.stringify("\n" + markdownBody, frontmatter);

  if (VERBOSE) {
    logAlways(`  --- frontmatter preview ---`);
    logAlways(`  title: ${title}`);
    logAlways(`  description: ${description.slice(0, 80)}...`);
    logAlways(`  slug: ${slug}`);
    logAlways(`  date: ${date}`);
    logAlways(`  author: ${author}`);
    logAlways(`  coverImage: ${coverImage}`);
    logAlways(`  canonical: ${canonical}`);
    logAlways(`  --- end preview ---`);
  }

  if (DRY_RUN) {
    logAlways(`[dry-run] Would write: ${targetPath}`);
    logAlways(`[dry-run] title: ${title}`);
    logAlways(`[dry-run] slug: ${slug}`);
    logAlways(`[dry-run] date: ${date}`);
    logAlways(`[dry-run] author: ${author}`);
    logAlways(`[dry-run] coverImage: ${coverImage}`);
    return { status: "migrated" };
  }

  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(targetPath, mdxContent, "utf8");
  log(`  Written: ${targetPath}`);

  return { status: "migrated" };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
async function main() {
  if (HELP) {
    logAlways(`
migrate-blog-html-to-mdx — Convert legacy Webflow HTML blog posts to MDX

Usage:
  npm run migrate:blog [-- <flags>]

Flags:
  --dry-run       Preview only, do not write any files
  --slug=<slug>   Process only the specific post with this slug
  --overwrite     Re-migrate even if target .mdx already exists
  --verbose       Show detailed per-file logging
  --help, -h      Show this help message

Examples:
  npm run migrate:blog -- --dry-run
  npm run migrate:blog -- --slug=accordion-ui-design --verbose
  npm run migrate:blog -- --overwrite
    `.trim());
    process.exit(0);
  }

  const startTime = Date.now();

  // Collect HTML files
  let files: string[];
  try {
    files = fs
      .readdirSync(LEGACY_DIR)
      .filter((f) => f.endsWith(".html"))
      .map((f) => path.join(LEGACY_DIR, f));
  } catch (err) {
    logError(`Cannot read legacy-pages/blog directory: ${(err as Error).message}`);
    process.exit(1);
  }

  if (files.length === 0) {
    logAlways("No HTML files found in legacy-pages/blog/");
    process.exit(0);
  }

  // If --slug filter, find the file
  if (TARGET_SLUG) {
    // Filter by filename OR by html data-wf-item-slug (try filename first)
    const byFilename = files.find(
      (f) => path.basename(f, ".html") === TARGET_SLUG
    );
    if (!byFilename) {
      logAlways(`Slug "${TARGET_SLUG}" not found in legacy-pages/blog/`);
      process.exit(1);
    }
    files = [byFilename];
  }

  log(`Found ${files.length} file(s) to process`);
  if (DRY_RUN) logAlways("[dry-run mode — no files will be written]");

  let migrated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const filePath of files) {
    try {
      const result = await migrateFile(filePath);
      if (result.status === "migrated") migrated++;
      else if (result.status === "skipped") skipped++;
    } catch (err) {
      const msg = `${path.basename(filePath)}: ${(err as Error).message}`;
      logError(msg);
      errors.push(msg);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  logAlways(`
Migration complete:
  Migrated: ${migrated} / ${files.length}
  Skipped (exists): ${skipped}
  Errors: ${errors.length}
  Time: ${elapsed}s`);

  if (errors.length > 0) {
    logAlways("\nErrors:");
    errors.forEach((e) => logAlways(`  - ${e}`));
  }
}

main().catch((err) => {
  logError(`Fatal: ${err.message}`);
  process.exit(1);
});
