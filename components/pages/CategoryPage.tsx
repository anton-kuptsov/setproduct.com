import { useState } from "react";
import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import CategoryTabs from "../sections/CategoryTabs";
import TemplateGrid from "../sections/TemplateGrid";
import FaqSection from "../sections/FaqSection";
import CtaSubscribe from "../sections/CtaSubscribe";
import { CATEGORY_TABS } from "../../data/categories";
import type { Product } from "../../types/data";
import type { FaqItem } from "../../types/data";
import type { BreadcrumbItem } from "../../types/data";

const PAGE_SIZE = 8;

type Props = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  breadcrumbs: BreadcrumbItem[];
  products: Product[];
  faq: FaqItem[];
};

export default function CategoryPage({
  slug,
  title,
  description,
  metaTitle,
  metaDescription,
  canonical,
  breadcrumbs,
  products,
  faq,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta content={metaDescription} name="description" />
        <link href={canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main className="mt-22.5">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="blog_hero-section">
                <div className="heading-left-text-wr">
                  <h1 className="heading-style-h1">{title}</h1>
                  <div className="heading-style-h5">{description}</div>
                </div>
              </div>
              <div className="spacer-64" />
              <div className="templates_list-section">
                <CategoryTabs tabs={CATEGORY_TABS} activeSlug={slug} />
                <div className="spacer-40" />
                <TemplateGrid
                  products={products}
                  visibleCount={visibleCount}
                  onLoadMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
                />
              </div>
            </div>
          </div>
        </div>
        <CtaSubscribe />
        {faq.length > 0 && <FaqSection items={faq} />}
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
