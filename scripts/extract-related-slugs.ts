import fs from "fs";
import path from "path";
import matter from "gray-matter";

const LEGACY_DIR = path.join(process.cwd(), "legacy-pages", "blog");
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const isDryRun = process.argv.includes("--dry-run");
const targetSlug = process.argv.find(a => a.startsWith("--slug="))?.split("=")[1];

const files = fs.readdirSync(LEGACY_DIR).filter(f => f.endsWith(".html"));
let updated = 0; let errors = 0;

for (const file of files) {
  const slug = file.replace(/\.html$/, "");
  if (targetSlug && slug !== targetSlug) continue;

  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    console.log(`[SKIP] No MDX for: ${slug}`);
    continue;
  }

  try {
    const html = fs.readFileSync(path.join(LEGACY_DIR, file), "utf8");

    // Extract related slugs from main_blog-liist1-item-img-wr links
    const relatedSlugs: string[] = [];
    const regex = /main_blog-liist1-item-img-wr[^"]*"\s+href="\/blog\/([^"]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const relSlug = match[1];
      if (relSlug && !relatedSlugs.includes(relSlug)) {
        relatedSlugs.push(relSlug);
      }
    }

    if (relatedSlugs.length === 0) {
      console.log(`[WARN] No related found for: ${slug}`);
      continue;
    }

    const raw = fs.readFileSync(mdxPath, "utf8");
    const parsed = matter(raw);
    parsed.data.relatedSlugs = relatedSlugs;

    if (!isDryRun) {
      fs.writeFileSync(mdxPath, matter.stringify("\n" + parsed.content, parsed.data));
    }

    updated++;
    console.log(`[OK] ${slug}: ${relatedSlugs.join(", ")}`);
  } catch (e) {
    errors++;
    console.error(`[ERROR] ${slug}:`, (e as Error).message);
  }
}

console.log(`\nDone: updated=${updated}, errors=${errors}`);
