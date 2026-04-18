import type { MDXRemoteProps } from "next-mdx-remote";
import MDXImage from "./MDXImage";

export const blogMdxComponents: MDXRemoteProps["components"] = {
  img: (props) => (
    <MDXImage
      src={props.src}
      alt={props.alt ?? ""}
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
  ),
};
