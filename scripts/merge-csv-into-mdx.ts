import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const MAP_PATH = path.join(process.cwd(), ".sisyphus", "evidence", "csv-slug-to-fields.json");

const isDryRun = process.argv.includes("--dry-run");
const targetSlug = process.argv.find(a => a.startsWith("--slug="))?.split("=")[1];
const verbose = process.argv.includes("--verbose");

if (process.argv.includes("--help")) {
  console.log("Usage: npm run merge:blog-csv [-- --dry-run] [-- --slug=<slug>] [-- --verbose]");
  process.exit(0);
}

const csvMap = JSON.parse(fs.readFileSync(MAP_PATH, "utf8")) as Record<string, {
  category?: string;
  subtitle?: string;
  metaTitle?: string;
  cardDescription?: string;
  inlineCta?: { title: string; description: string; buttonText: string; buttonLink: string };
}>;

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".mdx"));
let updated = 0; let skipped = 0; let errors = 0;

for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  if (targetSlug && slug !== targetSlug) continue;

  const filePath = path.join(BLOG_DIR, file);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const csvFields = csvMap[slug];

    const newFm = { ...parsed.data };

    if (csvFields) {
      if (csvFields.category) newFm.category = csvFields.category;
      if (csvFields.subtitle) newFm.subtitle = csvFields.subtitle;
      if (csvFields.metaTitle) newFm.metaTitle = csvFields.metaTitle;
      if (csvFields.cardDescription) newFm.cardDescription = csvFields.cardDescription;
      if (csvFields.inlineCta) newFm.inlineCta = csvFields.inlineCta;
    } else {
      if (!newFm.category) newFm.category = "tutorials";
      if (verbose) console.log(`[NO CSV MATCH] ${slug} → default category: tutorials`);
    }

    const output = matter.stringify("\n" + parsed.content, newFm);

    if (isDryRun) {
      if (verbose) console.log(`[DRY-RUN] Would update: ${slug}`);
      updated++;
      continue;
    }

    fs.writeFileSync(filePath, output);
    updated++;
    if (verbose) console.log(`[UPDATED] ${slug}`);
  } catch (e) {
    errors++;
    console.error(`[ERROR] ${slug}:`, (e as Error).message);
  }
}

skipped = files.length - updated - errors;
console.log(`\nMerge complete:`);
console.log(`  Updated: ${updated}`);
console.log(`  Skipped: ${skipped}`);
console.log(`  Errors: ${errors}`);
