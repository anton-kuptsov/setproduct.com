import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import BlogHero from "./BlogHero";
import BlogAuthor from "./BlogAuthor";
import BlogSidebar from "./BlogSidebar";
import BlogInlineCta from "./BlogInlineCta";
import BlogRelatedPosts from "./BlogRelatedPosts";
import CtaSubscribe from "../sections/CtaSubscribe";
import TemplateShowcase from "../sections/TemplateShowcase";
import { blogMdxComponents } from "./mdx-components";
import { buildBlogPostingJsonLd } from "../../lib/blog/schema";
import { SITE_URL } from "../../lib/blog/site-config";
import type { BlogPost, BlogPostMeta } from "../../types/blog";

type BlogPostLayoutProps = {
  post: BlogPost;
  relatedPosts: BlogPostMeta[];
  postUrl: string;
};

export default function BlogPostLayout({ post, relatedPosts, postUrl }: BlogPostLayoutProps) {
  const { frontmatter, mdxSource, readingTimeText, readingTimeMinutes, headings } = post;
  const canonical = frontmatter.canonical ?? `${SITE_URL}/blog/${frontmatter.slug}`;
  const absoluteCoverUrl = frontmatter.coverImage?.startsWith("http")
    ? frontmatter.coverImage
    : `${SITE_URL}${frontmatter.coverImage ?? ""}`;
  const jsonLd = buildBlogPostingJsonLd(frontmatter, canonical, readingTimeMinutes);

  return (
    <>
      <Head>
        <title>{frontmatter.metaTitle ?? frontmatter.title} | Setproduct Blog</title>
        <meta name="description" content={frontmatter.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={frontmatter.metaTitle ?? frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        <meta property="og:image" content={absoluteCoverUrl} />
        <meta property="og:url" content={canonical} />
        <meta property="article:published_time" content={frontmatter.date} />
        <meta property="article:author" content={frontmatter.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={frontmatter.metaTitle ?? frontmatter.title} />
        <meta name="twitter:description" content={frontmatter.description} />
        <meta name="twitter:image" content={absoluteCoverUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <SiteHeader />
      <main>
        <BlogHero
          title={frontmatter.title}
          articleTitle={frontmatter.articleTitle}
          subtitle={frontmatter.subtitle ?? frontmatter.description}
          coverImage={frontmatter.coverImage}
          coverImageAlt={frontmatter.coverImageAlt}
          date={frontmatter.date}
          readingTimeText={readingTimeText}
          category={frontmatter.category}
        />
        <div className="section">
          <div className="section-padding bottom-112">
            <div className="container">
              <div className="blogpost_content-section">
                <BlogSidebar
                  headings={headings}
                  postUrl={postUrl}
                  postTitle={frontmatter.title}
                />
                <div
                  id="w-node-content"
                  className="blogpost_content-column2"
                >
                  <BlogAuthor authorSlug={frontmatter.author} />
                  <div className="spacer-16" />
                  <div className="rich-text-18 w-richtext">
                    <MDXRemote {...mdxSource} components={blogMdxComponents} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {frontmatter.inlineCta && <BlogInlineCta cta={frontmatter.inlineCta} />}
        <CtaSubscribe />
        <BlogRelatedPosts posts={relatedPosts} />
        <TemplateShowcase />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
