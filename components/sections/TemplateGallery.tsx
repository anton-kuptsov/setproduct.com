"use client";

import { useState, useRef, useEffect } from "react";

type GalleryItem = {
  image: string;
  title?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  previewLink?: string;
  items: GalleryItem[];
};

export default function TemplateGallery({ title, subtitle, previewLink, items }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = () => setLightboxIndex((prev) => (prev + 1) % items.length);
  const goPrev = () => setLightboxIndex((prev) => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    if (lightboxOpen && thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.querySelector(`[data-index="${lightboxIndex}"]`);
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [lightboxIndex, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

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

          <div className="template_img-gallery">
            {items.map((item, index) => (
              <div
                key={index}
                className="template_img-gallery-item gallery-hover-item"
                onClick={() => openLightbox(index)}
                style={{ cursor: "pointer" }}
              >
                <div className="lightbox-link-with-text w-inline-block">
                  <img alt={item.title || ""} loading="lazy" src={item.image} />
                  {item.title && (
                    <div className="lightbox-text-bg gallery-overlay">
                      <p className="heading-style-h4">{item.title}</p>
                      <div className="lightbox-color-bg" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <style>{`
            .gallery-hover-item .gallery-overlay {
              opacity: 0;
              transition: opacity 0.3s ease;
              pointer-events: none;
            }
            .gallery-hover-item:hover .gallery-overlay {
              opacity: 1;
            }
          `}</style>
        </div>
      </div>

      {/* Lightbox with thumbnail gallery */}
      {lightboxOpen && (
        <div
          className="w-lightbox-backdrop"
          onClick={closeLightbox}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Main image area */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              style={{
                position: "absolute",
                left: 20,
                background: "none",
                border: "none",
                color: "white",
                fontSize: 48,
                cursor: "pointer",
                padding: "20px",
                opacity: 0.8,
              }}
              type="button"
            >
              ‹
            </button>
            <img
              alt={items[lightboxIndex]?.title || ""}
              src={items[lightboxIndex]?.image}
              style={{ maxWidth: "80vw", maxHeight: "70vh", objectFit: "contain" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              style={{
                position: "absolute",
                right: 20,
                background: "none",
                border: "none",
                color: "white",
                fontSize: 48,
                cursor: "pointer",
                padding: "20px",
                opacity: 0.8,
              }}
              type="button"
            >
              ›
            </button>
            <button
              onClick={closeLightbox}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "none",
                border: "none",
                color: "white",
                fontSize: 32,
                cursor: "pointer",
                padding: "10px",
              }}
              type="button"
            >
              ×
            </button>
          </div>

          {/* Thumbnail strip */}
          <div
            ref={thumbnailsRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              gap: "8px",
              padding: "16px",
              overflowX: "auto",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                data-index={index}
                onClick={() => setLightboxIndex(index)}
                type="button"
                style={{
                  flexShrink: 0,
                  width: "80px",
                  height: "50px",
                  padding: 0,
                  border: index === lightboxIndex ? "2px solid white" : "2px solid transparent",
                  background: "none",
                  cursor: "pointer",
                  opacity: index === lightboxIndex ? 1 : 0.6,
                  transition: "opacity 0.2s, border-color 0.2s",
                }}
              >
                <img
                  alt={item.title || ""}
                  src={item.image}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
