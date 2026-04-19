import Link from "next/link";
import type { BlogPostMeta } from "../../types/blog";

type BlogRelatedPostsProps = {
  posts: BlogPostMeta[];
};

const CATEGORY_LABELS: Record<string, string> = {
  tutorials: "UI Design",
  technology: "Technology",
  "startups-saas": "Startups & SaaS",
  "growth-hacking": "Growth Hacking",
  inspiration: "Inspiration",
  resources: "Resources",
  research: "Research",
  career: "Career",
  "case-studies": "Case Studies",
  "design-code": "Design & Code",
  "design-trends": "Design Trends",
  optimisation: "Optimisation",
  presentation: "Presentation",
  typography: "Typography",
};

function categoryLabel(cat?: string): string {
  if (!cat) return "Blog";
  return CATEGORY_LABELS[cat] ?? cat;
}

export default function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="heading-left-wr">
            <div className="heading-left-text-wr max-width-700">
              <h2 className="heading-style-h2">Related posts</h2>
            </div>
            <div className="heading-left-text-btn-wr">
              <Link className="button secondary w-inline-block" href="/blog">
                <div className="text-size-large text-weight-bold">Read All</div>
                <div className="button-icon w-embed">
                  <svg fill="currentColor" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg">
                    <path
                      clipRule="evenodd"
                      d="M8.91699 1.00007C9.46928 0.58586 10.2528 0.697789 10.667 1.25007L14.417 6.25007C14.7503 6.69452 14.7503 7.30563 14.417 7.75007L10.667 12.7501C10.2528 13.3024 9.46928 13.4143 8.91699 13.0001C8.36471 12.5859 8.25278 11.8024 8.66699 11.2501L10.917 8.25007H2.16699C1.47664 8.25007 0.916992 7.69043 0.916992 7.00007C0.916992 6.30972 1.47664 5.75007 2.16699 5.75007H10.917L8.66699 2.75007C8.25278 2.19779 8.36471 1.41429 8.91699 1.00007Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
          <div className="blogpost_list1-wr">
            <div className="main_blog-liist1-wr">
              <div className="main_blog-liist1" role="list">
                {posts.map((post) => {
                  const href = `/blog/${post.frontmatter.slug}`;
                  return (
                    <div
                      key={post.frontmatter.slug}
                      className="main_blog-liist1-item"
                      role="listitem"
                    >
                      <div className="main_blog-liist1-item-wr">
                        <Link className="main_blog-liist1-item-img-wr w-inline-block" href={href}>
                          {post.frontmatter.coverImage && (
                            <img
                              alt={post.frontmatter.coverImageAlt ?? post.frontmatter.title}
                              className="image-cover"
                              loading="lazy"
                              sizes="100vw"
                              src={post.frontmatter.coverImage}
                            />
                          )}
                        </Link>
                        <div className="main_blog-liist1-item-info">
                          <div className="main_blog-liist1-item-info-row">
                            <div className="category-tag">
                              <p className="text-size-tiny text-weight-semibold">
                                {categoryLabel(post.frontmatter.category)}
                              </p>
                            </div>
                            <div className="main_blog-liist1-item-info-row-txt-wr">
                              <p className="text-size-small is-mob-12">
                                {post.readingTimeText}
                              </p>
                            </div>
                          </div>
                          <Link className="w-inline-block" href={href}>
                            <p className="heading-style-h5 text-color-dark-primary text-style-3lines">
                              {post.frontmatter.title}
                            </p>
                          </Link>
                          <p className="text-size-small text-style-2lines blog-list1-txt-bigger">
                            {post.frontmatter.cardDescription ?? post.frontmatter.description}
                          </p>
                          <div className="main_blog-liist-item-btn-wr">
                            <Link className="button-x-small is-text w-inline-block" href={href}>
                              <div className="text-size-regular text-weight-bold">Read more</div>
                              <div className="button-icon is-small text-color-primary w-embed">
                                <svg fill="currentColor" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    clipRule="evenodd"
                                    d="M8.91699 1.00007C9.46928 0.58586 10.2528 0.697789 10.667 1.25007L14.417 6.25007C14.7503 6.69452 14.7503 7.30563 14.417 7.75007L10.667 12.7501C10.2528 13.3024 9.46928 13.4143 8.91699 13.0001C8.36471 12.5859 8.25278 11.8024 8.66699 11.2501L10.917 8.25007H2.16699C1.47664 8.25007 0.916992 7.69043 0.916992 7.00007C0.916992 6.30972 1.47664 5.75007 2.16699 5.75007H10.917L8.66699 2.75007C8.25278 2.19779 8.36471 1.41429 8.91699 1.00007Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
