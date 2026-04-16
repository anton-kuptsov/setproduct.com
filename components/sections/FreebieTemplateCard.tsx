import Link from "next/link";
import type { FreebieItem } from "../../types/data";

type Props = {
  item: FreebieItem;
};

export default function FreebieTemplateCard({ item }: Props) {
  return (
    <div className="template-list-item">
      <Link className="template-list-item-img-wr w-inline-block" href={item.previewHref}>
        <img alt="" className="image-cover is-fit-top-left" loading="lazy" src={item.image} />
        <div className="freebies-template-category-wr">
          <p className="text-size-small">{item.category}</p>
        </div>
      </Link>
      <div className="template-list-text-wr">
        <Link className="w-inline-block" href={item.previewHref}>
          <p className="heading-style-h5 text-color-dark-primary text-style-1line">{item.title}</p>
        </Link>
        <p className="text-size-regular text-style-2lines line-clamp-2">
          {item.description}
        </p>
      </div>
      <div className="template-list-btn-wr">
        <Link className="button-small w-inline-block" href={item.previewHref}>
          <div className="text-size-medium text-weight-bold">More Preview</div>
        </Link>
        <a className="button-small outlined w-inline-block" href={item.duplicateHref} target="_blank" rel="noopener noreferrer">
          <div className="text-size-medium text-weight-bold">{item.isFree ? "Duplicate" : "Buy"}</div>
        </a>
      </div>
    </div>
  );
}
