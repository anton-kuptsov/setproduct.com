import type { MDXRemoteProps } from "next-mdx-remote";
import MDXImage from "./MDXImage";
import CodeBlock from "./CodeBlock";

export const blogMdxComponents: MDXRemoteProps["components"] = {
  pre: (props) => <CodeBlock {...props} />,
  img: (props) => {
    const title = typeof props.title === "string" ? props.title : "";
    const float =
      title === "float" || title === "float-right"
        ? "right"
        : title === "float-left"
          ? "left"
          : undefined;
    return (
      <MDXImage
        src={props.src}
        alt={props.alt ?? ""}
        float={float}
        width={
          typeof props.width === "string"
            ? parseInt(props.width, 10)
            : props.width
        }
        height={
          typeof props.height === "string"
            ? parseInt(props.height, 10)
            : props.height
        }
      />
    );
  },
  a: ({ href, children, ...props }) => {
    const isGumroad = href?.includes("gumroad.com");
    if (isGumroad) {
      // Gumroad overlay: gumroad.js intercepts clicks on plain gumroad.com
      // links (no target="_blank") and opens the product in an on-site popup.
      // Do NOT add the `gumroad-button` class — it replaces the link content
      // with Gumroad's own huge button widget and breaks the layout.
      return <a href={href} {...props}>{children}</a>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  ul: (props) => <ul className="mb-2" {...props} />,
  li: (props) => (
    <li
      className="relative pl-[0.6em] before:absolute before:left-0 before:content-['•']"
      {...props}
    />
  ),
};
