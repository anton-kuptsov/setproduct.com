"use client";

import { type MouseEvent, useEffect, useState } from "react";

const VISIBILITY_SCROLL_OFFSET = 280;

export default function ScrollUpButton() {
  const [isVisible, setIsVisible] = useState(false);

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

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="scroll-up-wr">
      <div className="scroll-up-top" id="top" />
      <div className="scroll-up-trigger" />
      <div
        className="scroll-up-element"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 220ms ease, transform 220ms ease",
        }}
      >
        <a className="button-small is-scroll-up w-inline-block" href="#top" onClick={handleClick}>
          <div className="button-icon is-scroll-up w-embed">
            <svg fill="currentColor" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M8.91699 1.00007C9.46928 0.58586 10.2528 0.697789 10.667 1.25007L14.417 6.25007C14.7503 6.69452 14.7503 7.30563 14.417 7.75007L10.667 12.7501C10.2528 13.3024 9.46928 13.4143 8.91699 13.0001C8.36471 12.5859 8.25278 11.8024 8.66699 11.2501L10.917 8.25007H2.16699C1.47664 8.25007 0.916992 7.69043 0.916992 7.00007C0.916992 6.30972 1.47664 5.75007 2.16699 5.75007H10.917L8.66699 2.75007C8.25278 2.19779 8.36471 1.41429 8.91699 1.00007Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}
