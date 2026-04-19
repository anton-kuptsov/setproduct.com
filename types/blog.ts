import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export type InlineCta = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export type BlogCategory =
  | "tutorials"
  | "technology"
  | "startups-saas"
  | "growth-hacking"
  | "inspiration"
  | "resources"
  | "research"
  | string;

export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  coverImage: string;
  coverImageAlt?: string;
  tags?: string[];
  canonical?: string;
  category?: BlogCategory;
  subtitle?: string;
  metaTitle?: string;
  cardDescription?: string;
  inlineCta?: InlineCta;
  readingTimeText?: string;
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
