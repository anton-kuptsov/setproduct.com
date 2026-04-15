import type { GetServerSideProps } from "next";
import LegacyPage from "../../components/LegacyPage";
import { buildLegacyPageData } from "../../lib/legacy-page";
import type { LegacyPageData } from "../../types/legacy";

const LEGAL_PAGE_BY_SLUG: Record<string, string> = {
  license: "license.html",
  "refunds-policy": "refunds-policy.html",
  "terms-of-paid-posts": "terms-of-paid-posts.html",
};

type PageProps = {
  pageData: LegacyPageData;
};

type SlugParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<PageProps, SlugParams> = async ({ params }) => {
  const slug = params?.slug;

  if (!slug) {
    return { notFound: true };
  }

  const filename = LEGAL_PAGE_BY_SLUG[slug];

  if (!filename) {
    return { notFound: true };
  }

  try {
    return {
      props: {
        pageData: buildLegacyPageData(`legal/${filename}`),
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function LegalLegacyPage({ pageData }: PageProps) {
  return <LegacyPage {...pageData} />;
}
