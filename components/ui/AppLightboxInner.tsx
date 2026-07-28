import { useLayoutEffect } from "react";
import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export type AppLightboxProps = {
  open: boolean;
  close: () => void;
  slides: SlideImage[];
  index?: number;
  /** Show the thumbnails strip at the bottom (galleries with 2+ slides). */
  thumbnails?: boolean;
};

/**
 * Single source of truth for lightbox appearance and behavior across the site:
 * - light (white) backdrop so light-toned screenshots read correctly
 * - soft fade in/out (300ms)
 * - dark buttons without the default drop shadow
 * - click on the backdrop (outside the image) closes the lightbox
 * - prev/next arrows are hidden for a single slide
 *
 * Do not import this file directly — use AppLightbox (lazy wrapper),
 * so the yet-another-react-lightbox bundle stays out of the initial JS.
 */
export default function AppLightboxInner({
  open,
  close,
  slides,
  index = 0,
  thumbnails = false,
}: AppLightboxProps) {
  const single = slides.length <= 1;

  // Scroll lock without any jump.
  //
  // YARL's built-in lock puts `overflow: hidden` on the scrolling element,
  // which per CSS spec clamps scrollTop to 0 — the page instantly jumps to
  // the top the moment the lightbox opens. We disable that (noScroll below)
  // and freeze the page ourselves with the classic `position: fixed` body
  // lock: the page visually stays exactly where it is, and on close we
  // restore the offset synchronously (useLayoutEffect cleanup runs before
  // the browser paints), so neither opening nor closing moves anything.
  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
    };
  }, []);

  return (
    <Lightbox
      open={open}
      close={close}
      slides={slides}
      index={index}
      plugins={thumbnails && !single ? [Thumbnails] : []}
      carousel={{ finite: true }}
      animation={{ fade: 300, swipe: 250 }}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      noScroll={{ disabled: true }}
      thumbnails={{
        position: "bottom",
        width: 100,
        height: 60,
        gap: 8,
        border: 0,
        showToggle: false,
      }}
      styles={{
        root: {
          // Solid white everywhere: no page content may show through.
          "--yarl__color_backdrop": "#fff",
          "--yarl__color_button": "#19181b",
          "--yarl__color_button_active": "#000",
          "--yarl__color_button_disabled": "rgba(25, 24, 27, 0.35)",
          // Kill the default drop shadow under the close/nav icons.
          "--yarl__button_filter": "none",
          // Thumbnails strip: same solid white as the main backdrop.
          "--yarl__thumbnails_container_background_color": "#fff",
          "--yarl__thumbnails_thumbnail_background": "#fff",
          "--yarl__thumbnails_thumbnail_border_color": "rgba(25, 24, 27, 0.12)",
          "--yarl__thumbnails_thumbnail_active_border_color": "#7c4dff",
        },
        thumbnail: { backgroundColor: "#fff" },
        thumbnailsContainer: { backgroundColor: "#fff" },
      }}
      render={single ? { buttonPrev: () => null, buttonNext: () => null } : undefined}
    />
  );
}
