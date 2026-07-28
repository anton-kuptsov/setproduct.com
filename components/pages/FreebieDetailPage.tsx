import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import CtaSubscribe from "../sections/CtaSubscribe";
import FreebiesShowcase from "../sections/FreebiesShowcase";
import FreebieArticle from "../sections/FreebieArticle";
import type { BlogPostPreview, FreebieItem } from "../../types/data";

type Props = {
  item: FreebieItem;
  blogPosts?: BlogPostPreview[];
};

export default function FreebieDetailPage({ item, blogPosts = [] }: Props) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Freebies", href: "/freebies" },
    { label: item.title },
  ];

  const title = `${item.title} — Figma freebie`;
  const description = item.description;
  const canonical = `https://setproduct.com/freebies/${item.slug}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={description} name="description" />
        <link href={canonical} rel="canonical" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={item.image} />
      </Head>
      <SiteHeader blogPosts={blogPosts} />
      <main className="pt-[70em]">
        <div className="section is-height-100vh">
          <div className="section-padding top-80 bottom-64">
            <div className="container">
              <div className="template_hero-sect">
                <div className="template_hero-wr">
                  <h1 className="heading-style-h1">{item.title}</h1>
                  <p className="heading-style-h5">{item.description}</p>
                  <div className="template_hero-btn-wr">
                    <a
                      className="button secondary w-inline-block"
                      href={item.duplicateHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="text-size-large text-weight-bold">
                        {item.ctaLabel ?? (item.isFree ? "Duplicate ⚡" : "Buy")}
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="section-bg-image-wr">
            <img
              alt={title}
              className="image-cover"
              loading="eager"
              sizes="100vw"
              src={item.image}
            />
            <div className="section-bg-gradient" />
          </div>
        </div>
        <div className="hide-on-mobile">
          <Breadcrumbs items={breadcrumbs} />
          <div className="spacer-24" />
        </div>
        <FreebieArticle slug={item.slug} />
        <FreebiesShowcase excludeSlug={item.slug} />
        <CtaSubscribe />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
