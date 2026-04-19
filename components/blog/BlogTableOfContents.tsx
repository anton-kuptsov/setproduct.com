import type { BlogHeading } from "../../types/blog";

type BlogTableOfContentsProps = {
  headings: BlogHeading[];
};

export default function BlogTableOfContents({ headings }: BlogTableOfContentsProps) {
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
            <a href={`#${h.id}`} className="blogpost_navigation-link w-inline-block">
              <p style={h.level === 3 ? { paddingLeft: "12px" } : undefined}>
                {h.text}
              </p>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
