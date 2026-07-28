"use client";
import { useEffect, useState, type CSSProperties } from "react";

type BlogFloatingShareProps = {
  url: string;
  title: string;
};

const VISIBILITY_SCROLL_OFFSET = 280;

// "Soft cascade": icons reveal after the scroll-up arrow, bottom-up.
const CASCADE_BASE_DELAY = 150; // ms — lag after the arrow appears
const CASCADE_STEP = 70; // ms — gap between consecutive icons
const CASCADE_DURATION = 260; // ms — per-icon reveal duration
const CASCADE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function BlogFloatingShare({ url, title }: BlogFloatingShareProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > VISIBILITY_SCROLL_OFFSET);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      void _;
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  // DOM order is top-to-bottom; cascade runs bottom-up (last icon first).
  const TOTAL_ICONS = 4;
  const getIconStyle = (domIndex: number): CSSProperties => {
    const stepFromBottom = TOTAL_ICONS - 1 - domIndex;
    const enterDelay = CASCADE_BASE_DELAY + stepFromBottom * CASCADE_STEP;
    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(14px)",
      transition: `opacity ${CASCADE_DURATION}ms ${CASCADE_EASING}, transform ${CASCADE_DURATION}ms ${CASCADE_EASING}`,
      transitionDelay: isVisible ? `${enterDelay}ms` : "0ms",
    };
  };

  return (
    <div
      className={`blog-floating-share hide-on-mobile${isVisible ? " is-visible" : ""}`}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <a
        href="#"
        className="blogpost_soc-link group relative w-inline-block"
        onClick={handleCopy}
        aria-label="Copy link"
        style={getIconStyle(0)}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-[calc(100%+12px)] top-1/2 z-50 w-max -translate-y-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-2 font-sans text-[13px] font-medium leading-snug text-neutral-900 shadow-[0_1px_2px_rgba(15,15,15,0.06),0_8px_24px_rgba(15,15,15,0.12)] transition-opacity duration-150 ${
            copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span
            aria-hidden="true"
            className="absolute right-[-6px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-[3px] bg-white shadow-[2px_-2px_3px_rgba(15,15,15,0.04)]"
          />
          {copied ? "✔ Copied!" : "Copy link"}
        </span>
        <img src="/images/Share-Button1.svg" loading="lazy" alt="Copy icon" className="image-cover" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blogpost_soc-link w-inline-block"
        aria-label="Share on LinkedIn"
        style={getIconStyle(1)}
      >
        <img src="/images/008-linkedin-1.svg" loading="lazy" alt="Linkedin icon" className="image-cover" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blogpost_soc-link w-inline-block"
        aria-label="Share on Facebook"
        style={getIconStyle(2)}
      >
        <img src="/images/Share-Button2.svg" loading="lazy" alt="Facebook icon" className="image-cover" />
      </a>
      <a
        href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="blogpost_soc-link w-inline-block"
        aria-label="Share on X"
        style={getIconStyle(3)}
      >
        <img src="/images/x-logo.svg" loading="lazy" alt="X icon" className="image-cover" />
      </a>
    </div>
  );
}
