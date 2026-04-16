import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { PRODUCTS } from "../../data/products";
import { CATEGORY_TABS } from "../../data/categories";
import { SLIDER_PRODUCTS } from "../../data/slider-products";
import SliderTemplateCard from "./SliderTemplateCard";
import ArrowIcon from "./ArrowIcon";

const SLIDER_TABS = CATEGORY_TABS.filter((t) => t.slug !== "all");
const ITEMS_PER_PAGE = 3;

const productMap = new Map(PRODUCTS.map((p) => [p.slug, p]));
const PRODUCTS_BY_TAB: Record<string, typeof PRODUCTS> = {};
for (const [cat, slugs] of Object.entries(SLIDER_PRODUCTS)) {
  PRODUCTS_BY_TAB[cat] = slugs.map((s) => productMap.get(s)).filter(Boolean) as typeof PRODUCTS;
}

export default function TemplateShowcase() {
  const [activeTab, setActiveTab] = useState("dashboards");
  const [activePage, setActivePage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => PRODUCTS_BY_TAB[activeTab] ?? [], [activeTab]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const scrollToPage = useCallback((page: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[page * ITEMS_PER_PAGE] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    }
    setActivePage(page);
  }, []);

  const handleTab = useCallback((slug: string) => {
    setActiveTab(slug);
    setActivePage(0);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const childWidth = (el.children[0] as HTMLElement)?.offsetWidth ?? 1;
      const gap = 24;
      const page = Math.round(scrollLeft / ((childWidth + gap) * ITEMS_PER_PAGE));
      setActivePage(Math.min(page, totalPages - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeTab, totalPages]);

  const canPrev = activePage > 0;
  const canNext = activePage < totalPages - 1;

  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="main_template-list-section">
            <div className="heading-left-wr">
              <div className="heading-left-text-wr max-width-700">
                <h2 className="heading-style-h2">Figma Templates &amp; UI kits</h2>
                <div className="heading-style-h5 mob-16">
                  Save time and human resources by reusing hundreds of pre-made templates crafted by us. Based on top notch UX taken from the World&apos;s best apps.
                </div>
              </div>
              <div className="heading-left-text-btn-wr">
                <Link className="button secondary w-inline-block" href="/all">
                  <div className="text-size-large text-weight-bold">See All</div>
                  <div className="button-icon w-embed"><ArrowIcon /></div>
                </Link>
              </div>
            </div>
            <div className="spacer-32" />
            <div className="main_template-liist-tabs-menu" style={{ display: "flex", gap: "8px" }}>
              {SLIDER_TABS.map((tab) => (
                <div
                  key={tab.slug}
                  className={`button-x-small is-text w-inline-block${activeTab === tab.slug ? " w--current" : ""}`}
                  onClick={() => handleTab(tab.slug)}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-size-small text-weight-bold">{tab.label}</div>
                </div>
              ))}
            </div>
            <div className="spacer-32" />
            <style>{`
              @keyframes sliderFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
            <div
              key={activeTab}
              ref={trackRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] animate-[sliderFadeIn_0.3s_ease-out]"
            >
              {filtered.map((product) => (
                <div
                  key={product.slug}
                  style={{ flex: "0 0 calc(33.333% - 16px)", scrollSnapAlign: "start", minWidth: "340px" }}
                >
                  <SliderTemplateCard product={product} />
                </div>
              ))}
            </div>
            <div className="relative min-h-20 mt-8 flex items-center justify-between gap-8">
              <ul className="splide__pagination static! inset-auto!">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={`dot-${activeTab}-${i}`}>
                    <button
                      className={`splide__pagination__page${i === activePage ? " is-active" : ""}`}
                      onClick={() => scrollToPage(i)}
                      type="button"
                      aria-label={`Go to page ${i + 1}`}
                    />
                  </li>
                ))}
              </ul>
              <div className="splide__arrows">
                <div
                  className="splide__arrow splide__arrow--prev"
                  onClick={() => canPrev && scrollToPage(activePage - 1)}
                  role="button"
                  tabIndex={0}
                  aria-label="Go to last slide"
                  style={{ opacity: canPrev ? 1 : 0.35 }}
                >
                  <div className="splide__arrow-img rotate w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16em" height="14em" viewBox="0 0 16 14" fill="currentColor">
                      <path clipRule="evenodd" d="M8.91699 1.00007C9.46928 0.58586 10.2528 0.697789 10.667 1.25007L14.417 6.25007C14.7503 6.69452 14.7503 7.30563 14.417 7.75007L10.667 12.7501C10.2528 13.3024 9.46928 13.4143 8.91699 13.0001C8.36471 12.5859 8.25278 11.8024 8.66699 11.2501L10.917 8.25007H2.16699C1.47664 8.25007 0.916992 7.69043 0.916992 7.00007C0.916992 6.30972 1.47664 5.75007 2.16699 5.75007H10.917L8.66699 2.75007C8.25278 2.19779 8.36471 1.41429 8.91699 1.00007Z" fill="currentColor" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div
                  className="splide__arrow splide__arrow--next"
                  onClick={() => canNext && scrollToPage(activePage + 1)}
                  role="button"
                  tabIndex={0}
                  aria-label="Next slide"
                  style={{ opacity: canNext ? 1 : 0.35 }}
                >
                  <div className="splide__arrow-img w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16em" height="14em" viewBox="0 0 16 14" fill="currentColor">
                      <path clipRule="evenodd" d="M8.91699 1.00007C9.46928 0.58586 10.2528 0.697789 10.667 1.25007L14.417 6.25007C14.7503 6.69452 14.7503 7.30563 14.417 7.75007L10.667 12.7501C10.2528 13.3024 9.46928 13.4143 8.91699 13.0001C8.36471 12.5859 8.25278 11.8024 8.66699 11.2501L10.917 8.25007H2.16699C1.47664 8.25007 0.916992 7.69043 0.916992 7.00007C0.916992 6.30972 1.47664 5.75007 2.16699 5.75007H10.917L8.66699 2.75007C8.25278 2.19779 8.36471 1.41429 8.91699 1.00007Z" fill="currentColor" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
