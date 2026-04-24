import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import type { BlogFrontmatter, BlogHeading, BlogPost, BlogPostMeta } from "../../types/blog";
import { computeReadingTime } from "./reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function stripInlineMarkdown(raw: string): string {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1$2")
    .replace(/(^|[^_])_([^_]+)_/g, "$1$2")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\\([\\`*_{}\[\]()#+\-.!])/g, "$1")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const h3 = line.match(/^###\s+(.+)$/);
    const h2 = !h3 && line.match(/^##\s+(.+)$/);
    if (h3) {
      const text = stripInlineMarkdown(h3[1]);
      headings.push({ id: slugify(text), text, level: 3 });
    } else if (h2) {
      const text = stripInlineMarkdown(h2[1]);
      headings.push({ id: slugify(text), text, level: 2 });
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
        rehypePlugins: [
          rehypeSlug,
          rehypeHighlight,
        ],
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
  limit = 3,
  relatedSlugs?: string[]
): BlogPostMeta[] {
  if (relatedSlugs && relatedSlugs.length > 0) {
    const all = getAllBlogPostsMeta();
    const metaMap = new Map(all.map(p => [p.frontmatter.slug, p]));
    const result: BlogPostMeta[] = [];
    for (const slug of relatedSlugs) {
      const meta = metaMap.get(slug);
      if (meta && slug !== currentSlug) {
        result.push(meta);
        if (result.length >= limit) break;
      }
    }
    if (result.length > 0) return result;
  }

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
  return [...sameCategory, ...others].slice(0, limit);
}
