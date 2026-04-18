import CategoryPage from "../components/pages/CategoryPage";
import { PRODUCTS } from "../data/products";
import { PAGE_META } from "../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../data/breadcrumbs";
import { PAGE_FAQ } from "../data/faq";

const SLUG = "mobile";
const PRODUCT_SLUGS = [ "nucleus-ui", "material-you", "rome", "material", "mobile-x", "appka-ios-ui-kit", "android-ui-kit", "xela-swift"];

const productMap = new Map(PRODUCTS.map((p) => [p.slug, p]));
const products = PRODUCT_SLUGS.map((s) => productMap.get(s)!);

export default function MobilePage() {
  const meta = PAGE_META[SLUG];
  return (
    <CategoryPage
      slug={SLUG}
      title="Mobile app templates"
      description="Native and custom iOS & Android UI kits with frequent app patterns designed for Figma"
      metaTitle={meta.title}
      metaDescription={meta.description}
      canonical={meta.canonical}
      breadcrumbs={PAGE_BREADCRUMBS[SLUG] ?? []}
      products={products}
      faq={PAGE_FAQ[SLUG] ?? []}
    />
  );
}
