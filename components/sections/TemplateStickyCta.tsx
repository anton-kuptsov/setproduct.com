"use client";

import { useEffect, useState } from "react";
import { event } from "../../lib/gtag";
import { getGumroadLinkProps } from "../../lib/gumroad";
import type { TemplateItem } from "../../types/data";

type Props = {
  item: TemplateItem;
  /**
   * Real purchase price shown on the page (first pricing card).
   * Falls back to the listing price when not provided.
   */
  price?: string;
  /**
   * Real purchase link from the page (first pricing card).
   * Falls back to the listing buyHref when not provided.
   */
  buyHref?: string;
};

export default function TemplateStickyCta({ item, price, buyHref }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  // True once the on-page pricing block scrolls into view: the user reached the
  // real purchase cards, so the floating CTA is no longer needed and gets
  // "knocked out" upwards (see .template-sticky-cta.is-dismissed in globals.css).
  const [isDismissed, setIsDismissed] = useState(false);

  // Prefer the actual on-page pricing-card values so the floating CTA always
  // matches the real product price; fall back to the listing data otherwise.
  const displayPrice = price ?? item.price;
  const purchaseHref = buyHref ?? item.buyHref;

  useEffect(() => {
    const handleScroll = () => {
      // Appear after the user scrolls past ~80% of the first (hero) screen.
      const threshold = window.innerHeight * 0.8;
      setIsVisible(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const pricing = document.getElementById("template-pricing");
    if (!pricing) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Dismiss as soon as the pricing block enters the viewport from below;
        // restore the CTA when the user scrolls back up above the pricing block.
        setIsDismissed(entry.isIntersecting);
      },
      // rootMargin bottom -10% so the CTA leaves slightly before the cards are
      // fully centered — it visually feels "pushed out" by the arriving block.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(pricing);
    return () => observer.disconnect();
  }, []);

  // The CTA is shown only while scrolled past the hero AND the pricing block is
  // not yet reached. Once dismissed it plays the knock-out animation.
  const isShown = isVisible && !isDismissed;

  const handleClick = () => {
    event("click_get_started", {
      product: item.slug,
      location: "sticky_cta",
    });
  };

  return (
    <div
      className={[
        "template-sticky-cta",
        isShown ? "is-visible" : "",
        isDismissed ? "is-dismissed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      inert={!isShown}
    >
      <a
        href={purchaseHref}
        onClick={handleClick}
        {...getGumroadLinkProps(
          purchaseHref,
          "button w-inline-block template-sticky-cta-btn"
        )}
      >
        <div className="text-size-large text-weight-bold">Get Started</div>
        {displayPrice && (
          <div className="text-size-large text-weight-bold template-sticky-cta-price">
            {displayPrice}
          </div>
        )}
      </a>
    </div>
  );
}
