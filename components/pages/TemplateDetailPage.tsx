import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import CtaSubscribe from "../sections/CtaSubscribe";
import FaqSection from "../sections/FaqSection";
import TemplateStickyCta from "../sections/TemplateStickyCta";
import { getGumroadLinkProps } from "../../lib/gumroad";
import type { BlogPostPreview, TemplateItem } from "../../types/data";

type Props = {
  item: TemplateItem;
  blogPosts?: BlogPostPreview[];
};

export default function TemplateDetailPage({ item, blogPosts = [] }: Props) {
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
      <SiteHeader blogPosts={blogPosts} />
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
                      href={item.buyHref}
                      {...getGumroadLinkProps(item.buyHref, "button secondary w-inline-block")}
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

        <CtaSubscribe />
      </main>
      <SiteFooter />
      <TemplateStickyCta item={item} />
      <ScrollUpButton />
    </>
  );
}
