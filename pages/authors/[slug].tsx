import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import AuthorPage from "../../components/pages/AuthorPage";
import { AUTHORS, getAuthor } from "../../lib/blog/authors";
import { getBlogPostPreviews } from "../../lib/blog/get-blog-post-previews";
import type { Author } from "../../types/blog";
import type { BlogPostPreview } from "../../types/data";

type PageProps = {
  author: Author;
  authorPosts: BlogPostPreview[];
  blogPosts: BlogPostPreview[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(AUTHORS).map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const author = getAuthor(slug);

  return {
    props: {
      author,
      authorPosts: getBlogPostPreviews({ authorSlug: author.slug }),
      blogPosts: getBlogPostPreviews({ maxPerCategory: 6 }),
    },
  };
};

export default function AuthorRoute({
  author,
  authorPosts,
  blogPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <AuthorPage author={author} authorPosts={authorPosts} blogPosts={blogPosts} />;
}
