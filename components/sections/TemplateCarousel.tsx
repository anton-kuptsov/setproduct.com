"use client";

import { useState, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = items.length;

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const containerWidth = container.offsetWidth;
    const slideWidth = containerWidth * 0.7;
    track.style.transform = `translateX(-${activePage * slideWidth}px)`;
  }, [activePage]);

  return (
    <div className="section is-overflow-hidden">
      <div className="section-padding top-80 bottom-80">
        <div className="container" ref={containerRef}>
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

          <div className="splide image-gallery" >
            <div className="splide__track no-pagination-on-mob">
              <div
                ref={trackRef}
                className="splide__list is-image-gallery"
                style={{
                  display: "flex",
                  transition: "transform 0.4s ease",
                }}
              >
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="splide__slide is-image-gallery"
                  >
                    <img
                      alt={item.alt || ""}
                      className="image-contain"
                      loading="lazy"
                      src={item.image}
                    />
                  </div>
                ))}
              </div>
            </div>
            <SliderPagination
              activePage={activePage}
              totalPages={totalPages}
              onGoTo={setActivePage}
              keyPrefix="carousel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
