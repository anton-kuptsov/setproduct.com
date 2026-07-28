"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FocusEvent as ReactFocusEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useContactModal } from "../modals/ContactModalContext";
// Temporarily disabled — kept for potential future use.
// import LaunchAppCallout from "./LaunchAppCallout";
import ArrowIcon from "../sections/ArrowIcon";
import type { BlogPostPreview, InspirationItem, Product } from "../../types/data";
import { PRODUCTS } from "../../data/products";
import { FREEBIE_PRODUCTS } from "../../data/freebies-listing";
import { BUNDLES } from "../../data/bundles";
import type { BundleItem } from "../../data/bundles";
import { INSPIRATION_CATEGORIES, INSPIRATION_ITEMS } from "../../data/inspiration";
import { getGumroadLinkProps } from "../../lib/gumroad";

function ChevronIcon() {
  return (
    <svg
      className="nav_chevron-svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type KitPreview = {
  href: string;
  buyHref: string;
  buyLabel: string;
  image: string;
  title: string;
  description: string;
};

const NAV_BLOG_CATEGORIES: Array<{ label: string; category: string | null }> = [
  { label: "All topics", category: null },
  { label: "Startups & SaaS", category: "Startups & SaaS" },
  { label: "UI Design", category: "UI Design" },
  { label: "Growth Hacking", category: "Growth Hacking" },
  { label: "Inspiration", category: "Inspiration" },
  { label: "Resources", category: "Resources" },
  { label: "Technology", category: "Technology" },
  { label: "Research", category: "Research" },
];

// Sentinel category for the Bundle tab. Bundles aren't catalogue Products and
// carry no `categories` array, so we route this tab through a dedicated branch
// in filteredKitPreviews instead of the product filter — otherwise it falls
// back to the featured set and duplicates the "All" tab.
const BUNDLE_CATEGORY = "__bundles__";

const DESIGN_KITS: Array<{ href: string; label: string; category: string | null }> = [
  { href: "/all", label: "All", category: null },
  { href: "/dashboards", label: "Dashboards", category: "dashboards" },
  { href: "/mobile", label: "Mobile", category: "mobile" },
  { href: "/dataviz", label: "Charts", category: "dataviz" },
  { href: "/code", label: "Code", category: "code" },
  { href: "/websites", label: "Websites", category: "websites" },
  { href: "/bundle", label: "Bundle", category: BUNDLE_CATEGORY },
];

const INFORMATION_LINKS = [
  { href: "/testimonials", label: "Testimonials" },
  { href: "/legal/license", label: "License" },
  { href: "/legal/refunds-policy", label: "Refund Policy" },
  { href: "#", label: "Contact us", modal: true },
];

// Curated subset of freebies categories surfaced in the nav dropdown. Like
// DESIGN_KITS, we don't list every taxonomy entry — only the well-populated,
// recognisable ones — so each hovered tab yields a full preview grid. `label`
// is sentence-case for display; `category` must match FREEBIE_PRODUCTS exactly.
const NAV_FREEBIE_CATEGORIES: Array<{ label: string; category: string | null }> = [
  { label: "All topics", category: null },
  { label: "Code", category: "Code" },
  { label: "Components", category: "Components" },
  { label: "Mobile templates", category: "Mobile Templates" },
  { label: "Mobile & desktop", category: "Mobile & Desktop" },
  { label: "Data visualization", category: "Data visualization" },
  { label: "Web design", category: "Web Design" },
  { label: "Desktop", category: "Desktop" },
];

const NAV_BLOG_PREVIEW_COUNT = 6;
const NAV_KIT_PREVIEW_COUNT = 6;
const NAV_FREEBIE_PREVIEW_COUNT = 6;
const NAV_INSPIRATION_PREVIEW_COUNT = 6;

// Safety net: if a failed/empty scrape leaves data/inspiration.ts with no
// items, the mega-menu would render a blank panel. In that case we fall back
// to a plain external link to the AI UI library instead.
const HAS_INSPIRATION = INSPIRATION_ITEMS.length > 0;

// UTM tagging for every outbound Inspiration link so app.setproduct.com can
// attribute the traffic this mega-menu sends. Appended at render time (the
// scraped hrefs in data/inspiration.ts stay clean).
const INSPIRATION_UTM = "utm_source=setproduct.com&utm_medium=navbar&utm_campaign=inspiration";
function withUtm(href: string): string {
  return href.includes("?") ? `${href}&${INSPIRATION_UTM}` : `${href}?${INSPIRATION_UTM}`;
}

// Fisher–Yates shuffle — returns a new array, leaving the source untouched.
function shuffle<T>(input: readonly T[]): T[] {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Tracks image URLs that have already been revealed once. Cards remount when
// the active category changes (key={item.id}); without this, every remount
// would replay the blur fade-in even though the image is already cached. By
// remembering revealed URLs we initialise such thumbs as already-loaded, so the
// reveal animation plays only the first time each preview appears.
const revealedInspirationImages = new Set<string>();

// Thumbnail with a shimmer skeleton until the lazy image decodes. The wrapper
// gets `.is-loaded` on load → shimmer fades out, image blur-fades in. We check
// `complete` on mount so cached images (which may skip onLoad) reveal at once,
// and skip the animation entirely for previews already shown earlier.
function InspirationThumb({ href, image }: { href: string; image: string }) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(() => revealedInspirationImages.has(image));

  const reveal = () => {
    revealedInspirationImages.add(image);
    setLoaded(true);
  };

  useEffect(() => {
    if (!loaded && imgRef.current?.complete) {
      reveal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <a
      className={`nav_tabs-list-item-img-wr nav_inspiration-img-wr w-inline-block relative${loaded ? " is-loaded" : ""}`}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <img
        ref={imgRef}
        alt=""
        src={image}
        loading="lazy"
        onLoad={reveal}
        onError={reveal}
        className="image-cover nav_inspiration-img"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </a>
  );
}

const SEARCH_PLACEHOLDERS = [
  "Search dashboards…",
  "Search Figma kits…",
  "Search blog posts…",
  "Search AI UI examples…",
];

const SEARCH_PLACEHOLDER_INTERVAL_MS = 2500;

const INSPIRATION_BADGE_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "0.5em",
  padding: "0.18em 0.5em",
  borderRadius: "0.35em",
  backgroundColor: "var(--primary)",
  color: "var(--white)",
  fontSize: "0.62em",
  fontWeight: 700,
  letterSpacing: "0.06em",
  lineHeight: 1,
};

const LAUNCH_APP_SUBLABEL_STYLE: CSSProperties = {
  marginTop: "0.15em",
  fontSize: "0.7em",
  fontWeight: 500,
  opacity: 0.85,
  letterSpacing: "0.01em",
};

const KIT_PREVIEWS: KitPreview[] = [
  {
    href: "/templates/orion",
    buyHref: "https://gumroad.com/a/530945235/kzbajr",
    buyLabel: "Buy $148",
    image: "/images/pricing-orion-01.webp",
    title: "Orion UI kit",
    description: "Figma library with 40+ full-width charts templates served in light & dark themes. Contains 200+ of dataviz widgets that look perfect on desktop & mobile screens.",
  },
  {
    href: "/templates/nocra",
    buyHref: "https://gumroad.com/a/530945235/uocxtg",
    buyLabel: "Buy $98",
    image: "/images/nocra-list-image.webp",
    title: "Nocra UI kit",
    description: "Nocra is a design system for AI products. Built specifically for startups harnessing AI generation: images, video, audio, music, prompts, and beyond.",
  },
  {
    href: "/templates/charts",
    buyHref: "https://setproduct.gumroad.com/l/graphz_pro",
    buyLabel: "Buy $168",
    image: "/images/pricing-charts-01.webp",
    title: "Figma Charts UI kit",
    description: "Components-driven graphs design kit for dashboards, presentations, infographics & data visualisation. Includes 25+ charts types for all the viewports.",
  },
  {
    href: "/templates/nucleus-ui",
    buyHref: "https://gumroad.com/a/169902547/snlaf",
    buyLabel: "Buy $89",
    image: "/images/nucleus-cover-1920-m.webp",
    title: "Nucleus UI",
    description: "Nucleus UI contains 1000 components and variants with 500+ mobile screens designed for Figma (including 9 themes from Event, E-commerce, Finance, NFT, etc.).",
  },
  {
    href: "/templates/material-x",
    buyHref: "https://setproduct.gumroad.com/l/material-x-fig",
    buyLabel: "Buy $148",
    image: "/images/pircing-mx-02_(1).webp",
    title: "Material X for Figma",
    description: "Figma library with 1100+ components & 40 app templates beyond Material Design. Powered by top-notch shapes and Manrope font. Customizable & Adjustable UI kit now available for Angular & Figma",
  },
  {
    href: "/templates/material-you",
    buyHref: "https://gumroad.com/a/135691379/upxbb",
    buyLabel: "Buy $124",
    image: "/images/pricing-materialme_(1).webp",
    title: "Material You UI kit",
    description: "Figma & React library with 2600+ variants of 32 components compatible with Material Design 3. Plus 220+ dashboard templates for all the viewports. Now available for NextJS & TailwindCSS.",
  },
];

// Map a catalogue product onto the mega-menu card shape so the Design Kits
// dropdown can swap its right-hand previews per hovered category — mirroring
// how Tutorials filters blog previews by category.
function kitPreviewFromProduct(product: Product): KitPreview {
  return {
    href: `/templates/${product.slug}`,
    buyHref: product.buyHref,
    buyLabel: `Buy $${product.price}`,
    image: product.image,
    title: product.title,
    description: product.description,
  };
}

// Map a bundle onto the mega-menu card shape. Bundles point at the /bundle
// listing (no per-bundle detail route), keep their already-formatted "$210"
// price, and have their HTML description flattened to plain text for the
// clamped preview line.
function bundlePreviewFromItem(bundle: BundleItem): KitPreview {
  return {
    href: "/bundle",
    buyHref: bundle.buyHref,
    buyLabel: `Buy ${bundle.price}`,
    image: bundle.image,
    title: bundle.title,
    description: bundle.descriptionHtml
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim(),
  };
}

type SiteHeaderProps = {
  blogPosts?: BlogPostPreview[];
};

// Hover-intent timings. A short open delay stops a cursor that merely sweeps
// across a trigger from dropping the full-width panel; a longer close grace
// period lets the pointer travel diagonally into the panel (or hop to an
// adjacent trigger) without the menu snapping shut underneath it.
const NAV_HOVER_OPEN_DELAY_MS = 120;
const NAV_HOVER_CLOSE_DELAY_MS = 250;
// Debounce for switching subcategories *inside* an already-open panel. Without
// it a cursor sweeping down the Categories column strobes through every preview
// set; this makes only the category the pointer settles on actually load.
const NAV_SUBCATEGORY_HOVER_DELAY_MS = 260;

export default function SiteHeader({ blogPosts = [] }: SiteHeaderProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [activeBlogCategory, setActiveBlogCategory] = useState<string | null>(null);
  const [activeKitCategory, setActiveKitCategory] = useState<string | null>(null);
  const [activeFreebieCategory, setActiveFreebieCategory] = useState<string | null>(null);
  const [activeInspirationCategory, setActiveInspirationCategory] = useState<string | null>(null);
  // Server render and first client paint must match, so we start from the
  // source order and reshuffle on mount — giving a fresh six on every refresh
  // without tripping hydration.
  const [shuffledInspiration, setShuffledInspiration] = useState<InspirationItem[]>(INSPIRATION_ITEMS);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchPlaceholderIndex, setSearchPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] =
    useState<number | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const hoverIntentRef = useRef<number | null>(null);
  const subHoverIntentRef = useRef<number | null>(null);
  const { openContactModal } = useContactModal();
  const router = useRouter();
  const currentPath = router.pathname;

  const isPathActive = (href: string) =>
    href === "/" ? currentPath === "/" : currentPath === href || currentPath.startsWith(`${href}/`);

  const isTutorialsActive = currentPath === "/blog" || currentPath.startsWith("/blog/");
  const isDesignKitsActive = DESIGN_KITS.some((k) => isPathActive(k.href)) ||
    currentPath.startsWith("/templates/");
  const isFreebiesActive = currentPath === "/freebies" || currentPath.startsWith("/freebies/");
  const isInformationActive = INFORMATION_LINKS.some(
    (link) => !link.modal && link.href !== "#" && isPathActive(link.href),
  );
  // The Inspiration tab points off-site (app.setproduct.com), so it never maps
  // to a local route — its "active" state is purely the open-menu highlight.
  const isInspirationActive = openMenu === "inspiration";

  const isMenuOpen = (menuName: string) => openMenu === menuName;

  const toggleMenu = (menuName: string) => {
    setOpenMenu((current) => (current === menuName ? null : menuName));
  };

  const clearHoverIntent = () => {
    if (hoverIntentRef.current !== null) {
      window.clearTimeout(hoverIntentRef.current);
      hoverIntentRef.current = null;
    }
  };

  const clearSubHoverIntent = () => {
    if (subHoverIntentRef.current !== null) {
      window.clearTimeout(subHoverIntentRef.current);
      subHoverIntentRef.current = null;
    }
  };

  // Pointer hover over a subcategory: debounce so a passing cursor doesn't
  // load every set on the way; only the one it lingers on (~90ms) commits.
  const switchSubcategoryOnHover = (apply: () => void) => {
    clearSubHoverIntent();
    if (typeof window === "undefined") {
      apply();
      return;
    }
    subHoverIntentRef.current = window.setTimeout(() => {
      subHoverIntentRef.current = null;
      apply();
    }, NAV_SUBCATEGORY_HOVER_DELAY_MS);
  };

  // Keyboard focus on a subcategory: cancel any queued hover switch and commit
  // instantly so Tab navigation maps 1:1 to the previews shown.
  const switchSubcategoryNow = (apply: () => void) => {
    clearSubHoverIntent();
    apply();
  };

  // Open (or swap between) menus immediately. Shared by pointer hover-intent
  // and keyboard focus so both input paths behave identically.
  const openMenuImmediate = (menuName: string) => {
    clearHoverIntent();
    // Moving straight from one already-open menu to another: swap the panel
    // content without the collapse→expand bounce. `is-switching` disables the
    // panel's max-height transition so the new panel snaps to full height
    // while its inner content cross-fades in.
    setIsSwitching(openMenu !== null && openMenu !== menuName);
    setOpenMenu(menuName);
  };

  const closeMenuImmediate = () => {
    clearHoverIntent();
    clearSubHoverIntent();
    setIsSwitching(false);
    setOpenMenu(null);
  };

  const openOnHover = (menuName: string) => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clearHoverIntent();
    // If a sibling menu is already open, swap instantly so sweeping across the
    // bar stays responsive. Opening from a closed state waits out a short
    // intent delay so an incidental pass-over never drops the panel.
    if (openMenu !== null) {
      openMenuImmediate(menuName);
      return;
    }
    hoverIntentRef.current = window.setTimeout(() => {
      hoverIntentRef.current = null;
      setIsSwitching(false);
      setOpenMenu(menuName);
    }, NAV_HOVER_OPEN_DELAY_MS);
  };

  const closeOnHoverLeave = () => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clearHoverIntent();
    // Grace period before collapsing: a diagonal path from trigger into the
    // panel, or a quick hop to a neighbouring trigger, cancels this timer.
    hoverIntentRef.current = window.setTimeout(() => {
      hoverIntentRef.current = null;
      clearSubHoverIntent();
      setIsSwitching(false);
      setOpenMenu(null);
    }, NAV_HOVER_CLOSE_DELAY_MS);
  };

  // Keyboard parity: focus entering a dropdown wrapper opens it; focus leaving
  // the wrapper entirely (relatedTarget outside) closes it. Moving focus
  // between the trigger and the links inside keeps the panel open.
  const openOnFocus = (menuName: string) => {
    openMenuImmediate(menuName);
  };

  const closeOnBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    closeMenuImmediate();
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    setOpenMenu(null);
  };

  // Lock body scroll while the drawer is open, expose the live navbar height
  // as a CSS var so the drawer can pin itself to the actual bottom of the
  // header (Webflow's vw-based em sizing makes the height fluid), and
  // auto-close on resize to desktop.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const navbarEl = navbarRef.current;
    const previousOverflow = document.body.style.overflow;

    const syncNavbarHeight = () => {
      if (!navbarEl) return;
      const height = navbarEl.getBoundingClientRect().height;
      navbarEl.style.setProperty("--mobile-navbar-height", `${height}px`);
    };

    syncNavbarHeight();

    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow || "";
    }

    const handleResize = () => {
      syncNavbarHeight();
      if (window.innerWidth > 991 && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow || "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileNavOpen]);

  // Rotate the nav-search placeholder to hint that search covers kits, blog,
  // dashboards and AI inspiration. Cross-fades the outgoing text with the
  // incoming one by rendering two overlay spans for ~320ms.
  // Respects prefers-reduced-motion.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cleanupTimers: number[] = [];

    const id = window.setInterval(() => {
      setSearchPlaceholderIndex((current) => {
        if (!reduceMotion) {
          setPreviousPlaceholderIndex(current);
          const t = window.setTimeout(() => {
            setPreviousPlaceholderIndex(null);
          }, 360);
          cleanupTimers.push(t);
        }
        return (current + 1) % SEARCH_PLACEHOLDERS.length;
      });
    }, SEARCH_PLACEHOLDER_INTERVAL_MS);

    return () => {
      window.clearInterval(id);
      cleanupTimers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Close any open dropdown on Escape (keyboard escape hatch).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (openMenu === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearHoverIntent();
        clearSubHoverIntent();
        setIsSwitching(false);
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openMenu]);

  // Tidy any pending hover-intent timer on unmount so a queued open/close
  // never fires after teardown.
  useEffect(
    () => () => {
      if (hoverIntentRef.current !== null) {
        window.clearTimeout(hoverIntentRef.current);
      }
      if (subHoverIntentRef.current !== null) {
        window.clearTimeout(subHoverIntentRef.current);
      }
    },
    [],
  );

  // Reshuffle the inspiration pool once on mount. Doing it in an effect (not at
  // render) keeps SSR and the first client paint identical — the randomised
  // order swaps in right after hydration, so each refresh shows a fresh six.
  useEffect(() => {
    setShuffledInspiration(shuffle(INSPIRATION_ITEMS));
  }, []);

  const filteredBlogPreviews = (activeBlogCategory
    ? blogPosts.filter((p) => p.category === activeBlogCategory)
    : blogPosts
  ).slice(0, NAV_BLOG_PREVIEW_COUNT);

  // Hovering a category on the left swaps the kit previews on the right. The
  // featured six (KIT_PREVIEWS) belong to every category, so we rank matches by
  // specificity — fewer categories means the kit is more characteristic of the
  // hovered section — giving each tab a genuinely distinct set. On top of that
  // we pin the freshest catalogue product (PRODUCTS[0]) to the front of any
  // section it belongs to, so the newest kit always leads its tabs. "All"/
  // "Bundle" (category === null) keep the curated featured order.
  const filteredKitPreviews = (() => {
    if (activeKitCategory === BUNDLE_CATEGORY) {
      return BUNDLES.slice(0, NAV_KIT_PREVIEW_COUNT).map(bundlePreviewFromItem);
    }
    if (!activeKitCategory) return KIT_PREVIEWS;
    const category = activeKitCategory;
    const freshest = PRODUCTS[0];
    const matched = PRODUCTS.filter((product) => product.categories.includes(category))
      .slice()
      .sort((a, b) => {
        if (a === freshest) return -1;
        if (b === freshest) return 1;
        return a.categories.length - b.categories.length;
      })
      .slice(0, NAV_KIT_PREVIEW_COUNT)
      .map(kitPreviewFromProduct);
    return matched.length ? matched : KIT_PREVIEWS;
  })();

  // Hovering a freebies category swaps the right-hand previews. Freebies have a
  // single category each (unlike kits), so a plain equality filter is enough;
  // empty categories fall back to the full set so a tab never renders blank.
  const filteredFreebiePreviews = (() => {
    const list = activeFreebieCategory
      ? FREEBIE_PRODUCTS.filter((item) => item.category === activeFreebieCategory)
      : FREEBIE_PRODUCTS;
    return (list.length ? list : FREEBIE_PRODUCTS).slice(0, NAV_FREEBIE_PREVIEW_COUNT);
  })();

  // Hovering a category on the left narrows the inspiration previews to that
  // component type; "All" (category === null) draws from the whole shuffled
  // pool. We filter the already-shuffled list so the six shown stay random yet
  // refresh-stable. If a category has fewer than NAV_INSPIRATION_PREVIEW_COUNT
  // items (e.g. Badges only has 4), we top the row up with other items from the
  // pool so the grid always renders a full set of six cards.
  const filteredInspirationPreviews = (() => {
    if (!activeInspirationCategory) {
      return shuffledInspiration.slice(0, NAV_INSPIRATION_PREVIEW_COUNT);
    }
    const matched = shuffledInspiration.filter(
      (item) => item.componentType === activeInspirationCategory,
    );
    if (matched.length >= NAV_INSPIRATION_PREVIEW_COUNT) {
      return matched.slice(0, NAV_INSPIRATION_PREVIEW_COUNT);
    }
    const matchedIds = new Set(matched.map((item) => item.id));
    const filler = shuffledInspiration.filter((item) => !matchedIds.has(item.id));
    return [...matched, ...filler].slice(0, NAV_INSPIRATION_PREVIEW_COUNT);
  })();

  return (
    <div
      ref={navbarRef}
      className={`navbar w-nav${isMobileNavOpen ? " is-mobile-open" : ""}${isSwitching ? " is-switching" : ""}`}
      data-collapse="medium"
      role="banner"
    >
      <div className="container">
        <div className="nav-wrapper div-block">
          <div className="brand">
            <img alt="" className="nav_logo-image" loading="lazy" src="/images/Vectors-Wrapper.svg" />
            <a className="brand-link w-inline-block" href="/" />
          </div>

          <nav
            className={`nav-menu w-nav-menu${isMobileNavOpen ? " is-mobile-open" : ""}`}
            role="navigation"
          >
            <div className="nav-menu-inner">
              <div className="nav-menu-links-wr">
                {HAS_INSPIRATION ? (
                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("inspiration")} onMouseLeave={closeOnHoverLeave} onFocus={() => openOnFocus("inspiration")} onBlur={closeOnBlur}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("inspiration") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("inspiration") ? "w--open" : ""}${isInspirationActive ? " w--current" : ""}`}
                      onClick={() => toggleMenu("inspiration")}
                    >
                      <div className="text-size-regular" style={{ display: "inline-flex", alignItems: "center" }}>
                        Inspiration
                        <span style={INSPIRATION_BADGE_STYLE} aria-hidden="true">New</span>
                      </div>
                      <span className="icon nav_chevron"><ChevronIcon /></span>
                      <a
                        className="nav_dropdown_toggle-link w-inline-block"
                        href={withUtm("https://app.setproduct.com/")}
                        rel="noreferrer"
                        target="_blank"
                        aria-label="Inspiration — AI UI library (opens in a new tab)"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen("inspiration")}
                      />
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("inspiration") ? "w--open" : ""}`}
                      inert={!isMenuOpen("inspiration")}
                    >
                      <div className="container">
                        <div className="form-block w-form">
                          <form method="get" name="email-form-nav-inspiration">
                            <div className="nav_dropdown-menu2">
                              <div className="nav_dropdown-column list">
                                <div className="nav_dropdown-column-title-wr">
                                  <div className="text-size-regular">Categories</div>
                                </div>
                                <div className="nav-links is-1-column">
                                  {INSPIRATION_CATEGORIES.map((cat) => {
                                    const isActive = activeInspirationCategory === cat.slug;
                                    return (
                                      <a
                                        className={`nav_radio w-inline-block${isActive ? " w--current" : ""}`}
                                        href={withUtm(`https://app.setproduct.com/components/${cat.slug}`)}
                                        rel="noreferrer"
                                        target="_blank"
                                        key={cat.slug}
                                        onMouseEnter={() => switchSubcategoryOnHover(() => setActiveInspirationCategory(cat.slug))}
                                        onMouseLeave={clearSubHoverIntent}
                                        onFocus={() => switchSubcategoryNow(() => setActiveInspirationCategory(cat.slug))}
                                      >
                                        <p className={`text-size-regular${isActive ? " text-color-primary" : ""}`}>{cat.label}</p>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="nav_dropdown-list-wr">
                                <div className="nav_tabs-list-wr w-dyn-list">
                                  <div
                                    className="nav_tabs-list w-dyn-items w-row nav_tabs-list--animated"
                                    role="list"
                                    key={`inspiration-${activeInspirationCategory ?? "all"}`}
                                  >
                                    {filteredInspirationPreviews.map((item) => (
                                      <div className="nav_tabs-list-item w-dyn-item w-col w-col-6" key={item.id} role="listitem">
                                        <div className="nav_tabs-list-item-wr">
                                          <InspirationThumb href={withUtm(item.href)} image={item.image} />
                                          <div className="nav_tabs-list-item-info-wr">
                                            <a className="w-inline-block" href={withUtm(item.href)} rel="noreferrer" target="_blank">
                                              <p className="text-size-regular text-weight-semibold text-color-dark-primary text-style-1line">{item.title}</p>
                                            </a>
                                            <p className="text-size-tiny text-style-3lines">{item.description}</p>
                                            <div className="nav_tabs-list-item-btn-wr">
                                              <a className="button-x-small is-secondary w-inline-block" href={withUtm(item.href)} rel="noreferrer" target="_blank">
                                                <div className="text-size-regular text-weight-bold">View</div>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                ) : (
                  <a
                    className="nav-link-block w-inline-block"
                    href={withUtm("https://app.setproduct.com/")}
                    rel="noreferrer"
                    target="_blank"
                    aria-label="Inspiration — AI UI library (opens in a new tab)"
                  >
                    <div className="text-size-regular" style={{ display: "inline-flex", alignItems: "center" }}>
                      Inspiration
                      <span style={INSPIRATION_BADGE_STYLE} aria-hidden="true">New</span>
                    </div>
                  </a>
                )}

                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("tutorials")} onMouseLeave={closeOnHoverLeave} onFocus={() => openOnFocus("tutorials")} onBlur={closeOnBlur}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("tutorials") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("tutorials") ? "w--open" : ""}${isTutorialsActive || isMenuOpen("tutorials") ? " w--current" : ""}`}
                      onClick={() => toggleMenu("tutorials")}
                    >
                      <div className="text-size-regular">Learn</div>
                      <span className="icon nav_chevron"><ChevronIcon /></span>
                      <a
                        className="nav_dropdown_toggle-link w-inline-block"
                        href="/blog"
                        aria-label="Learn — blog and tutorials"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen("tutorials")}
                      />
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("tutorials") ? "w--open" : ""}`}
                      inert={!isMenuOpen("tutorials")}
                    >
                      <div className="container">
                        <div className="form-block w-form">
                          <form method="get" name="email-form-nav-1">
                            <div className="nav_dropdown-menu2">
                              <div className="nav_dropdown-column list">
                                <div className="nav_dropdown-column-title-wr">
                                  <div className="text-size-regular">Categories</div>
                                </div>
                                <div className="nav-links is-1-column">
                                  {NAV_BLOG_CATEGORIES.map((item) => {
                                    const href = item.category
                                      ? `/blog?category=${encodeURIComponent(item.category)}`
                                      : "/blog";
                                    return (
                                      <a
                                        className={`nav_radio w-inline-block${activeBlogCategory === item.category ? " w--current" : ""}`}
                                        key={item.label}
                                        href={href}
                                        onMouseEnter={() => switchSubcategoryOnHover(() => setActiveBlogCategory(item.category))}
                                        onMouseLeave={clearSubHoverIntent}
                                        onFocus={() => switchSubcategoryNow(() => setActiveBlogCategory(item.category))}
                                      >
                                        <p className={`text-size-regular${activeBlogCategory === item.category ? " text-color-primary" : ""}`}>{item.label}</p>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="nav_dropdown-list-wr">
                                <div className="nav_tabs-list-wr w-dyn-list">
                                  <div
                                    className="nav_tabs-list w-dyn-items w-row nav_tabs-list--animated"
                                    role="list"
                                    key={`tutorials-${activeBlogCategory ?? "all"}`}
                                  >
                                    {filteredBlogPreviews.map((item) => (
                                       <div className="nav_tabs-list-item w-dyn-item w-col w-col-6" key={item.slug} role="listitem">
                                         <div className="nav_tabs-list-item-wr">
                                            <a
                                              className="nav_tabs-list-item-img-wr w-inline-block relative"
                                              href={`/blog/${item.slug}`}
                                            >
                                              <img
                                                alt={item.slug}
                                                src={item.thumbImage}
                                                sizes="158px"
                                                className="image-cover"
                                              />
                                            </a>
                                           <div className="nav_tabs-list-item-info-wr">
                                             <a className="w-inline-block" href={`/blog/${item.slug}`}>
                                               <p className="text-size-regular text-weight-semibold text-color-dark-primary text-style-1line">{item.title}</p>
                                             </a>
                                             <p className="text-size-tiny text-style-3lines">{item.description}</p>
                                             <div className="nav_tabs-list-item-btn-wr">
                                               <a className="button-x-small is-text w-inline-block" href={`/blog/${item.slug}`}>
                                                 <div className="text-size-regular text-weight-bold">Read more</div>
                                               </a>
                                             </div>
                                           </div>
                                         </div>
                                       </div>
                                     ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>

                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("freebies")} onMouseLeave={closeOnHoverLeave} onFocus={() => openOnFocus("freebies")} onBlur={closeOnBlur}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("freebies") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("freebies") ? "w--open" : ""}${isFreebiesActive || isMenuOpen("freebies") ? " w--current" : ""}`}
                      onClick={() => toggleMenu("freebies")}
                    >
                      <div className="text-size-regular">Freebies</div>
                      <span className="icon nav_chevron"><ChevronIcon /></span>
                      <a
                        className="nav_dropdown_toggle-link w-inline-block"
                        href="/freebies"
                        aria-label="Freebies"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen("freebies")}
                      />
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("freebies") ? "w--open" : ""}`}
                      inert={!isMenuOpen("freebies")}
                    >
                      <div className="container">
                        <div className="form-block w-form">
                          <form method="get" name="email-form-nav-3">
                            <div className="nav_dropdown-menu2">
                              <div className="nav_dropdown-column list">
                                <div className="nav_dropdown-column-title-wr">
                                  <div className="text-size-regular">Categories</div>
                                </div>
                                <div className="nav-links is-1-column">
                                  {NAV_FREEBIE_CATEGORIES.map((item) => {
                                    const isActive = activeFreebieCategory === item.category;
                                    return (
                                      <a
                                        className={`nav_radio w-inline-block${isActive ? " w--current" : ""}`}
                                        href="/freebies"
                                        key={item.label}
                                        onMouseEnter={() => switchSubcategoryOnHover(() => setActiveFreebieCategory(item.category))}
                                        onMouseLeave={clearSubHoverIntent}
                                        onFocus={() => switchSubcategoryNow(() => setActiveFreebieCategory(item.category))}
                                      >
                                        <p className={`text-size-regular${isActive ? " text-color-primary" : ""}`}>{item.label}</p>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="nav_dropdown-list-wr">
                                <div className="nav_tabs-list-wr w-dyn-list">
                                  <div
                                    className="nav_tabs-list w-dyn-items w-row nav_tabs-list--animated"
                                    role="list"
                                    key={`freebies-${activeFreebieCategory ?? "all"}`}
                                  >
                                    {filteredFreebiePreviews.map((item) => (
                                      <div className="nav_tabs-list-item w-dyn-item w-col w-col-6" key={item.slug} role="listitem">
                                        <div className="nav_tabs-list-item-wr">
                                           <a
                                             className="nav_tabs-list-item-img-wr w-inline-block relative"
                                             href={item.previewHref}
                                           >
                                             <Image
                                               alt={item.title}
                                               src={item.thumb}
                                               fill
                                               sizes="158px"
                                               className="image-cover"
                                             />
                                           </a>
                                          <div className="nav_tabs-list-item-info-wr">
                                            <a className="w-inline-block" href={item.previewHref}>
                                              <p className="text-size-regular text-weight-semibold text-color-dark-primary text-style-1line">{item.title}</p>
                                            </a>
                                            <p className="text-size-tiny text-style-3lines">{item.description}</p>
                                            <div className="nav_tabs-list-item-btn-wr">
                                              <a className="button-x-small is-secondary w-inline-block" href={item.duplicateHref} rel="noreferrer" target="_blank">
                                                <div className="text-size-regular text-weight-bold">{item.menuCtaLabel ?? item.ctaLabel ?? (item.isFree ? "Duplicate" : "Buy")}</div>
                                              </a>
                                              <a className="button-x-small is-text w-inline-block" href={item.previewHref}>
                                                <div className="text-size-regular text-weight-bold">Preview</div>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>

                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("designKits")} onMouseLeave={closeOnHoverLeave} onFocus={() => openOnFocus("designKits")} onBlur={closeOnBlur}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("designKits") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("designKits") ? "w--open" : ""}${isDesignKitsActive || isMenuOpen("designKits") ? " w--current" : ""}`}
                      onClick={() => toggleMenu("designKits")}
                    >
                      <div className="text-size-regular">UI Kits</div>
                      <span className="icon nav_chevron"><ChevronIcon /></span>
                      <a
                        className="nav_dropdown_toggle-link w-inline-block"
                        href="/all"
                        aria-label="UI kits"
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen("designKits")}
                      />
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("designKits") ? "w--open" : ""}`}
                      inert={!isMenuOpen("designKits")}
                    >
                      <div className="container">
                        <div className="form-block w-form">
                          <form method="get" name="email-form-nav-2">
                            <div className="nav_dropdown-menu2">
                              <div className="nav_dropdown-column list">
                                <div className="nav_dropdown-column-title-wr">
                                  <div className="text-size-regular">Categories</div>
                                </div>
                                <div className="nav-links is-1-column">
                                  {DESIGN_KITS.map((link) => {
                                    const isActive =
                                      link.category !== null &&
                                      activeKitCategory === link.category;
                                    return (
                                      <a
                                        className={`nav_radio w-inline-block${isActive ? " w--current" : ""}`}
                                        href={link.href}
                                        key={link.href}
                                        onMouseEnter={() => switchSubcategoryOnHover(() => setActiveKitCategory(link.category))}
                                        onMouseLeave={clearSubHoverIntent}
                                        onFocus={() => switchSubcategoryNow(() => setActiveKitCategory(link.category))}
                                      >
                                        <p className={`text-size-regular${isActive ? " text-color-primary" : ""}`}>{link.label}</p>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="nav_dropdown-list-wr">
                                <div className="nav_tabs-list-wr w-dyn-list">
                                  <div
                                    className="nav_tabs-list w-dyn-items w-row nav_tabs-list--animated"
                                    role="list"
                                    key={`kits-${activeKitCategory ?? "all"}`}
                                  >
                                    {filteredKitPreviews.map((item) => (
                                      <div className="nav_tabs-list-item w-dyn-item w-col w-col-6" key={item.href} role="listitem">
                                        <div className="nav_tabs-list-item-wr">
                                           <a
                                             className="nav_tabs-list-item-img-wr w-inline-block relative"
                                             href={item.href}
                                           >
                                             <Image
                                               alt=""
                                               src={item.image}
                                               fill
                                               sizes="158px"
                                               className="image-cover"
                                             />
                                           </a>
                                          <div className="nav_tabs-list-item-info-wr">
                                            <a className="w-inline-block" href={item.href}>
                                              <p className="text-size-regular text-weight-semibold text-color-dark-primary text-style-1line">{item.title}</p>
                                            </a>
                                            <p className="text-size-tiny text-style-3lines">{item.description}</p>
                                            <div className="nav_tabs-list-item-btn-wr">
                                          <a href={item.buyHref} {...getGumroadLinkProps(item.buyHref, "button-x-small is-secondary w-inline-block")}>
                                            <div className="text-size-regular text-weight-bold">{item.buyLabel}</div>
                                          </a>
                                              <a className="button-x-small is-text w-inline-block" href={item.href}>
                                                <div className="text-size-regular text-weight-bold">Learn more</div>
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>

                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("information")} onMouseLeave={closeOnHoverLeave} onFocus={() => openOnFocus("information")} onBlur={closeOnBlur}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("information") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("information") ? "w--open" : ""}${isInformationActive || isMenuOpen("information") ? " w--current" : ""}`}
                      onClick={() => toggleMenu("information")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleMenu("information");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen("information")}
                    >
                      <div className="text-size-regular">Company</div>
                      <span className="icon nav_chevron"><ChevronIcon /></span>
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("information") ? "w--open" : ""}`}
                      inert={!isMenuOpen("information")}
                    >
                      <div className="container">
                        <div className="nav_dropdown-menu2">
                          <div className="nav_dropdown-column list">
                            <div className="nav_dropdown-column-title-wr">
                              <div className="text-size-regular">Company</div>
                            </div>
                            <div className="nav-links is-1-column">
                              {INFORMATION_LINKS.map((link) => (
                                <a
                                  className="link-block w-inline-block"
                                  href={link.href}
                                  key={link.label}
                                  onClick={link.modal ? (e) => { e.preventDefault(); openContactModal(); } : undefined}
                                >
                                  <div className="text-size-regular">{link.label}</div>
                                </a>
                              ))}
                            </div>
                          </div>
                          <div className="nav_info-promo-wr">
                            <div className="nav_info-promo">
                              <span className="nav_info-promo-glow" aria-hidden="true" />
                              <div className="nav_info-promo-content">
                                <div className="nav_info-promo-eyebrow">Work with us</div>
                                <div className="nav_info-promo-title">Need a custom design?</div>
                                <p className="text-size-regular nav_info-promo-text">
                                  Tell us about your product — our team crafts tailored dashboards, mobile, and web UI, or a full design system built around your brand.
                                </p>
                                <button
                                  type="button"
                                  className="button w-inline-block nav_info-promo-cta"
                                  onClick={() => openContactModal()}
                                >
                                  <div className="text-size-large text-weight-bold">Get a quote</div>
                                </button>
                              </div>
                            </div>
                            <div className="nav_info-promo is-advertising">
                              <span className="nav_info-promo-glow" aria-hidden="true" />
                              <div className="nav_info-promo-content">
                                <div className="nav_info-promo-eyebrow">Advertising</div>
                                <div className="nav_info-promo-title">Publish on our blog</div>
                                <p className="text-size-regular nav_info-promo-text">
                                  Reach thousands of designers and founders. Place a sponsored article or banner and put your product in front of our audience.
                                </p>
                                <a
                                  className="button secondary w-inline-block nav_info-promo-cta"
                                  href="https://publish.setproduct.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <div className="text-size-large text-weight-bold">Advertise with us</div>
                                  <div className="button-icon w-embed"><ArrowIcon /></div>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="nav_info-promo-mobile">
                            <div className="nav_info-promo-mobile-eyebrow">Work with us</div>
                            <div className="nav_info-promo-mobile-title">Custom design or advertising?</div>
                            <p className="text-size-regular nav_info-promo-mobile-text">
                              Tell us about your product, or place a sponsored post in front of our audience.
                            </p>
                            <button
                              type="button"
                              className="button-small w-inline-block nav_info-promo-mobile-cta"
                              onClick={() => openContactModal()}
                            >
                              <div className="text-size-medium text-weight-bold">Get a quote</div>
                            </button>
                            <a
                              className="button-small secondary w-inline-block nav_info-promo-mobile-cta"
                              href="https://publish.setproduct.com"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="text-size-medium text-weight-bold">Advertise with us</div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>

              </div>

              <div className="nav-menu-mob-btn-wr">
                <form action="/search" className="search w-form nav-menu-mob-search" role="search">
                  <input
                    aria-label="Search Setproduct"
                    className="w-input nav-menu-mob-search-input"
                    enterKeyHint="search"
                    maxLength={256}
                    name="query"
                    placeholder="Search Setproduct…"
                    required
                    type="search"
                  />
                  <button aria-label="Search" className="nav-menu-mob-search-btn" type="submit">
                    <img alt="" className="search-icon" loading="lazy" src="/images/search.svg" />
                  </button>
                </form>
              </div>
            </div>
          </nav>

          <button
            type="button"
            aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileNavOpen}
            className={`menu-button icon-2 w-nav-button${isMobileNavOpen ? " w--open" : ""}`}
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            <div className="menu-button-img-wr">
              <img alt="" className="menu-button-img is-burger" loading="lazy" src="/images/menu.svg" />
              <img alt="" className="menu-button-img is-close" loading="lazy" src="/images/close.svg" />
            </div>
          </button>

          <div className="nav-button-wr">
            <form action="/search" className="search w-form" style={{ position: "relative" }}>
              <input
                aria-label="Search Setproduct"
                className="text-input is-nav-search w-input"
                id="search"
                maxLength={256}
                name="query"
                placeholder=""
                required
                type="search"
              />
              {previousPlaceholderIndex !== null && (
                <span
                  key={`leaving-${previousPlaceholderIndex}`}
                  aria-hidden="true"
                  className="nav-search-placeholder is-leaving"
                >
                  {SEARCH_PLACEHOLDERS[previousPlaceholderIndex]}
                </span>
              )}
              <span
                key={`entering-${searchPlaceholderIndex}`}
                aria-hidden="true"
                className="nav-search-placeholder is-entering"
              >
                {SEARCH_PLACEHOLDERS[searchPlaceholderIndex]}
              </span>
              <input className="hide w-button" type="submit" value="Search" />
              <div className="search-icon-wr">
                <img alt="" className="search-icon" loading="lazy" src="/images/search.svg" />
              </div>
            </form>
            <div className="relative inline-flex items-center">
              <a
                className="button-small w-inline-block"
                href="https://app.setproduct.com/"
                rel="noreferrer"
                target="_blank"
                aria-label="Inspire me — open the AI UI library"
                style={{ flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}
              >
                <div className="text-size-medium text-weight-bold">Inspire me</div>
                <div style={LAUNCH_APP_SUBLABEL_STYLE}>AI UI library →</div>
              </a>
              {/* Temporarily disabled — kept for potential future use. */}
              {/* <LaunchAppCallout /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
