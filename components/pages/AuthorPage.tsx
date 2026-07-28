import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import ArrowIcon from "../sections/ArrowIcon";
import { TwitterIcon, LinkedInIcon, GlobeIcon } from "../layout/FooterSocialIcons";
import { buildPersonJsonLd } from "../../lib/blog/schema";
import { SITE_URL } from "../../lib/blog/site-config";
import type { Author } from "../../types/blog";
import type { BlogPostPreview } from "../../types/data";

const PAGE_SIZE = 9;

type Props = {
  author: Author;
  authorPosts: BlogPostPreview[];
  blogPosts?: BlogPostPreview[];
};

export default function AuthorPage({ author, authorPosts, blogPosts = [] }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const postCount = authorPosts.length;
  const canonical = `${SITE_URL}/authors/${author.slug}`;
  const metaTitle = `Posts by ${author.name} | Setproduct`;
  const metaDescription = `${postCount} ${
    postCount === 1 ? "article" : "articles"
  } by ${author.name} on UI design, design systems, and product UX.`;
  const absoluteAvatar = author.avatar.startsWith("http")
    ? author.avatar
    : `${SITE_URL}${author.avatar}`;

  const personJsonLd = buildPersonJsonLd(author);

  const visiblePosts = authorPosts.slice(0, visibleCount);
  const hasMore = visibleCount < postCount;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta content={metaDescription} name="description" />
        <link href={canonical} rel="canonical" />
        <meta content={metaTitle} property="og:title" />
        <meta content={metaDescription} property="og:description" />
        <meta content={canonical} property="og:url" />
        <meta content="profile" property="og:type" />
        <meta content={absoluteAvatar} property="og:image" />
        <meta content="summary" name="twitter:card" />
        <meta content={metaTitle} name="twitter:title" />
        <meta content={metaDescription} name="twitter:description" />
        <meta content={absoluteAvatar} name="twitter:image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </Head>
      <SiteHeader blogPosts={blogPosts} />
      <main className="mt-22.5">
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="blog_hero-section">
                <div className="heading-left-text-wr">
                  <div
                    className="blogpost_author-img"
                    style={{ width: 96, height: 96, marginBottom: "0.5em" }}
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      width={96}
                      height={96}
                      className="image-cover"
                      loading="eager"
                      style={{ color: "transparent" }}
                    />
                  </div>
                  <h1 className="heading-style-h2">{author.name}</h1>
                  {author.role && <div className="heading-style-h5">{author.role}</div>}
                  {author.links && (
                    <div
                      className="hero-cta-row"
                      style={{ marginTop: "0.75em", display: "flex", gap: "0.75em" }}
                    >
                      {author.links.twitter && (
                        <a
                          href={author.links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-inline-block"
                          aria-label={`${author.name} on X`}
                        >
                          <TwitterIcon width={24} height={24} />
                        </a>
                      )}
                      {author.links.linkedin && (
                        <a
                          href={author.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-inline-block"
                          aria-label={`${author.name} on LinkedIn`}
                        >
                          <LinkedInIcon width={24} height={24} />
                        </a>
                      )}
                      {author.links.website && (
                        <a
                          href={author.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-inline-block"
                          aria-label={`${author.name} website`}
                        >
                          <GlobeIcon width={24} height={24} />
                        </a>
                      )}
                      {author.links.gumroad && (
                        <a
                          href={author.links.gumroad}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-inline-block"
                          aria-label={`${author.name} on Gumroad`}
                        >
                          <GlobeIcon width={24} height={24} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="spacer-64" />

              <div className="w-dyn-list">
                <div className="blog_list w-dyn-items" role="list">
                  {visiblePosts.map((post, index) => (
                    <div key={post.slug} className="blog_list-item w-dyn-item" role="listitem">
                      <div className="blog_list-item-wr">
                        <Link
                          className="blog_list-item-img-wr w-inline-block relative"
                          href={`/blog/${post.slug}`}
                        >
                          <Image
                            alt=""
                            src={post.image}
                            fill
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="image-cover"
                          />
                        </Link>
                        <div className="blog_list-item-info">
                          <div className="main_blog-liist1-item-info-row">
                            <div className="category-tag">
                              <p className="text-size-tiny text-weight-semibold">{post.category}</p>
                            </div>
                          </div>
                          <Link
                            className="blog_liist-item-heading-wr w-inline-block"
                            href={`/blog/${post.slug}`}
                          >
                            <p className="heading-style-h5 text-style-2lines">{post.title}</p>
                          </Link>
                          <p className="text-size-small text-style-3lines">{post.description}</p>
                          <div className="main_blog-liist-item-btn-wr">
                            <Link
                              className="button-x-small is-text w-inline-block"
                              href={`/blog/${post.slug}`}
                            >
                              <div className="text-size-regular text-weight-bold">Read more</div>
                              <div className="button-icon is-small text-color-primary w-embed">
                                <ArrowIcon />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                    <a
                      className="button-small outlined w-inline-block"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setVisibleCount((c) => c + PAGE_SIZE);
                      }}
                    >
                      <div className="text-size-medium text-weight-bold">Load More</div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
