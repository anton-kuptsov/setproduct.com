import type { Author, BlogFrontmatter } from "../../types/blog";
import { getAuthor } from "./authors";
import { SITE_URL } from "./site-config";

export function buildBlogPostingJsonLd(
  frontmatter: BlogFrontmatter,
  pageUrl: string,
  readingTimeMinutes: number
): Record<string, unknown> {
  const absoluteImage = frontmatter.coverImage?.startsWith("http")
    ? frontmatter.coverImage
    : `${SITE_URL}${frontmatter.coverImage ?? ""}`;

  // Normalise lastUpdated ("YYYY-MM" or "YYYY-MM-DD") to a full ISO date
  // for dateModified. When only the month is given, default to its first day.
  const dateModified = frontmatter.lastUpdated
    ? frontmatter.lastUpdated.length === 7
      ? `${frontmatter.lastUpdated}-01`
      : frontmatter.lastUpdated
    : frontmatter.date;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: absoluteImage,
    datePublished: frontmatter.date,
    dateModified,
    author: {
      "@type": "Person",
      name: getAuthor(frontmatter.author).name,
      url: `${SITE_URL}/authors/${getAuthor(frontmatter.author).slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Setproduct",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/Vectors-Wrapper_1.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    timeRequired: `PT${readingTimeMinutes}M`,
  };
}

/**
 * Person JSON-LD for an author page. Includes the avatar as image and any
 * external links as sameAs, so search engines can connect the author entity.
 */
export function buildPersonJsonLd(author: Author): Record<string, unknown> {
  const absoluteImage = author.avatar.startsWith("http")
    ? author.avatar
    : `${SITE_URL}${author.avatar}`;

  const sameAs = author.links
    ? [
        author.links.twitter,
        author.links.linkedin,
        author.links.website,
        author.links.gumroad,
      ].filter((link): link is string => Boolean(link))
    : [];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_URL}/authors/${author.slug}`,
    image: absoluteImage,
  };

  if (author.role) jsonLd.jobTitle = author.role;
  if (sameAs.length > 0) jsonLd.sameAs = sameAs;

  return jsonLd;
}
