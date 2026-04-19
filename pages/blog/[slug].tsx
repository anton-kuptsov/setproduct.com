import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import BlogPostLayout from "../../components/blog/BlogPostLayout";
import { getAllBlogSlugs, getBlogPost, getRelatedPosts } from "../../lib/blog/mdx";
import { SITE_URL } from "../../lib/blog/site-config";
import type { BlogPost, BlogPostMeta } from "../../types/blog";

type PageProps = {
  post: BlogPost;
  relatedPosts: BlogPostMeta[];
  postUrl: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllBlogSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== "string") return { notFound: true };

  const post = await getBlogPost(slug);
  if (!post) return { notFound: true };

  const relatedPosts = getRelatedPosts(slug, post.frontmatter.category, 3);
  const postUrl = `${SITE_URL}/blog/${slug}`;

  return { props: { post, relatedPosts, postUrl } };
};

export default function BlogArticlePage({
  post,
  relatedPosts,
  postUrl,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <BlogPostLayout post={post} relatedPosts={relatedPosts} postUrl={postUrl} />;
}
