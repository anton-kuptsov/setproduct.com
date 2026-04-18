import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import styles from "./FreebiesListingPage.module.css";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import CtaSubscribe from "../sections/CtaSubscribe";
import TemplateShowcase from "../sections/TemplateShowcase";
import FreebieTemplateCard from "../sections/FreebieTemplateCard";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";
import { FREEBIE_PRODUCTS, FREEBIES_CATEGORIES } from "../../data/freebies-listing";

const PAGE_SIZE = 9;
const ALL_TOPICS = "All topics";

export default function FreebiesListingPage() {
  const meta = PAGE_META.freebies;
  const breadcrumbs = PAGE_BREADCRUMBS.freebies ?? [];
  const [activeCategory, setActiveCategory] = useState(ALL_TOPICS);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const activeCategoryLabel = activeCategory === ALL_TOPICS ? "All" : activeCategory;

  const filteredProducts = useMemo(
    () =>
      FREEBIE_PRODUCTS.filter((item) => {
        const matchesCategory = activeCategory === ALL_TOPICS || item.category === activeCategory;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      }),
    [activeCategory, normalizedQuery],
  );
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const onCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
    setIsCategoryDropdownOpen(false);
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!categoryDropdownRef.current?.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main className="mt-22.5">
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="blog_hero-section">
                <div className="heading-left-text-wr">
                  <h1 className="heading-style-h1">Free Figma templates</h1>
                  <div className="heading-style-h5">We make UI design resources right!</div>
                </div>
              </div>
              <div className="spacer-64" />
              <div className="templates_list-section">
                <div className="form-block w-form">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="templates_list-head">
                      <div className="freebies_filters-wr">
                        <p className="text-size-regular text-weight-semibold" id="freebies-category-filter-label">
                          Filter by
                        </p>
                        <div
                          ref={categoryDropdownRef}
                          className={`fs-select-1 w-dropdown ${styles.categoryDropdown}${isCategoryDropdownOpen ? " w--open" : ""}`}
                          data-delay={0}
                          data-hover="false"
                        >
                          <button
                            id="freebies-category-filter"
                            type="button"
                            aria-expanded={isCategoryDropdownOpen}
                            aria-haspopup="listbox"
                            aria-labelledby="freebies-category-filter-label freebies-category-filter"
                            className={`text-input is-search is-freebies-filters w-dropdown-toggle ${styles.selectToggle}`}
                            onClick={() => setIsCategoryDropdownOpen((open) => !open)}
                          >
                            <div
                              className={`fs-select_icon-1 w-icon-dropdown-toggle ${styles.selectIcon}${
                                isCategoryDropdownOpen ? ` ${styles.selectIconOpen}` : ""
                              }`}
                            />
                            <div className="fs-select_text-1">{activeCategoryLabel}</div>
                          </button>
                          <nav className={`fs-select_list-1 w-dropdown-list ${styles.selectList}${isCategoryDropdownOpen ? " w--open" : ""}`}>
                            {FREEBIES_CATEGORIES.map((category) => (
                              <button
                                key={category}
                                type="button"
                                role="option"
                                aria-selected={category === activeCategory}
                                className={`fs-select_link-1 w-dropdown-link ${styles.selectOption}${
                                  category === activeCategory ? " w--current" : ""
                                }`}
                                onClick={() => onCategoryChange(category)}
                              >
                                {category === ALL_TOPICS ? "All" : category}
                              </button>
                            ))}
                          </nav>
                        </div>
                        <div className="collection-list-wrapper-2 w-dyn-list">
                          <div className="w-dyn-items" role="list">
                            {FREEBIES_CATEGORIES.filter((category) => category !== ALL_TOPICS).map((category) => (
                              <div key={category} className="w-dyn-item" role="listitem">
                                <p fs-cmsselect-element="text-value">{category}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <input
                        className="text-input is-search is-templates w-input"
                        aria-label="Search freebies"
                        maxLength={256}
                        name="field"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setVisibleCount(PAGE_SIZE);
                        }}
                        placeholder="Search"
                        type="text"
                        value={searchQuery}
                      />
                    </div>
                    <div className="spacer-40" />
                    <div className="w-dyn-list">
                      <div className="freebies_cl w-dyn-items" role="list">
                        {visibleProducts.map((item) => (
                          <div key={item.slug} className="w-dyn-item" role="listitem">
                            <FreebieTemplateCard item={item} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {hasMore && (
                      <div className="mt-14">
                        <div className="main_blog-liist2-btn-wr">
                          <a
                            className="button-small outlined w-inline-block"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setVisibleCount((count) => count + PAGE_SIZE);
                            }}
                          >
                            <div className="text-size-medium text-weight-bold">Load More</div>
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="w-form-done">
                      <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div className="w-form-fail">
                      <div>Oops! Something went wrong while submitting the form.</div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CtaSubscribe />
        <TemplateShowcase />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
