import Link from "next/link";
import type { Product } from "../../types/data";
import ArrowIcon from "./ArrowIcon";

type Props = { product: Product };

export default function SliderTemplateCard({ product }: Props) {
  return (
    <div className="template-list-item">
      <Link className="template-list-item-img-wr w-inline-block" href={`/templates/${product.slug}`}>
        <img alt="" className="image-cover" loading="lazy" src={product.image} />
      </Link>
      <div className="template-list-text-wr">
        <Link className="w-inline-block" href={`/templates/${product.slug}`}>
          <p className="heading-style-h5 text-color-dark-primary text-style-1line">{product.title}</p>
        </Link>
        <p className="text-size-regular text-style-2lines line-clamp-2">{product.description}</p>
      </div>
      <div className="template-list-btn-wr">
        <a className="button-small w-inline-block" href={product.buyHref} target="_blank" rel="noopener noreferrer">
          <div className="text-size-medium text-weight-bold">Buy ${product.price}</div>
          <div className="button-icon is-small w-embed"><ArrowIcon /></div>
        </a>
        <Link className="button-small outlined w-inline-block" href={`/templates/${product.slug}`}>
          <div className="text-size-medium text-weight-bold">Learn More</div>
          <div className="button-icon is-small w-embed"><ArrowIcon /></div>
        </Link>
      </div>
    </div>
  );
}
