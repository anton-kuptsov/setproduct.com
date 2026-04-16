import type { GetServerSideProps } from "next";
import LegacyPage from "../components/LegacyPage";
import CategoryPage from "../components/pages/CategoryPage";
import BundlePage from "../components/pages/BundlePage";
import BlogListingPage from "../components/pages/BlogListingPage";
import FreebiesListingPage from "../components/pages/FreebiesListingPage";
import TestimonialsPage from "../components/pages/TestimonialsPage";
import type { LegacyPageData } from "../types/legacy";

const CATEGORY_SLUGS = new Set(["all", "dashboards", "mobile", "code", "dataviz", "websites"]);
const COMPONENT_PAGES = new Set([...CATEGORY_SLUGS, "bundle", "blog", "freebies", "testimonials"]);

type PageProps = {
  slug: string;
  isComponent: boolean;
  pageData?: LegacyPageData;
};

type SlugParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<PageProps, SlugParams> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  if (COMPONENT_PAGES.has(params.slug)) {
    return {
      props: {
        slug: params.slug,
        isComponent: true,
      },
    };
  }

  try {
    const { getRootPageData } = await import("../lib/legacy-collections");
    return {
      props: {
        slug: params.slug,
        isComponent: false,
        pageData: getRootPageData(params.slug),
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function SlugPage({ slug, isComponent, pageData }: PageProps) {
  if (isComponent) {
    if (CATEGORY_SLUGS.has(slug)) return <CategoryPage slug={slug} />;
    if (slug === "bundle") return <BundlePage />;
    if (slug === "blog") return <BlogListingPage />;
    if (slug === "freebies") return <FreebiesListingPage />;
    if (slug === "testimonials") return <TestimonialsPage />;
  }

  if (pageData) {
    return <LegacyPage {...pageData} />;
  }

  return null;
}
