import Head from "next/head";
import SiteHeader from "../../layout/SiteHeader";
import SiteFooter from "../../layout/SiteFooter";
import ScrollUpButton from "../../layout/ScrollUpButton";
import Breadcrumbs from "../../sections/Breadcrumbs";
import TemplateShowcase from "../../sections/TemplateShowcase";
import TemplateVideo from "../../sections/TemplateVideo";
import TemplateTabsWithSplitter from "../../sections/TemplateTabsWithSplitter";
import TemplateImageSection from "../../sections/TemplateImageSection";
import TemplatePricing from "../../sections/TemplatePricing";
import TemplateCtaHire from "../../sections/TemplateCtaHire";
import FaqSection from "../../sections/FaqSection";
import { chartsContent } from "../../../data/template-content/charts";
import type { TemplateItem } from "../../../types/data";

type Props = {
  item: TemplateItem;
};

export default function ChartsTemplatePage({ item }: Props) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/all" },
    { label: item.title },
  ];

  const title = item.title;
  const description = item.description;
  const canonical = `https://setproduct.com/templates/${item.slug}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={description} name="description" />
        <link href={canonical} rel="canonical" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={item.ogImage} />
      </Head>
      <SiteHeader />
      <main className="pt-[70em]">
        {/* Hero Section */}
        <div className="section is-height-100vh">
          <div className="section-padding top-80 bottom-64">
            <div className="container">
              <div className="template_hero-sect">
                <div className="template_hero-wr max-width-900">
                  <h1 className="heading-style-h1">{item.title}</h1>
                  <p className="heading-style-h5">{item.description}</p>
                  <div className="template_hero-btn-wr">
                    <a
                      className="button secondary w-inline-block"
                      href={item.buyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="text-size-large text-weight-bold">Get Started</div>
                    </a>
                    <a
                      className="button w-inline-block"
                      href={item.previewHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="text-size-large text-weight-bold">Preview in Figma</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section-bg-image-wr">
            <img
              alt={item.title}
              className="image-cover"
              loading="eager"
              sizes="100vw"
              src={item.heroImage}
            />
            <div className="section-bg-gradient" />
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="hide-on-mobile">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Feature Grid */}
        {item.features.length > 0 && (
          <div className="section">
            <div className="section-padding top-80 bottom-80">
              <div className="container">
                <div className="template_4colm-cards">
                  {item.features.map((feature, index) => (
                    <div key={index} className="template_4colm-card">
                      {feature.image && (
                        <div className="template_4colm-card-img-wr">
                          <img
                            alt={feature.title}
                            className="image-cover"
                            loading="lazy"
                            src={feature.image}
                          />
                        </div>
                      )}
                      <div className="template_4colm-card-info-wr">
                        <p className="heading-style-h5 is-template-max-width">
                          <strong>{feature.title}</strong>
                        </p>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Section */}
        <TemplateVideo
          videoUrl={chartsContent.video.url}
          title={chartsContent.video.title}
          subtitle={chartsContent.video.subtitle}
        />

        {/* Tabs with Before/After Splitters */}
        <TemplateTabsWithSplitter
          title={chartsContent.tabsSection.title}
          subtitle={chartsContent.tabsSection.subtitle}
          previewLink={chartsContent.tabsSection.previewLink}
          tabs={chartsContent.tabsSection.tabs}
        />

        {/* Viewports Image Section */}
        <TemplateImageSection
          title={chartsContent.viewportsSection.title}
          subtitle={chartsContent.viewportsSection.subtitle}
          image={chartsContent.viewportsSection.image}
        />

        {/* Pricing */}
        <TemplatePricing
          title={chartsContent.pricing.title}
          subtitle={chartsContent.pricing.subtitle}
          cards={chartsContent.pricing.cards}
        />

        {/* Hire CTA */}
        <TemplateCtaHire />

        {/* FAQ */}
        <FaqSection items={chartsContent.faq} />

        {/* Related Templates */}
        <TemplateShowcase />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
