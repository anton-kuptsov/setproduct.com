import CategoryPage from "../components/pages/CategoryPage";
import { PRODUCTS } from "../data/products";
import { PAGE_META } from "../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../data/breadcrumbs";
import { PAGE_FAQ } from "../data/faq";

const SLUG = "code";
const PRODUCT_SLUGS = ["material-x", "material-you", "react-ui-kit", "xela-swift", "xela-android", "xela-flutter", "xela-react"];

const productMap = new Map(PRODUCTS.map((p) => [p.slug, p]));
const products = PRODUCT_SLUGS.map((s) => productMap.get(s)!);

export default function CodePage() {
  const meta = PAGE_META[SLUG];
  return (
    <CategoryPage
      slug={SLUG}
      title="Design & Code resources"
      description="Figma React, Angular, SwiftUI kits to design and code simultaneously to release MVPs faster"
      metaTitle={meta.title}
      metaDescription={meta.description}
      canonical={meta.canonical}
      breadcrumbs={PAGE_BREADCRUMBS[SLUG] ?? []}
      products={products}
      faq={PAGE_FAQ[SLUG] ?? []}
    />
  );
}
