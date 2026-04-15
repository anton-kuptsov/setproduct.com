import type { GetServerSideProps } from "next";
import LegacyPage from "../components/LegacyPage";
import { buildLegacyPageData } from "../lib/legacy-page";
import type { LegacyPageData } from "../types/legacy";

type HomePageProps = {
  pageData: LegacyPageData;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  return {
    props: {
      pageData: buildLegacyPageData("index.html"),
    },
  };
};

export default function HomePage({ pageData }: HomePageProps) {
  return <LegacyPage {...pageData} />;
}
