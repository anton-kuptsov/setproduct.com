"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SliderPagination from "./SliderPagination";

type CarouselItem = {
  image: string;
  alt?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  previewLink?: string;
  items: CarouselItem[];
};

export default function TemplateCarousel({ title, subtitle, previewLink, items }: Props) {
  const [activePage, setActivePage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalPages = items.length;

  const scrollToPage = useCallback((page: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[page] as HTMLElement | undefined;
    if (child) {
      isProgrammaticScrollRef.current = true;
      track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 800);
    }
    setActivePage(page);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
      scrollEndTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 120);

      if (isProgrammaticScrollRef.current) return;

      const scrollLeft = track.scrollLeft;
      const childWidth = (track.children[0] as HTMLElement)?.offsetWidth ?? 1;
      const gap = 24;
      const page = Math.round(scrollLeft / (childWidth + gap));
      setActivePage(Math.min(page, totalPages - 1));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [totalPages]);

  return (
    <div className="section is-overflow-hidden">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          {(title || subtitle) && (
            <div className="heading-left-text-wr max-width-900">
              {title && (
                <h2 className="heading-style-h2">
                  {previewLink ? (
                    <>
                      <a
                        className="span-link"
                        href={previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>{" "}
                      {title}
                    </>
                  ) : (
                    title
                  )}
                </h2>
              )}
              {subtitle && <div className="heading-style-h5">{subtitle}</div>}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-64" />}

        </div>
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pl-[max(24px,calc((100vw-1200px)/2))]"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-3xl border border-black/10 overflow-hidden"
              style={{
                width: "40vw",
                minWidth: "350px",
                maxHeight: "560em",
                scrollSnapAlign: "start",
              }}
            >
              <img
                alt={item.alt || ""}
                loading="lazy"
                src={item.image}
                className="w-full h-full object-contain block"
              />
            </div>
          ))}
        </div>
        <div className="container">

          <SliderPagination
            activePage={activePage}
            totalPages={totalPages}
            onGoTo={scrollToPage}
            keyPrefix="carousel"
          />
        </div>
      </div>
    </div>
  );
}
