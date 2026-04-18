import type { GetServerSideProps } from "next";
import LegacyPage from "../components/LegacyPage";
import type { LegacyPageData } from "../types/legacy";

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
    const { getRootPageData } = await import("../lib/legacy-collections");
    return {
      props: {
        pageData: getRootPageData(params.slug),
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function SlugPage({ pageData }: PageProps) {
  return <LegacyPage {...pageData} />;
}
