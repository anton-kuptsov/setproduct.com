import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import BundleCard from "../sections/BundleCard";
import CategoryTabs from "../sections/CategoryTabs";
import CtaSubscribe from "../sections/CtaSubscribe";
import TemplateShowcase from "../sections/TemplateShowcase";
import FaqSection from "../sections/FaqSection";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";
import { PAGE_FAQ } from "../../data/faq";
import { BUNDLES } from "../../data/bundles";
import { CATEGORY_TABS } from "../../data/categories";

export default function BundlePage() {
  const meta = PAGE_META.bundle;
  const breadcrumbs = PAGE_BREADCRUMBS.bundle ?? [];
  const faq = PAGE_FAQ.bundle ?? [];

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main className="mt-22.5">
        <Breadcrumbs items={breadcrumbs} />
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="blog_hero-section">
                <div className="heading-left-text-wr">
                  <h1 className="heading-style-h1">
                    <strong>Figma resources discounted</strong>
                  </h1>
                  <div className="heading-style-h5">
                    Purchase a Design Bundle with 2+ assets and save up to 50%
                  </div>
                </div>
              </div>
              <div className="spacer-40" />
              <CategoryTabs tabs={CATEGORY_TABS} activeSlug="bundle" />
              <div className="spacer-40" />
              <div className="templates_cl">
                {BUNDLES.map((bundle) => (
                  <BundleCard key={bundle.slug} item={bundle} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <CtaSubscribe />
        <TemplateShowcase />
        <FaqSection items={faq} />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
