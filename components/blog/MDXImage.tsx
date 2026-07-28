import { useState } from "react";
import AppLightbox, { preloadLightbox } from "../ui/AppLightbox";

type MDXImageProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  /** "right" | "left" → image floats and text wraps around it. */
  float?: "right" | "left";
};

export default function MDXImage({
  src,
  alt = "",
  width,
  height,
  caption,
  float,
}: MDXImageProps) {
  const [open, setOpen] = useState(false);

  if (!src) return null;

  const floatClass =
    float === "right"
      ? "blog-img-float blog-img-float--right"
      : float === "left"
        ? "blog-img-float blog-img-float--left"
        : "";

  const imageEl = (
    <img
      src={src}
      alt={alt}
      width={width || 1600}
      height={height || 900}
      className="rounded-3xl"
      style={{
        width: "100%",
        height: "auto",
        maxWidth: "100%",
        cursor: "zoom-in",
      }}
      loading="lazy"
      onClick={() => setOpen(true)}
      onMouseEnter={preloadLightbox}
      onTouchStart={preloadLightbox}
    />
  );

  const lightbox = (
    <AppLightbox open={open} close={() => setOpen(false)} slides={[{ src, alt }]} />
  );

  if (caption) {
    return (
      <figure className={floatClass || "my-6"}>
        {imageEl}
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
        {lightbox}
      </figure>
    );
  }

  if (floatClass) {
    return (
      <span className={floatClass}>
        {imageEl}
        {lightbox}
      </span>
    );
  }

  return (
    <>
      {imageEl}
      {lightbox}
    </>
  );
}
