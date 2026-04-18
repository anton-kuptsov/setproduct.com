export type PageMeta = {
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type Product = {
  slug: string;
  title: string;
  description: string;
  image: string;
  buyHref: string;
  price: string;
  categories: string[];
};

export type FaqItem = {
  question: string;
  answerHtml: string;
};

export type CategoryTab = {
  label: string;
  href: string;
  slug: string;
};

export type BlogPostPreview = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
};

export type FreebieItem = {
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  previewHref: string;
  duplicateHref: string;
  isFree: boolean;
};

export type Testimonial = {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
};
