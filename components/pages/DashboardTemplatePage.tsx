import { useState } from "react";
import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import CategoryTabs from "../sections/CategoryTabs";
import TemplateGrid from "../sections/TemplateGrid";
import FaqSection from "../sections/FaqSection";
import { useContactModal } from "../modals/ContactModalContext";
import { CATEGORY_TABS } from "../../data/categories";
import type { Product } from "../../types/data";
import type {
  DashboardTemplatePageData,
  DashboardFeatureBlock,
} from "../../data/dashboard-templates";

const PAGE_SIZE = 8;

type Props = {
  data: DashboardTemplatePageData;
  products: Product[];
};

function FeatureTextColumn({ block }: { block: DashboardFeatureBlock }) {
  return (
    <div className="template-list-item">
      <div className="template-list-text-wr is-only-text-item">
        <h2 className="heading-style-h4">{block.heading}</h2>
        <div
          className="rich-text-18 w-richtext"
          dangerouslySetInnerHTML={{ __html: block.bodyHtml }}
        />
      </div>
    </div>
  );
}

function FeatureImageColumn({ block }: { block: DashboardFeatureBlock }) {
  return (
    <div className="template-list-item is-align-center">
      <div className="template-list-item-is-only-img">
        <img
          alt={block.imageAlt}
          className="image-contain"
          loading="lazy"
          sizes="(max-width: 479px) 91vw, (max-width: 1439px) 43vw, 624px"
          src={block.image}
          srcSet={block.imageSrcSet}
        />
      </div>
    </div>
  );
}

function CtaBlock({ titleHtml, bodyHtml }: { titleHtml: string; bodyHtml: string }) {
  const { openContactModal } = useContactModal();
  return (
    <div className="section background-color-light-primary">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="main_cta-section">
            <div className="main_cta-active">
              <div className="heading-center-wr lets-connect is-bigger">
                <h2
                  className="heading-style-h2"
                  dangerouslySetInnerHTML={{ __html: titleHtml }}
                />
                <div
                  className="heading-style-h5 mob-18"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>
              <div className="btn-link-align-center">
                <button
                  className="button w-inline-block"
                  onClick={openContactModal}
                  type="button"
                >
                  <div className="text-size-large text-weight-bold">Let&rsquo;s connect</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardTemplatePage({ data, products }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  return (
    <>
      <Head>
        <title>{data.metaTitle}</title>
        <meta content={data.metaDescription} name="description" />
        <meta content={data.metaTitle} property="og:title" />
        <meta content={data.metaDescription} property="og:description" />
        <meta content={data.ogImage} property="og:image" />
        <meta content={data.metaTitle} property="twitter:title" />
        <meta content={data.metaDescription} property="twitter:description" />
        <meta content={data.ogImage} property="twitter:image" />
        <meta property="og:type" content="website" />
        <meta content="summary_large_image" name="twitter:card" />
        <link href={data.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main className="mt-22.5">
        <Breadcrumbs items={data.breadcrumbs} />

        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="blog_hero-section">
                <div className="heading-left-text-wr max-width-900">
                  <h1 className="heading-style-h1">{data.heroTitle}</h1>
                  <div
                    className="heading-style-h6 is-mob-16"
                    dangerouslySetInnerHTML={{ __html: data.heroSubtitleHtml }}
                  />
                </div>
              </div>
              <div className="spacer-64" />
              <div className="templates_list-section">
                <CategoryTabs tabs={CATEGORY_TABS} activeSlug="dashboards" />
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

        <div className="section">
          <div className="section-padding top-40 bottom-80">
            <div className="container">
              {data.featureBlocks.map((block, i) => (
                <div key={i}>
                  <div
                    className={`template_2col-cards is-gap-64${block.reverse ? " is-reverse" : ""}`}
                  >
                    {block.reverse ? (
                      <>
                        <FeatureImageColumn block={block} />
                        <FeatureTextColumn block={block} />
                      </>
                    ) : (
                      <>
                        <FeatureTextColumn block={block} />
                        <FeatureImageColumn block={block} />
                      </>
                    )}
                  </div>
                  {i < data.featureBlocks.length - 1 && <div className="spacer-64" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <CtaBlock titleHtml={data.ctaTitleHtml} bodyHtml={data.ctaBodyHtml} />

        <FaqSection items={data.faq} />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
