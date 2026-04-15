import type { GetServerSideProps } from "next";
import LegacyPage from "../../components/LegacyPage";
import { getCollectionPageData } from "../../lib/legacy-collections";
import type { LegacyPageData } from "../../types/legacy";

type PageProps = {
  pageData: LegacyPageData;
};

type SlugParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<PageProps, SlugParams> = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  try {
    return {
      props: {
        pageData: getCollectionPageData("templates", params.slug),
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function TemplateDetailPage({ pageData }: PageProps) {
  return <LegacyPage {...pageData} />;
}
