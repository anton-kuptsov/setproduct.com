import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPostPreview } from "../../types/data";
import type { BlogFrontmatter } from "../../types/blog";
import { getAuthor } from "./authors";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

type FrontmatterWithDate = BlogFrontmatter & { date?: string };

type GetBlogPostPreviewsOptions = {
  maxPerCategory?: number;
  /** When set, only posts whose author resolves to this registered slug are returned. */
  authorSlug?: string;
};

export function getBlogPostPreviews(options: GetBlogPostPreviewsOptions = {}): BlogPostPreview[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const posts: Array<BlogPostPreview & { __date: string }> = [];
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const fallbackSlug = file.replace(/\.mdx$/, "");

    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      const frontmatter = data as FrontmatterWithDate;

      const slug = frontmatter.slug ?? fallbackSlug;
      const category = frontmatter.category ?? "Blog";
      const title = frontmatter.title ?? slug;
      const description = frontmatter.cardDescription ?? frontmatter.description ?? "";
      const image = frontmatter.coverImage ?? "";
      const thumbImage = frontmatter.thumbImage ?? image;
      const date = frontmatter.date ?? "";
      const author = frontmatter.author ?? "";

      posts.push({
        slug,
        title,
        description,
        image,
        thumbImage,
        category,
        author,
        __date: date,
      });
    } catch {
      // Skip malformed post files during preview aggregation.
    }
  }

  const authorFilter = options.authorSlug;
  const filteredPosts = authorFilter
    ? posts.filter((post) => getAuthor(post.author ?? "").slug === authorFilter)
    : posts;

  const sortedPosts = filteredPosts
    .sort((a, b) => b.__date.localeCompare(a.__date))
    .map(({ __date: _date, ...post }) => post);

  const maxPerCategory = options.maxPerCategory;
  if (!maxPerCategory || maxPerCategory < 1) {
    return sortedPosts;
  }

  const categoryCounts = new Map<string, number>();
  const limitedPosts: BlogPostPreview[] = [];

  for (const post of sortedPosts) {
    const currentCount = categoryCounts.get(post.category) ?? 0;
    if (currentCount >= maxPerCategory) continue;
    categoryCounts.set(post.category, currentCount + 1);
    limitedPosts.push(post);
  }

  return limitedPosts;
}
