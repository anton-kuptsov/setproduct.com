import type { MDXRemoteProps } from "next-mdx-remote";
import MDXImage from "./MDXImage";

export const blogMdxComponents: MDXRemoteProps["components"] = {
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
