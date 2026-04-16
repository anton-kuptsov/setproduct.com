import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import HeroSection from "../sections/HeroSection";
import CategoryTabs from "../sections/CategoryTabs";
import TemplateGrid from "../sections/TemplateGrid";
import FaqSection from "../sections/FaqSection";
import { PAGE_META } from "../../data/pages-meta";
import { PRODUCTS } from "../../data/products";
import { CATEGORY_TABS } from "../../data/categories";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";
import { PAGE_FAQ } from "../../data/faq";

const HERO_DATA: Record<string, { title: string; description: string }> = {
  all: {
    title: "Figma templates & UI kits",
    description: "Browse our full collection of Figma design resources. UI kits, app templates, and design systems for startups, designers, and developers.",
  },
  dashboards: {
    title: "Dashboard templates",
    description: "Seeking dashboard UI design templates to improve the efficiency of your web project?\nWelcome to our carefully picked collection of Figma dashboard templates! A variety of adaptable Figma dashboard UI kits are available below to help you improve your web designs.",
  },
  mobile: {
    title: "Mobile app templates",
    description: "Uncover a treasure trove of Figma design resources, including UI kits, app templates, and design systems perfect for startups, designers, and developers.",
  },
  code: {
    title: "Design & Code resources",
    description: "Dive into a curated selection of Figma design essentials, including UI kits, app templates, and design systems. Ideal for startups, designers, and developers.",
  },
  dataviz: {
    title: "Charts templates",
    description: "Explore a collection of Figma design assets tailored for startups, designers, and developers. Find UI kits, app templates, and design systems.",
  },
  websites: {
    title: "Website templates",
    description: "Elevate your design game with our extensive collection of Figma resources. From UI kits to customizable app templates and robust design systems.",
  },
};

type Props = { slug: string };

export default function CategoryPage({ slug }: Props) {
  const meta = PAGE_META[slug];
  const hero = HERO_DATA[slug] ?? HERO_DATA.all;
  const breadcrumbs = PAGE_BREADCRUMBS[slug] ?? [];
  const faq = PAGE_FAQ[slug] ?? [];

  const products = slug === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.categories.includes(slug));

  return (
    <>
      <Head>
        <title>{meta?.title}</title>
        {meta?.description && <meta content={meta.description} name="description" />}
        {meta?.canonical && <link href={meta.canonical} rel="canonical" />}
      </Head>
      <SiteHeader />
      <main>
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <HeroSection title={hero.title} description={hero.description} />
        <div className="section">
          <div className="container">
            <div className="templates_list-section">
              <CategoryTabs tabs={CATEGORY_TABS} activeSlug={slug} />
              <div className="spacer-32" />
              <TemplateGrid products={products} />
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
