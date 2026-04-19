import type { GetStaticPaths, GetStaticProps } from "next";
import FreebieDetailPage from "../../components/pages/FreebieDetailPage";
import { FREEBIE_PRODUCTS } from "../../data/freebies-listing";
import type { FreebieItem } from "../../types/data";

type PageProps = {
  item: FreebieItem;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: FREEBIE_PRODUCTS.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const item = FREEBIE_PRODUCTS.find((p) => p.slug === params?.slug);

  if (!item) return { notFound: true };

  return { props: { item } };
};

export default function FreebieDetailRoute({ item }: PageProps) {
  return <FreebieDetailPage item={item} />;
}
