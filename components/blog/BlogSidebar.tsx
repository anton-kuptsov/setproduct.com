import { useRef, useEffect, useState, type RefObject } from "react";
import type { BlogHeading } from "../../types/blog";
import { useSubscribe } from "../../hooks/useSubscribe";
import { useStickyInContainer } from "../../hooks/useStickyInContainer";
import BlogTableOfContents from "./BlogTableOfContents";
import BlogShareLinks from "./BlogShareLinks";

type BlogSidebarProps = {
  headings: BlogHeading[];
  postUrl: string;
  postTitle: string;
  containerRef: RefObject<HTMLDivElement | null>;
};

export default function BlogSidebar({ headings, postUrl, postTitle, containerRef }: BlogSidebarProps) {
  const { isSubscribed, isSubmitting, handleSubscribe } = useSubscribe();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 991);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { style, stickyState } = useStickyInContainer(sidebarRef, containerRef, {
    topOffset: 80,
    enabled: !isMobile,
  });

  return (
    <div id="w-node-sidebar" className="blogpost_content-column1">
      <div
        ref={sidebarRef}
        style={stickyState !== "static" ? style : undefined}
      >
        <BlogTableOfContents headings={headings} />
        <div className="hide-on-mobile">
          <div className="blogpost_content-line-divider" />
          <div className="blogpost_content-cta-wr">
            <p className="text-size-medium text-weight-bold">Subscribe to new posts</p>
            {!isSubscribed ? (
              <div className="form-block w-form">
                <form className="form-cta is-vertical" onSubmit={handleSubscribe}>
                  <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
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
                      className="button w-inline-block disabled:opacity-70 w-full"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? (
                        <svg
                          width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                          className="animate-spin block"
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                      ) : (
                        <div className="text-size-large text-weight-bold ">Subscribe</div>
                      )}
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
    </div>
  );
}
