import type { BreadcrumbItem } from "../types/data";

export const PAGE_BREADCRUMBS: Record<string, BreadcrumbItem[]> = {
  all: [{ label: "Home", href: "/" }, { label: "Templates" }],
  dashboards: [{ label: "Home", href: "/" }, { label: "Templates", href: "/all" }, { label: "Dashboards" }],
  mobile: [{ label: "Home", href: "/" }, { label: "Templates", href: "/all" }, { label: "Mobile" }],
  code: [{ label: "Home", href: "/" }, { label: "Templates", href: "/all" }, { label: "Code" }],
  dataviz: [{ label: "Home", href: "/" }, { label: "Templates", href: "/all" }, { label: "Charts" }],
  websites: [{ label: "Home", href: "/" }, { label: "Templates", href: "/all" }, { label: "Websites" }],
  bundle: [{ label: "Home", href: "/" }, { label: "Templates", href: "/all" }, { label: "Bundle" }],
  blog: [{ label: "Home", href: "/" }, { label: "Blog" }],
  freebies: [{ label: "Home", href: "/" }, { label: "Freebies" }],
  testimonials: [{ label: "Home", href: "/" }, { label: "Testimonials" }],
  "license": [{ label: "Home", href: "/" }, { label: "License" }],
  "refunds-policy": [{ label: "Home", href: "/" }, { label: "Refunds policy" }],
  "terms-of-paid-posts": [{ label: "Home", href: "/" }, { label: "Paid posts terms of service" }],
};
