"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { BLOG_POSTS } from "../../data/blog-listing";
import { useContactModal } from "../modals/ContactModalContext";

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

const DESIGN_KITS = [
  { href: "/all", label: "All" },
  { href: "/dashboards", label: "Dashboards" },
  { href: "/mobile", label: "Mobile" },
  { href: "/dataviz", label: "Charts" },
  { href: "/code", label: "Code" },
  { href: "/websites", label: "Websites" },
  { href: "/bundle", label: "Bundle" },
];

const INFORMATION_LINKS = [
  { href: "/testimonials", label: "Testimonials" },
  { href: "/legal/license", label: "License" },
  { href: "/legal/refunds-policy", label: "Refund Policy" },
  { href: "#", label: "Contact us", modal: true },
];

const NAV_BLOG_PREVIEW_COUNT = 6;

const KIT_PREVIEWS: KitPreview[] = [
  {
    href: "/templates/orion",
    buyHref: "https://gumroad.com/a/530945235/kzbajr",
    buyLabel: "Buy $148",
    image: "/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/6581822fb4f818e3674d3801_pricing-orion-01.webp",
    title: "Orion UI kit",
    description: "Figma library with 40+ full-width charts templates served in light & dark themes. Contains 200+ of dataviz widgets that look perfect on desktop & mobile screens.",
  },
  {
    href: "/templates/nocra",
    buyHref: "https://gumroad.com/a/530945235/uocxtg",
    buyLabel: "Buy $98",
    image: "/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/686262d49adba480c8298ccc_nocra-cover-min.jpg",
    title: "Nocra UI kit",
    description: "Nocra is a design system for AI products. Built specifically for startups harnessing AI generation: images, video, audio, music, prompts, and beyond.",
  },
  {
    href: "/templates/charts",
    buyHref: "https://setproduct.gumroad.com/l/graphz_pro",
    buyLabel: "Buy $168",
    image: "/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/658c09d54cd3f40b33840524_pricing-charts-01.avif",
    title: "Figma Charts UI kit",
    description: "Components-driven graphs design kit for dashboards, presentations, infographics & data visualisation. Includes 25+ charts types for all the viewports.",
  },
  {
    href: "/templates/nucleus-ui",
    buyHref: "https://gumroad.com/a/169902547/snlaf",
    buyLabel: "Buy $89",
    image: "/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/660e8cb274438ae24e0e9b32_65858952fbfba6f0b7c1727b_nucleus-cover-1920-m_(1).avif",
    title: "Nucleus UI",
    description: "Nucleus UI contains 1000 components and variants with 500+ mobile screens designed for Figma (including 9 themes from Event, E-commerce, Finance, NFT, etc.).",
  },
  {
    href: "/templates/material-x",
    buyHref: "https://setproduct.gumroad.com/l/material-x-fig",
    buyLabel: "Buy $148",
    image: "/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/660e8b3de9d92cd2717a31a9_6582e572f92ec39e162a49a8_pircing-mx-02_(1).avif",
    title: "Material X for Figma",
    description: "Figma library with 1100+ components & 40 app templates beyond Material Design. Powered by top-notch shapes and Manrope font. Customizable & Adjustable UI kit now available for Angular & Figma",
  },
  {
    href: "/templates/material-you",
    buyHref: "https://gumroad.com/a/135691379/upxbb",
    buyLabel: "Buy $124",
    image: "/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/660e8bd8e10b051b70a441f2_658189130000cb93c2db5936_pricing-materialme_(1).avif",
    title: "Material You UI kit",
    description: "Figma & React library with 2600+ variants of 32 components compatible with Material Design 3. Plus 220+ dashboard templates for all the viewports. Now available for NextJS & TailwindCSS.",
  },
];

export default function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeBlogCategory, setActiveBlogCategory] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const { openContactModal } = useContactModal();
  const router = useRouter();
  const currentPath = router.pathname;

  const isPathActive = (href: string) =>
    href === "/" ? currentPath === "/" : currentPath === href || currentPath.startsWith(`${href}/`);

  const isTutorialsActive = currentPath === "/blog" || currentPath.startsWith("/blog/");
  const isDesignKitsActive = DESIGN_KITS.some((k) => isPathActive(k.href)) ||
    currentPath.startsWith("/templates/");
  const isInformationActive = INFORMATION_LINKS.some(
    (link) => !link.modal && link.href !== "#" && isPathActive(link.href),
  );

  const isMenuOpen = (menuName: string) => openMenu === menuName;

  const toggleMenu = (menuName: string) => {
    setOpenMenu((current) => (current === menuName ? null : menuName));
  };

  const openOnHover = (menuName: string) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setOpenMenu(menuName);
    }
  };

  const closeOnHoverLeave = () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setOpenMenu(null);
    }
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

  const filteredBlogPreviews = (activeBlogCategory
    ? BLOG_POSTS.filter((p) => p.category === activeBlogCategory)
    : BLOG_POSTS
  ).slice(0, NAV_BLOG_PREVIEW_COUNT);

  return (
    <div
      ref={navbarRef}
      className={`navbar w-nav${isMobileNavOpen ? " is-mobile-open" : ""}`}
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
                <a className="nav-link-block w-inline-block" href="https://app.setproduct.com/" rel="noreferrer" target="_blank">
                  <div className="text-size-regular">Inspiration</div>
                </a>

                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("tutorials")} onMouseLeave={closeOnHoverLeave}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("tutorials") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("tutorials") ? "w--open" : ""}${isTutorialsActive || isMenuOpen("tutorials") ? " w--current" : ""}`}
                      onClick={() => toggleMenu("tutorials")}
                    >
                      <div className="text-size-regular">Tutorials</div>
                      <div className="icon w-icon-dropdown-toggle" />
                      <a className="nav_dropdown_toggle-link w-inline-block" href="/blog" />
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("tutorials") ? "w--open" : ""}`}
                      aria-hidden={!isMenuOpen("tutorials")}
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
                                        onMouseEnter={() => setActiveBlogCategory(item.category)}
                                      >
                                        <p className={`text-size-regular${activeBlogCategory === item.category ? " text-color-primary" : ""}`}>{item.label}</p>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="nav_dropdown-list-wr">
                                <div className="nav_tabs-list-wr w-dyn-list">
                                  <div className="nav_tabs-list w-dyn-items w-row" role="list">
                                    {filteredBlogPreviews.map((item) => (
                                       <div className="nav_tabs-list-item w-dyn-item w-col w-col-6" key={item.slug} role="listitem">
                                         <div className="nav_tabs-list-item-wr">
                                           <a className="nav_tabs-list-item-img-wr w-inline-block" href={`/blog/${item.slug}`}>
                                             <img alt="" className="image-cover" loading="lazy" src={item.image} />
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

                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("designKits")} onMouseLeave={closeOnHoverLeave}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("designKits") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("designKits") ? "w--open" : ""}${isDesignKitsActive || isMenuOpen("designKits") ? " w--current" : ""}`}
                      onClick={() => toggleMenu("designKits")}
                    >
                      <div className="text-size-regular">Design Kits</div>
                      <div className="icon w-icon-dropdown-toggle" />
                      <a className="nav_dropdown_toggle-link w-inline-block" href="/all" />
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("designKits") ? "w--open" : ""}`}
                      aria-hidden={!isMenuOpen("designKits")}
                    >
                      <div className="container">
                        <div className="form-block w-form">
                          <form method="get" name="email-form-nav-2">
                            <div className="nav_dropdown-menu2">
                              <div className="nav_dropdown-column list">
                                <div className="nav_dropdown-column-title-wr">
                                  <div className="text-size-regular">Design Kits</div>
                                </div>
                                <div className="nav-links is-1-column">
                                  {DESIGN_KITS.map((link) => (
                                    <a className="nav_radio w-inline-block" href={link.href} key={link.href}>
                                      <p className="text-size-regular">{link.label}</p>
                                    </a>
                                  ))}
                                </div>
                              </div>
                              <div className="nav_dropdown-list-wr">
                                <div className="nav_tabs-list-wr w-dyn-list">
                                  <div className="nav_tabs-list w-dyn-items w-row" role="list">
                                    {KIT_PREVIEWS.map((item) => (
                                      <div className="nav_tabs-list-item w-dyn-item w-col w-col-6" key={item.href} role="listitem">
                                        <div className="nav_tabs-list-item-wr">
                                          <a className="nav_tabs-list-item-img-wr w-inline-block" href={item.href}>
                                            <img alt="" className="image-cover" loading="lazy" src={item.image} />
                                          </a>
                                          <div className="nav_tabs-list-item-info-wr">
                                            <a className="w-inline-block" href={item.href}>
                                              <p className="text-size-regular text-weight-semibold text-color-dark-primary text-style-1line">{item.title}</p>
                                            </a>
                                            <p className="text-size-tiny text-style-3lines">{item.description}</p>
                                            <div className="nav_tabs-list-item-btn-wr">
                                          <a className="button-x-small is-secondary w-inline-block" href={item.buyHref} rel="noreferrer" target="_blank">
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

                <div className="nav_dropdown-wr" onMouseEnter={() => openOnHover("information")} onMouseLeave={closeOnHoverLeave}>
                  <div className={`nav_dropdown w-dropdown ${isMenuOpen("information") ? "w--open" : ""}`} data-delay="0" data-hover="true">
                    <div
                      className={`nav_dropdown_toggle w-dropdown-toggle ${isMenuOpen("information") ? "w--open" : ""}${isInformationActive || isMenuOpen("information") ? " w--current" : ""}`}
                      onClick={() => toggleMenu("information")}
                    >
                      <div className="text-size-regular">Information</div>
                      <div className="icon w-icon-dropdown-toggle" />
                    </div>
                    <nav
                      className={`nav_dropdown_list w-dropdown-list ${isMenuOpen("information") ? "w--open" : ""}`}
                      aria-hidden={!isMenuOpen("information")}
                    >
                      <div className="container">
                        <div className="nav_dropdown-menu">
                          <div className="nav_dropdown-column information">
                            <div className="nav_dropdown-column-title-wr">
                              <div className="text-size-regular">Information</div>
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
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>

                <a
                  className={`nav-link-block w-inline-block${isPathActive("/freebies") ? " w--current" : ""}`}
                  href="/freebies"
                >
                  <div className="text-size-regular">Freebies</div>
                </a>
              </div>

              <div className="nav-menu-mob-btn-wr">
                <a className="button-small w-inline-block" href="#" onClick={(e) => { e.preventDefault(); openContactModal(); }}>
                  <div className="text-size-medium text-weight-bold">Get a Quote</div>
                </a>
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
            <form action="/search" className="search w-form">
              <input className="text-input is-nav-search w-input" id="search" maxLength={256} name="query" placeholder="Search…" required type="search" />
              <input className="hide w-button" type="submit" value="Search" />
              <div className="search-icon-wr">
                <img alt="" className="search-icon" loading="lazy" src="/images/search.svg" />
              </div>
            </form>
            <a className="button-small w-inline-block" href="https://app.setproduct.com/" rel="noreferrer" target="_blank">
              <div className="text-size-medium text-weight-bold">Launch App</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
