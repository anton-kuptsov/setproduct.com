import type { BlogHeading } from "../../types/blog";
import { useSubscribe } from "../../hooks/useSubscribe";
import BlogTableOfContents from "./BlogTableOfContents";
import BlogShareLinks from "./BlogShareLinks";

type BlogSidebarProps = {
  headings: BlogHeading[];
  postUrl: string;
  postTitle: string;
};

export default function BlogSidebar({ headings, postUrl, postTitle }: BlogSidebarProps) {
  const { isSubscribed, isSubmitting, handleSubscribe } = useSubscribe();

  return (
    <div id="w-node-sidebar" className="blogpost_content-column1">
      <BlogTableOfContents headings={headings} />
      <div className="hide-on-mobile">
        <div className="blogpost_content-line-divider" />
        <div className="blogpost_content-cta-wr">
          <p className="text-size-medium text-weight-bold">Subscribe to new posts</p>
          {!isSubscribed ? (
            <div className="form-block w-form">
              <form className="form-cta is-vertical" onSubmit={handleSubscribe}>
                <input name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                <input
                  className="text-input w-input"
                  disabled={isSubmitting}
                  maxLength={256}
                  name="Email"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <div className="button-form-wr">
                  <button
                    className="button w-inline-block"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1 }}
                    type="submit"
                  >
                    <div className="text-size-large text-weight-bold">
                      {isSubmitting ? "..." : "Subscribe"}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <p className="text-size-small">Thank you! You&apos;re subscribed.</p>
          )}
        </div>
        <div className="blogpost_content-line-divider" />
        <BlogShareLinks url={postUrl} title={postTitle} />
      </div>
    </div>
  );
}
