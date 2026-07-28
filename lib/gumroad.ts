/**
 * Gumroad overlay helpers.
 *
 * The global script https://gumroad.com/js/gumroad.js (included once in
 * pages/_app.tsx) automatically binds the on-site popup overlay to EVERY
 * plain <a> link pointing to gumroad.com — including affiliate (/a/) links.
 *
 * IMPORTANT: do NOT add the `gumroad-button` class to links. That class
 * makes the script replace the link's content with Gumroad's own huge
 * branded button widget, destroying the page layout. Plain links with no
 * target="_blank" are all that's needed for the overlay to work.
 */

export function isGumroadHref(href?: string | null): boolean {
  return typeof href === "string" && href.includes("gumroad.com");
}

type GumroadLinkProps = {
  className: string;
  target?: "_blank";
  rel?: string;
};

/**
 * Returns anchor props for a buy/external link:
 * - Gumroad links: keep original classes, no target — gumroad.js opens
 *   the product in a popup overlay; href stays as a same-tab fallback.
 * - Other external links: open in a new tab as before.
 */
export function getGumroadLinkProps(
  href: string | undefined,
  baseClass = ""
): GumroadLinkProps {
  if (isGumroadHref(href)) {
    return {
      className: baseClass,
    };
  }
  return {
    className: baseClass,
    target: "_blank",
    rel: "noopener noreferrer",
  };
}
