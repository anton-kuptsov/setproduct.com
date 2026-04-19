import type { BlogFrontmatter } from "../../types/blog";
import { SITE_URL } from "./site-config";

export function buildBlogPostingJsonLd(
  frontmatter: BlogFrontmatter,
  pageUrl: string,
  readingTimeMinutes: number
): Record<string, unknown> {
  const absoluteImage = frontmatter.coverImage?.startsWith("http")
    ? frontmatter.coverImage
    : `${SITE_URL}${frontmatter.coverImage ?? ""}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: absoluteImage,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: frontmatter.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Setproduct",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    timeRequired: `PT${readingTimeMinutes}M`,
  };
}
