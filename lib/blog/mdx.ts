import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import type { BlogFrontmatter, BlogHeading, BlogPost, BlogPostMeta } from "../../types/blog";
import { computeReadingTime } from "./reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function extractHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const h3 = line.match(/^###\s+(.+)$/);
    const h2 = !h3 && line.match(/^##\s+(.+)$/);
    if (h3) {
      const text = h3[1].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      headings.push({ id, text, level: 3 });
    } else if (h2) {
      const text = h2[1].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      headings.push({ id, text, level: 2 });
    }
  }
  return headings;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = data as BlogFrontmatter;

    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
      },
    });

    const { text, minutes } = computeReadingTime(content);
    const headings = extractHeadings(content);

    return {
      frontmatter,
      mdxSource,
      readingTimeText: frontmatter.readingTimeText ?? text,
      readingTimeMinutes: minutes,
      headings,
    };
  } catch {
    return null;
  }
}

export function getAllBlogPostsMeta(): BlogPostMeta[] {
  return getAllBlogSlugs()
    .map((slug) => {
      const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(raw);
        const { text } = computeReadingTime(content);
        return {
          frontmatter: data as BlogFrontmatter,
          readingTimeText: text,
        };
      } catch {
        return null;
      }
    })
    .filter((post): post is BlogPostMeta => post !== null);
}

export function getRelatedPosts(
  currentSlug: string,
  category: string | undefined,
  limit = 3
): BlogPostMeta[] {
  const all = getAllBlogPostsMeta();
  const sameCategory = category
    ? all.filter(
        (p) =>
          p.frontmatter.category === category &&
          p.frontmatter.slug !== currentSlug
      )
    : [];
  const others = all.filter(
    (p) =>
      p.frontmatter.slug !== currentSlug && !sameCategory.includes(p)
  );
  const combined = [...sameCategory, ...others];
  return combined.slice(0, limit);
}
