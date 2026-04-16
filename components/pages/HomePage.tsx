import Head from "next/head";
import Link from "next/link";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import TemplateGrid from "../sections/TemplateGrid";
import FaqSection from "../sections/FaqSection";
import ArrowIcon from "../sections/ArrowIcon";
import { PAGE_META } from "../../data/pages-meta";
import { PRODUCTS } from "../../data/products";
import { PAGE_FAQ } from "../../data/faq";

export default function HomePage() {
  const meta = PAGE_META.index;
  const faq = PAGE_FAQ.index ?? [];
  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main>
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
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container">
            <div className="heading-center-wr">
              <h2 className="heading-style-h2">Featured templates</h2>
            </div>
            <div className="spacer-32" />
            <TemplateGrid products={featuredProducts} />
            <div className="spacer-32" />
            <div className="heading-center-wr">
              <Link className="button secondary w-inline-block" href="/all">
                <div className="text-size-large text-weight-bold">View all templates</div>
                <div className="button-icon w-embed"><ArrowIcon /></div>
              </Link>
            </div>
          </div>
        </div>

        {faq.length > 0 && <FaqSection items={faq} />}
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
