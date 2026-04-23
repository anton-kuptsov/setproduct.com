import type { GetServerSideProps } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { TEMPLATE_PRODUCTS } from "../data/templates-listing";
import { FREEBIE_PRODUCTS } from "../data/freebies-listing";
import { DASHBOARD_TEMPLATES } from "../data/dashboard-templates";

const SITE_URL = "https://www.setproduct.com";

const STATIC_PATHS = [
  "/",
  "/all",
  "/blog",
  "/bundle",
  "/code",
  "/dashboards",
  "/dataviz",
  "/freebies",
  "/legal/license",
  "/legal/refunds-policy",
  "/legal/terms-of-paid-posts",
  "/mobile",
  "/search",
  "/testimonials",
  "/websites",
];

type Entry = { loc: string; lastmod?: string };

function readBlogEntries(): Entry[] {
  const dir = path.join(process.cwd(), "content", "blog");
  if (!fs.existsSync(dir)) return [];
  const entries: Entry[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    let lastmod: string | undefined;
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      const date = (data as { date?: string }).date;
      if (date) {
        const d = new Date(date);
        if (!Number.isNaN(d.getTime())) lastmod = d.toISOString().slice(0, 10);
      }
    } catch {
      // ignore malformed frontmatter
    }
    entries.push({ loc: `${SITE_URL}/blog/${slug}`, lastmod });
  }
  entries.push({ loc: `${SITE_URL}/blog` });
  return entries;
}

function buildEntries(): Entry[] {
  const today = new Date().toISOString().slice(0, 10);

  const staticEntries: Entry[] = STATIC_PATHS.map((p) => ({
    loc: p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`,
    lastmod: today,
  }));

  const templateEntries: Entry[] = TEMPLATE_PRODUCTS.map((t) => ({
    loc: `${SITE_URL}/templates/${t.slug}`,
    lastmod: today,
  }));

  const freebieEntries: Entry[] = FREEBIE_PRODUCTS.map((f) => ({
    loc: `${SITE_URL}/freebies/${f.slug}`,
    lastmod: today,
  }));

  const dashboardEntries: Entry[] = DASHBOARD_TEMPLATES.map((d) => ({
    loc: `${SITE_URL}/dashboard-templates/${d.slug}`,
    lastmod: today,
  }));

  const blogEntries = readBlogEntries();

  const all = [
    ...staticEntries,
    ...blogEntries,
    ...templateEntries,
    ...freebieEntries,
    ...dashboardEntries,
  ];

  const seen = new Set<string>();
  return all.filter((e) => {
    if (seen.has(e.loc)) return false;
    seen.add(e.loc);
    return true;
  });
}

function renderXml(entries: Entry[]): string {
  const urls = entries
    .map(({ loc, lastmod }) => {
      const parts = [`    <loc>${loc}</loc>`];
      if (lastmod) parts.push(`    <lastmod>${lastmod}</lastmod>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = renderXml(buildEntries());
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
