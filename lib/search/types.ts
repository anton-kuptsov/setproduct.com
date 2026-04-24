export type SearchableType =
  | "blog"
  | "product"
  | "template"
  | "freebie"
  | "bundle"
  | "dashboard";

export type SearchableItem = {
  type: SearchableType;
  slug: string;
  title: string;
  description: string;
  category?: string;
  url: string;
  image?: string;
  price?: string;
};

export const SEARCHABLE_TYPE_LABELS: Record<SearchableType, string> = {
  blog: "Blog",
  product: "UI Kits",
  template: "Templates",
  freebie: "Freebies",
  bundle: "Bundles",
  dashboard: "Dashboard pages",
};

export const SEARCHABLE_TYPE_ORDER: SearchableType[] = [
  "product",
  "template",
  "bundle",
  "freebie",
  "dashboard",
  "blog",
];
