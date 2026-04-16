import Head from "next/head";
import Link from "next/link";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import HeroSection from "../sections/HeroSection";
import TemplateGrid from "../sections/TemplateGrid";
import ArrowIcon from "../sections/ArrowIcon";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";
import { PRODUCTS } from "../../data/products";

export default function BundlePage() {
  const meta = PAGE_META.bundle;
  const breadcrumbs = PAGE_BREADCRUMBS.bundle ?? [];

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main>
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <HeroSection
          title="Figma UI kits Bundle"
          description="Get access to all Setproduct Figma design systems, UI kits, and templates in one bundle. Save more than 70% compared to buying individually."
        />
        <div className="section">
          <div className="section-padding top-40 bottom-80">
            <div className="container">
              <div className="heading-center-wr">
                <a className="button w-inline-block" href="https://gumroad.com/a/530945235/bundle" target="_blank" rel="noopener noreferrer">
                  <div className="text-size-large text-weight-bold">Buy Bundle</div>
                  <div className="button-icon w-embed"><ArrowIcon /></div>
                </a>
              </div>
              <div className="spacer-64" />
              <div className="heading-center-wr">
                <h2 className="heading-style-h2">What&apos;s included</h2>
              </div>
              <div className="spacer-32" />
              <TemplateGrid products={PRODUCTS} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
