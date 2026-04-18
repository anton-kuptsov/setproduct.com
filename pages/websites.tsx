import CategoryPage from "../components/pages/CategoryPage";
import { PRODUCTS } from "../data/products";
import { PAGE_META } from "../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../data/breadcrumbs";
import { PAGE_FAQ } from "../data/faq";

const SLUG = "websites";
const PRODUCT_SLUGS = ["zeus", "landing", "xela-react", "levitate", "website"];

const productMap = new Map(PRODUCTS.map((p) => [p.slug, p]));
const products = PRODUCT_SLUGS.map((s) => productMap.get(s)!);

export default function WebsitesPage() {
  const meta = PAGE_META[SLUG];
  return (
    <CategoryPage
      slug={SLUG}
      title="Web design templates"
      description="Figma resources aimed to design landing pages and websites without a headache"
      metaTitle={meta.title}
      metaDescription={meta.description}
      canonical={meta.canonical}
      breadcrumbs={PAGE_BREADCRUMBS[SLUG] ?? []}
      products={products}
      faq={PAGE_FAQ[SLUG] ?? []}
    />
  );
}
