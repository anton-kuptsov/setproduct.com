import type { BundleItem } from "../../data/bundles";
import ArrowIcon from "./ArrowIcon";

type Props = { item: BundleItem };

export default function BundleCard({ item }: Props) {
  return (
    <div className="template-list-item">
      <div className="template-list-item-img-wr is-height-480">
        <img
          alt=""
          className="image-cover"
          loading="lazy"
          src={item.image}
        />
      </div>
      <div className="template-list-text-wr">
        <p className="subtitle-all-caps">{item.subtitle}</p>
        <p className="heading-style-h4 text-color-dark-primary text-style-2lines">
          {item.title}
        </p>
        <p
          className="text-size-medium"
          dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
        />
      </div>
      <div className="template-list-btn-wr">
        <a
          className="button-small w-inline-block"
          href={item.buyHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="text-size-medium text-weight-bold">
            Buy {item.price}
          </div>
          <div className="button-icon is-small w-embed">
            <ArrowIcon />
          </div>
        </a>
      </div>
    </div>
  );
}
