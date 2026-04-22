"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

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
              {subtitle && <div className="heading-style-h5">{subtitle}</div>}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-64" />}

          <div className="template_img-gallery">
            {items.map((item, index) => (
              <div
                key={index}
                className="template_img-gallery-item"
                onClick={() => openLightbox(index)}
                style={{ cursor: "zoom-in" }}
              >
                <div className="lightbox-link-with-text w-inline-block">
                  <img alt={item.title || ""} loading="lazy" src={item.image} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Thumbnails]}
        thumbnails={{
          position: "bottom",
          width: 100,
          height: 60,
          gap: 8,
          showToggle: false,
        }}
      />
    </div>
  );
}
