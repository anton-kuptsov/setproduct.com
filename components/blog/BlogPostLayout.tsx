import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import BlogHero from "./BlogHero";
import BlogMeta from "./BlogMeta";
import { blogMdxComponents } from "./mdx-components";
import { buildBlogPostingJsonLd } from "../../lib/blog/schema";
import { SITE_URL } from "../../lib/blog/site-config";
import type { BlogPost } from "../../types/blog";

type BlogPostLayoutProps = {
  post: BlogPost;
};

export default function BlogPostLayout({ post }: BlogPostLayoutProps) {
  const { frontmatter, mdxSource, readingTimeText, readingTimeMinutes } = post;
  const canonical =
    frontmatter.canonical ?? `${SITE_URL}/blog/${frontmatter.slug}`;
  const absoluteCoverUrl = frontmatter.coverImage?.startsWith("http")
    ? frontmatter.coverImage
    : `${SITE_URL}${frontmatter.coverImage ?? ""}`;
  const jsonLd = buildBlogPostingJsonLd(frontmatter, canonical, readingTimeMinutes);

  return (
    <>
      <Head>
        <title>{frontmatter.title} | Setproduct Blog</title>
        <meta name="description" content={frontmatter.description} />
        <link rel="canonical" href={canonical} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        <meta property="og:image" content={absoluteCoverUrl} />
        <meta property="og:url" content={canonical} />
        <meta property="article:published_time" content={frontmatter.date} />
        <meta property="article:author" content={frontmatter.author} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={frontmatter.title} />
        <meta name="twitter:description" content={frontmatter.description} />
        <meta name="twitter:image" content={absoluteCoverUrl} />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <SiteHeader />
      <main>
        <article className="max-w-3xl mx-auto px-4 py-12">
          <BlogHero
            title={frontmatter.title}
            coverImage={frontmatter.coverImage}
            coverImageAlt={frontmatter.coverImageAlt}
          />
          <BlogMeta
            author={frontmatter.author}
            date={frontmatter.date}
            readingTimeText={readingTimeText}
          />
          <div className="prose prose-lg max-w-none">
            <MDXRemote {...mdxSource} components={blogMdxComponents} />
          </div>
        </article>
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
