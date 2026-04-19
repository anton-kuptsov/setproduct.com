import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const CSV_PATH = "/Users/antonkuptsov/Downloads/Setproduct - Blog Posts - 65f1a0e98262e6d78310837e.csv";
const EVIDENCE_DIR = path.join(process.cwd(), ".sisyphus", "evidence");

const raw = fs.readFileSync(CSV_PATH, "utf8");
const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  relax_quotes: true,
  relax_column_count: true,
}) as Record<string, string>[];

interface InlineCta {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface SlugFields {
  category?: string;
  subtitle?: string;
  h1Title?: string;
  metaTitle?: string;
  cardDescription?: string;
  inlineCta?: InlineCta;
}

const slugToFields: Record<string, SlugFields> = {};
const categories = new Set<string>();
const authors = new Set<string>();
let inlineCtaCount = 0;

for (const row of records) {
  const slug = (row["Slug"] || "").trim();
  if (!slug) continue;

  const category = (row["Category"] || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and");
  const subtitle = (row["Blog post Subtitle"] || "").trim();
  const h1Title = (row["Blog post Title - Heading H1"] || "").trim();
  const metaTitle = (row["Meta Title (SEO)"] || "").trim();
  const cardDescription = (row["Card Description"] || "").trim();
  const ctaTitle = (row["Section CTA Title"] || "").trim();
  const ctaDescription = (row["Section CTA Description"] || "").trim();
  const ctaButtonText = (row["Section CTA Button text"] || "").trim();
  const ctaButtonLink = (row["Section CTA Button link"] || "").trim();
  const author = (row["Author"] || "").trim();

  if (category) categories.add(category);
  if (author) authors.add(author);

  const inlineCta: InlineCta | undefined = ctaTitle
    ? { title: ctaTitle, description: ctaDescription, buttonText: ctaButtonText, buttonLink: ctaButtonLink }
    : undefined;
  if (inlineCta) inlineCtaCount++;

  slugToFields[slug] = {
    category: category || undefined,
    subtitle: subtitle || undefined,
    h1Title: h1Title || undefined,
    metaTitle: metaTitle || undefined,
    cardDescription: cardDescription || undefined,
    inlineCta,
  };
}

fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

fs.writeFileSync(
  path.join(EVIDENCE_DIR, "csv-slug-to-fields.json"),
  JSON.stringify(slugToFields, null, 2)
);

const analysis = {
  totalRows: records.length,
  uniqueCategories: [...categories].sort(),
  uniqueAuthors: [...authors].sort(),
  inlineCtaCount,
  sampleSlugs: Object.keys(slugToFields).slice(0, 5),
};

fs.writeFileSync(
  path.join(EVIDENCE_DIR, "csv-analysis.json"),
  JSON.stringify(analysis, null, 2)
);

console.log("Analysis complete:", JSON.stringify(analysis, null, 2));
