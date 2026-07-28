import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export type InlineCta = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export type BlogCategory = string;

export type AuthorLinks = {
  twitter?: string;
  linkedin?: string;
  website?: string;
  gumroad?: string;
};

export type Author = {
  slug: string;
  name: string;
  avatar: string;
  role?: string;
  links?: AuthorLinks;
};

export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  coverImage: string;
  thumbImage?: string;
  coverImageAlt?: string;
  tags?: string[];
  canonical?: string;
  category?: BlogCategory;
  subtitle?: string;
  metaTitle?: string;
  cardDescription?: string;
  inlineCta?: InlineCta;
  readingTimeText?: string;
  relatedSlugs?: string[];
  /** ISO date 'YYYY-MM' or 'YYYY-MM-DD' of the last content refresh. Drives the freshness signal in BlogHero/BlogMeta (rendering TODO Wave 5). */
  lastUpdated?: string;
};

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  mdxSource: MDXRemoteSerializeResult;
  readingTimeText: string;
  readingTimeMinutes: number;
  headings: BlogHeading[];
};

export type BlogPostMeta = {
  frontmatter: BlogFrontmatter;
  readingTimeText: string;
};
