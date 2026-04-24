import type { GetStaticProps } from "next";
import SearchPage from "../components/pages/SearchPage";
import { buildSearchIndex } from "../lib/search/buildIndex";
import type { SearchableItem } from "../lib/search/types";

type Props = {
  items: SearchableItem[];
};

export default function SearchRoute({ items }: Props) {
  return <SearchPage items={items} />;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      items: buildSearchIndex(),
    },
  };
};
