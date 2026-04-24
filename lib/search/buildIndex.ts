import { BLOG_POSTS } from "../../data/blog-listing";
import { PRODUCTS } from "../../data/products";
import { TEMPLATE_PRODUCTS } from "../../data/templates-listing";
import { FREEBIE_PRODUCTS } from "../../data/freebies-listing";
import { BUNDLES } from "../../data/bundles";
import { DASHBOARD_TEMPLATES } from "../../data/dashboard-templates";
import type { SearchableItem } from "./types";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchIndex(): SearchableItem[] {
  const items: SearchableItem[] = [];

  for (const post of BLOG_POSTS) {
    items.push({
      type: "blog",
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      url: `/blog/${post.slug}`,
      image: post.image,
    });
  }

  for (const product of PRODUCTS) {
    items.push({
      type: "product",
      slug: product.slug,
      title: product.title,
      description: product.description,
      category: product.categories.join(", "),
      url: `/templates/${product.slug}`,
      image: product.image,
      price: product.price ? `$${product.price}` : undefined,
    });
  }

  const productSlugs = new Set(PRODUCTS.map((p) => p.slug));
  for (const tpl of TEMPLATE_PRODUCTS) {
    if (productSlugs.has(tpl.slug)) continue;
    items.push({
      type: "template",
      slug: tpl.slug,
      title: tpl.title,
      description: tpl.description,
      category: tpl.category,
      url: `/templates/${tpl.slug}`,
      image: tpl.heroImage,
      price: tpl.price,
    });
  }

  for (const freebie of FREEBIE_PRODUCTS) {
    items.push({
      type: "freebie",
      slug: freebie.slug,
      title: freebie.title,
      description: freebie.description,
      category: freebie.category,
      url: `/freebies/${freebie.slug}`,
      image: freebie.image,
    });
  }

  for (const bundle of BUNDLES) {
    items.push({
      type: "bundle",
      slug: bundle.slug,
      title: bundle.title,
      description: stripHtml(bundle.descriptionHtml),
      category: bundle.subtitle,
      url: "/bundle",
      image: bundle.image,
      price: bundle.price,
    });
  }

  for (const dash of DASHBOARD_TEMPLATES) {
    items.push({
      type: "dashboard",
      slug: dash.slug,
      title: dash.heroTitle,
      description: stripHtml(dash.heroSubtitleHtml).slice(0, 240),
      category: "Dashboards",
      url: `/dashboard-templates/${dash.slug}`,
      image: dash.ogImage,
    });
  }

  return items;
}
