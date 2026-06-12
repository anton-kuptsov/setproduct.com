import { useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
  // Remember the reading position so closing the lightbox returns the user
  // exactly where they clicked. The lightbox locks body scroll while open
  // (react-remove-scroll), and without this the page jumps to the top on close.
  const scrollYRef = useRef(0);

  const openLightbox = () => {
    scrollYRef.current = window.scrollY;
    setOpen(true);
  };

  const closeLightbox = () => {
    setOpen(false);
    const targetY = scrollYRef.current;
    // Restore after the library releases its scroll lock (next frame).
    // behavior: "instant" overrides the global `html { scroll-behavior: smooth }`
    // so the jump back is immediate instead of a slow animated scroll.
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
    });
  };

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
      className="rounded-md"
      style={{
        width: "100%",
        height: "auto",
        maxWidth: "100%",
        cursor: "zoom-in",
      }}
      loading="lazy"
      onClick={openLightbox}
    />
  );

  const lightbox = (
    <Lightbox
      open={open}
      close={closeLightbox}
      slides={[{ src }]}
      carousel={{ finite: true }}
      render={{ buttonPrev: () => null, buttonNext: () => null }}
    />
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
