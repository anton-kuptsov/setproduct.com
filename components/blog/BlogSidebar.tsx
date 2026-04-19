import type { BlogHeading } from "../../types/blog";
import BlogTableOfContents from "./BlogTableOfContents";
import BlogShareLinks from "./BlogShareLinks";

type BlogSidebarProps = {
  headings: BlogHeading[];
  postUrl: string;
  postTitle: string;
};

export default function BlogSidebar({ headings, postUrl, postTitle }: BlogSidebarProps) {
  return (
    <div id="w-node-sidebar" className="blogpost_content-column1">
      <BlogTableOfContents headings={headings} />
      <div className="hide-on-mobile">
        <div className="blogpost_content-line-divider" />
        <div className="blogpost_content-cta-wr">
          <p className="text-size-medium text-weight-bold">Subscribe to new posts</p>
          <div className="form-block w-form">
            <form className="form-cta is-vertical" method="get">
              <input
                className="text-input w-input"
                maxLength={256}
                name="Email"
                placeholder="Enter your email"
                type="email"
                required
              />
              <div className="button-form-wr">
                <a href="#" className="button w-inline-block">
                  <div className="text-size-large text-weight-bold">Subscribe</div>
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="blogpost_content-line-divider" />
        <BlogShareLinks url={postUrl} title={postTitle} />
      </div>
    </div>
  );
}
