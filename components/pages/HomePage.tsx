import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import TemplateGrid from "../sections/TemplateGrid";
import BlogPostsHome from "../sections/BlogPostsHome";
import FaqSection from "../sections/FaqSection";
import ArrowIcon from "../sections/ArrowIcon";
import { PAGE_META } from "../../data/pages-meta";
import { PRODUCTS } from "../../data/products";
import { PAGE_FAQ } from "../../data/faq";
import { HOME_BLOG_CATEGORIES } from "../../data/blog-categories";
import type { BlogPostPreview } from "../../types/data";

const HOME_TEMPLATES_INITIAL = 15;
const HOME_TEMPLATES_PAGE = 15;


type Props = {
  blogPosts: BlogPostPreview[];
};

export default function HomePage({ blogPosts = [] }: Props) {
  const meta = PAGE_META.index;
  const faq = PAGE_FAQ.index ?? [];
  const [templatesVisible, setTemplatesVisible] = useState(HOME_TEMPLATES_INITIAL);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader blogPosts={blogPosts} />
      <main className="mt-18">
        <div className="section">
          <div className="section-padding top-80 bottom-64">
            <div className="container">
              <div className="main_hero-section">
                <div className="heading-center-wr">
                  <h1 className="heading-style-h1">
                    Find <span className="span-gradient">UI inspiration</span> that feels shippable
                  </h1>
                  <div className="max-width-800">
                    <div className="heading-style-h5">
                      A curated AI gallery of UI components and patterns you can actually use.
                      <br />
                      New images weekly. Search by component. Like to build your library.
                    </div>
                  </div>
                  <div className="spacer-16" />
                  <div className="hero-cta-row">
                    <a className="button w-inline-block" href="https://app.setproduct.com">
                      <div className="text-size-large text-weight-bold">Launch App</div>
                    </a>
                    <Link className="button secondary w-inline-block" href="/all">
                      <div className="text-size-large text-weight-bold">Browse UI kits</div>
                      <div className="button-icon w-embed"><ArrowIcon /></div>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="spacer-40" />

              <BlogPostsHome posts={blogPosts} categories={HOME_BLOG_CATEGORIES} />
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-padding top-80 bottom-64">
            <div className="container">
              <div className="heading-center-wr mob-align-left">
                <h2 className="heading-style-h2">Browse our collection of Figma templates &amp; UI kits</h2>
              </div>
              <div className="spacer-32" />
              <TemplateGrid
                products={PRODUCTS}
                variant="home"
                visibleCount={templatesVisible}
                onLoadMore={() => setTemplatesVisible((c) => c + HOME_TEMPLATES_PAGE)}
              />
            </div>
          </div>
        </div>

        {faq.length > 0 && (
          <FaqSection items={faq} title="Your questions answered" />
        )}
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
