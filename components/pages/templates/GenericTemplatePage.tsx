import Head from "next/head";
import SiteHeader from "../../layout/SiteHeader";
import SiteFooter from "../../layout/SiteFooter";
import ScrollUpButton from "../../layout/ScrollUpButton";
import Breadcrumbs from "../../sections/Breadcrumbs";
import TemplateShowcase from "../../sections/TemplateShowcase";
import TemplateVideo from "../../sections/TemplateVideo";
import TemplateTabsWithSplitter from "../../sections/TemplateTabsWithSplitter";
import TemplatePricing from "../../sections/TemplatePricing";
import TemplateCtaHire from "../../sections/TemplateCtaHire";
import TemplateCarousel from "../../sections/TemplateCarousel";
import TemplateGallery from "../../sections/TemplateGallery";
import FaqSection from "../../sections/FaqSection";
import type { TemplateItem } from "../../../types/data";

type TemplateContent = {
  features?: Array<{
    title: string;
    description: string;
    image?: string;
  }>;
  video?: {
    url: string;
    title?: string;
    subtitle?: string;
  };
  carousels?: Array<{
    title?: string;
    subtitle?: string;
    previewLink?: string;
    items: Array<{ image: string; alt?: string }>;
  }>;
  galleries?: Array<{
    title?: string;
    subtitle?: string;
    previewLink?: string;
    items: Array<{ image: string; title?: string }>;
  }>;
  tabsSection?: {
    title?: string;
    subtitle?: string;
    previewLink?: string;
    tabs: Array<{
      id: string;
      label: string;
      beforeImage: string;
      afterImage: string;
      heightClass?: string;
    }>;
  };
  pricing?: {
    title?: string;
    subtitle?: string;
    cards: Array<{
      title: string;
      description: string;
      image: string;
      price?: string;
      buyHref: string;
      buyLabel: string;
      previewHref?: string;
    }>;
  };
  faq?: Array<{
    question: string;
    answerHtml: string;
  }>;
};

type Props = {
  item: TemplateItem;
  content: TemplateContent;
};

export default function GenericTemplatePage({ item, content }: Props) {
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
        {content.features && content.features.length > 0 && (
          <div className="section">
            <div className="section-padding top-80 bottom-80">
              <div className="container">
                <div className="template_4colm-cards">
                  {content.features.map((feature, index) => (
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
        {content.video && (
          <TemplateVideo
            videoUrl={content.video.url}
            title={content.video.title}
            subtitle={content.video.subtitle}
          />
        )}

        {/* Carousels */}
        {content.carousels?.map((carousel, index) => (
          <TemplateCarousel
            key={`carousel-${index}`}
            title={carousel.title}
            subtitle={carousel.subtitle}
            previewLink={carousel.previewLink}
            items={carousel.items}
          />
        ))}

        {/* Galleries */}
        {content.galleries?.map((gallery, index) => (
          <TemplateGallery
            key={`gallery-${index}`}
            title={gallery.title}
            subtitle={gallery.subtitle}
            previewLink={gallery.previewLink}
            items={gallery.items}
          />
        ))}

        {/* Tabs with Before/After Splitters */}
        {content.tabsSection && content.tabsSection.tabs.length > 0 && (
          <TemplateTabsWithSplitter
            title={content.tabsSection.title}
            subtitle={content.tabsSection.subtitle}
            previewLink={content.tabsSection.previewLink}
            tabs={content.tabsSection.tabs}
          />
        )}

        {/* Pricing */}
        {content.pricing && content.pricing.cards.length > 0 && (
          <TemplatePricing
            title={content.pricing.title}
            subtitle={content.pricing.subtitle}
            cards={content.pricing.cards}
          />
        )}

        {/* Hire CTA */}
        <TemplateCtaHire />

        {/* FAQ */}
        {content.faq && content.faq.length > 0 && (
          <FaqSection items={content.faq} />
        )}

        {/* Related Templates */}
        <TemplateShowcase />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
