import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./BlogListingPage.module.css";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import ArrowIcon from "../sections/ArrowIcon";
import CtaSubscribe from "../sections/CtaSubscribe";
import TemplateShowcase from "../sections/TemplateShowcase";
import { PAGE_META } from "../../data/pages-meta";
import { BLOG_POSTS } from "../../data/blog-listing";
import { BLOG_CATEGORIES } from "../../data/blog-categories";

const PAGE_SIZE = 8;

export default function BlogListingPage() {
  const meta = PAGE_META.blog;
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.category;
    const next = Array.isArray(raw) ? raw[0] : raw;
    setActiveCategory(next ? String(next) : null);
    setVisibleCount(PAGE_SIZE);
  }, [router.isReady, router.query.category]);

  const filteredPosts = activeCategory
    ? BLOG_POSTS.filter((p) => p.category === activeCategory)
    : BLOG_POSTS;
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleCategory = (cat: string | null) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
    const nextQuery = { ...router.query };
    if (cat) {
      nextQuery.category = cat;
    } else {
      delete nextQuery.category;
    }
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true, scroll: false });
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main className={`mt-18 ${styles.blogLayoutTweaks}`}>
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="blog_hero-section">
                <div className="heading-left-text-wr max-width-900">
                  <h1 className="heading-style-h1 is-smaller-on-mob">
                    Design, Build, Scale: Publications for ambitious creators &amp; founders
                  </h1>
                  <h2 className="heading-style-h5 mob-18">
                    Hard-won UI/UX lessons, technical deep dives, and growth playbooks for designers, coders and indie hackers
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-padding bottom-112">
            <div className="container">
              <div className="blog_list-section">
                <div className="blog_list-head">
                  <div className="heading-style-h5">{filteredPosts.length} Articles</div>
                </div>
                <div className="spacer-40" />
                <div className="blog_list-component">
                  <div className="blog_list-filters-wr">
                    <div className="blog_list-filters-inner">
                      <div
                        className={`blog_list-filters-item${activeCategory === null ? " fs-cmsfilter_active" : ""}`}
                        onClick={() => handleCategory(null)}
                        role="button"
                        tabIndex={0}
                        style={{ cursor: "pointer" }}
                      >
                        <p className="text-size-regular">View all</p>
                      </div>
                      {BLOG_CATEGORIES.map((cat) => (
                        <div
                          key={cat}
                          className={`blog_list-filters-item${activeCategory === cat ? " fs-cmsfilter_active" : ""}`}
                          onClick={() => handleCategory(cat)}
                          role="button"
                          tabIndex={0}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="text-size-regular">{cat}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-dyn-list">
                    <div className="blog_list w-dyn-items" role="list">
                      {visiblePosts.map((post) => (
                        <div key={post.slug} className="blog_list-item w-dyn-item" role="listitem">
                          <div className="blog_list-item-wr">
                            <Link className="blog_list-item-img-wr w-inline-block" href={`/blog/${post.slug}`}>
                              <img alt="" className="image-cover" loading="lazy" src={post.image} />
                            </Link>
                            <div className="blog_list-item-info">
                              <div className="main_blog-liist1-item-info-row">
                                <div className="category-tag">
                                  <p className="text-size-tiny text-weight-semibold">{post.category}</p>
                                </div>
                              </div>
                              <Link className="blog_liist-item-heading-wr w-inline-block" href={`/blog/${post.slug}`}>
                                <p className="heading-style-h5 text-style-2lines">{post.title}</p>
                              </Link>
                              <p className="text-size-small text-style-3lines">{post.description}</p>
                              <div className="main_blog-liist-item-btn-wr">
                                <Link className="button-x-small is-text w-inline-block" href={`/blog/${post.slug}`}>
                                  <div className="text-size-regular text-weight-bold">Read more</div>
                                  <div className="button-icon is-small text-color-primary w-embed"><ArrowIcon /></div>
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
                          onClick={(e) => { e.preventDefault(); setVisibleCount((c) => c + PAGE_SIZE); }}
                        >
                          <div className="text-size-medium text-weight-bold">Load More</div>
                        </a>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <CtaSubscribe />
        <TemplateShowcase />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
