"use client";
import { useEffect, useState } from "react";
import type { BlogHeading } from "../../types/blog";

type BlogTableOfContentsProps = {
  headings: BlogHeading[];
};

export default function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      <div className="hide-on-mobile">
        <p className="text-size-medium text-weight-bold">Navigation</p>
      </div>
      <div className="spacer-16 hide-on-mobile" />
      <div className="blogpost_navigation-wr">
        {headings.map((h) => (
          <div key={h.id} className="blogpost_navigation-link-wr">
            <a
              href={`#${h.id}`}
              className={`blogpost_navigation-link w-inline-block${activeId === h.id ? " fs-cmsfilter_active" : ""}`}
              style={h.level === 3 ? { paddingLeft: "12px" } : undefined}
            >
              <p>{h.text}</p>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
