import type { GetStaticPaths, GetStaticProps } from "next";
import TemplateDetailPage from "../../components/pages/TemplateDetailPage";
import ChartsTemplatePage from "../../components/pages/templates/ChartsTemplatePage";
import GenericTemplatePage from "../../components/pages/templates/GenericTemplatePage";
import { TEMPLATE_PRODUCTS } from "../../data/templates-listing";
import { getTemplateContent } from "../../data/template-content";
import type { TemplateItem } from "../../types/data";

type PageProps = {
  item: TemplateItem;
  content: Record<string, unknown> | null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: TEMPLATE_PRODUCTS.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const item = TEMPLATE_PRODUCTS.find((p) => p.slug === slug);

  if (!item) return { notFound: true };

  // Charts uses dedicated component with its own content import
  if (slug === "charts") {
    return { props: { item, content: null } };
  }

  // Load content for other templates
  const content = await getTemplateContent(slug);

  return { props: { item, content: content || null } };
};

export default function TemplateDetailRoute({ item, content }: PageProps) {
  if (item.slug === "charts") {
    return <ChartsTemplatePage item={item} />;
  }

  if (content) {
    return <GenericTemplatePage item={item} content={content as Parameters<typeof GenericTemplatePage>[0]["content"]} />;
  }

  return <TemplateDetailPage item={item} />;
}
