import { useState } from "react";
import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import CategoryTabs from "../sections/CategoryTabs";
import TemplateGrid from "../sections/TemplateGrid";
import CtaSubscribe from "../sections/CtaSubscribe";
import FaqSection from "../sections/FaqSection";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";
import { PAGE_FAQ } from "../../data/faq";
import { PRODUCTS } from "../../data/products";
import { CATEGORY_TABS } from "../../data/categories";

const SLUG = "dashboards";
const PAGE_SIZE = 8;
const PRODUCT_SLUGS = [
  "nocra",
  "material-x",
  "material-you",
  "react-ui-kit",
  "panda",
  "eclipse",
  "rome",
  "material",
];

const productMap = new Map(PRODUCTS.map((p) => [p.slug, p]));
const products = PRODUCT_SLUGS.map((s) => productMap.get(s)!);

const BENEFITS_HTML = `<p>Numerous advantages catered to your needs are provided by our dashboard templates:</p>
<ul role="list">
  <li><strong>Organized Library:</strong> Save time with our meticulously crafted Figma dashboard template, featuring auto-layout, variants, color &amp; text styles.</li>
  <li><strong>Simple Customization:</strong> Take advantage of auto-layout, trendy style guides, and component customization to get started. A rapid start is ensured by comprehensive desktop and mobile templates.</li>
  <li><strong>Modern Designs:</strong> Select from light or dark dashboard layouts that feature sleek, contemporary web app user interface kits for excellent outcomes.</li>
  <li><strong>Preview Variants:</strong> Explore various components and UI widgets with auto-layout drag &amp; drop functionality, meticulously crafted with variants support.</li>
</ul>`;

export default function DashboardsPage() {
  const meta = PAGE_META[SLUG];
  const breadcrumbs = PAGE_BREADCRUMBS[SLUG] ?? [];
  const faq = PAGE_FAQ[SLUG] ?? [];

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
                  <h1 className="heading-style-h1">Dashboard templates</h1>
                  <div className="heading-style-h5">
                    Seeking dashboard UI design templates to improve the
                    efficiency of your web project? Welcome to our carefully
                    picked collection of Figma dashboard templates! A variety of
                    adaptable Figma dashboard UI kits are available below to help
                    you improve your web designs. Regardless of your level of
                    experience, these templates offer inspiration and efficiency.
                  </div>
                </div>
              </div>
              <div className="spacer-64" />
              <div className="templates_list-section">
                <CategoryTabs tabs={CATEGORY_TABS} activeSlug={SLUG} />
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

        {/* Dashboard Benefits */}
        <div className="section">
          <div className="section-padding top-40 bottom-80">
            <div className="container">
              <div className="template_2col-cards is-gap-64">
                <div className="template-list-item">
                  <div className="template-list-text-wr is-only-text-item">
                    <h2 className="heading-style-h2">Dashboard Benefits</h2>
                    <div
                      className="rich-text-18 w-richtext"
                      dangerouslySetInnerHTML={{ __html: BENEFITS_HTML }}
                    />
                  </div>
                </div>
                <div className="template-list-item">
                  <div className="template-list-item-is-only-img">
                    <img
                      alt=""
                      className="image-contain"
                      loading="lazy"
                      src="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/65d35cdfa7c936199fbf023f_02-min_(1).webp"
                    />
                  </div>
                </div>
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
