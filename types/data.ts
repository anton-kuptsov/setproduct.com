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

// Template types for TemplateDetailPage

export type TemplateItem = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  ogImage: string;
  category: string;
  price: string;
  buyHref: string;
  previewHref: string;
  features: TemplateFeature[];
  testimonials?: Testimonial[];
  sections: TemplateSection[];
};

export type TemplateFeature = {
  title: string;
  description: string;
  image?: string;
};

export type TemplateSection =
  | { type: "feature-grid"; features: TemplateFeature[] }
  | { type: "tabs"; tabs: TabPanel[] }
  | { type: "before-after"; comparisons: SplitterComparison[] }
  | { type: "gallery"; images: GalleryImage[] }
  | { type: "carousel"; items: CarouselItem[] }
  | { type: "faq"; items: FaqItem[] }
  | { type: "pricing"; tiers: PricingTier[] }
  | { type: "video"; videoUrl: string; title?: string }
  | { type: "html"; content: string };

export type TabPanel = {
  id: string;
  label: string;
  content: string | TemplateSection[];
};

export type SplitterComparison = {
  beforeImage: string;
  afterImage: string;
  label: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CarouselItem = {
  image: string;
  alt: string;
  caption?: string;
};

export type PricingTier = {
  name: string;
  price: string;
  features: string[];
  buyHref: string;
  highlighted?: boolean;
};

export type DashboardTemplateItem = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  ogImage: string;
  category: string;
  buyHref: string;
  previewHref: string;
  features: TemplateFeature[];
  sections: TemplateSection[];
};
