import dynamic from "next/dynamic";
import type { AppLightboxProps } from "./AppLightboxInner";

/**
 * Lazy-loaded unified lightbox.
 *
 * The heavy yet-another-react-lightbox code (and its CSS) is split into a
 * separate chunk and only downloaded the first time a lightbox is opened.
 * `ssr: false` is safe: a closed lightbox renders nothing anyway.
 */
const LazyLightbox = dynamic(() => import("./AppLightboxInner"), {
  ssr: false,
});

/** Warm up the lightbox chunk ahead of the first click (e.g. on hover). */
export function preloadLightbox() {
  void import("./AppLightboxInner");
}

export type { AppLightboxProps };

export default function AppLightbox(props: AppLightboxProps) {
  // Never mount (and never fetch the chunk) until actually opened.
  if (!props.open) return null;
  return <LazyLightbox {...props} />;
}
