"use client";

import { useState } from "react";
import AppLightbox, { preloadLightbox } from "../ui/AppLightbox";

type GalleryItem = {
  image: string;
  title?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  previewLink?: string;
  subtitleLinkText?: string;
  subtitleLinkHref?: string;
  items: GalleryItem[];
};

export default function TemplateGallery({
  title,
  subtitle,
  previewLink,
  subtitleLinkText,
  subtitleLinkHref,
  items,
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const slides = items.map((item) => ({ src: item.image, alt: item.title || "" }));

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
              {subtitle && (
                <div className="heading-style-h5">
                  {subtitle}
                  {subtitleLinkText && subtitleLinkHref && (
                    <>
                      {" "}
                      <a
                        className="span-link"
                        href={subtitleLinkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {subtitleLinkText}
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-64" />}

          <div className="template_img-gallery">
            {items.map((item, index) => (
              <div
                key={index}
                className="template_img-gallery-item"
                onClick={() => openLightbox(index)}
                onMouseEnter={preloadLightbox}
                onTouchStart={preloadLightbox}
                style={{ cursor: "zoom-in" }}
              >
                <div className="lightbox-link-with-text w-inline-block">
                  <img alt={item.title || ""} loading="lazy" src={item.image} />
                  {item.title && (
                    <div className="lightbox-text-bg">
                      <p className="heading-style-h4">{item.title}</p>
                      <div className="lightbox-color-bg" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AppLightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        thumbnails
      />
    </div>
  );
}
