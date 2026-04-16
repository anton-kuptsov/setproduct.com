import Link from "next/link";
import type { CategoryTab } from "../../types/data";

type Props = {
  tabs: CategoryTab[];
  activeSlug: string;
};

export default function CategoryTabs({ tabs, activeSlug }: Props) {
  return (
    <div className="templates_list-head">
      <div className="templates_list-filters-wr is-templates">
        {tabs.map((tab) =>
          tab.slug === activeSlug ? (
            <div key={tab.slug} className="button-x-small is-text is-templates is-active">
              <div className="text-size-small text-weight-semibold">{tab.label}</div>
            </div>
          ) : (
            <Link key={tab.slug} className="button-x-small is-text is-templates w-inline-block" href={tab.href}>
              <div className="text-size-small text-weight-semibold">{tab.label}</div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
