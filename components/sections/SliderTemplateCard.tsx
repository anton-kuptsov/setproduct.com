import Link from "next/link";
import Image from "next/image";
import type { Product } from "../../types/data";
import ArrowIcon from "./ArrowIcon";
import { getGumroadLinkProps } from "../../lib/gumroad";

type Props = { product: Product };

export default function SliderTemplateCard({ product }: Props) {
  return (
    <div className="template-list-item">
      <Link className="template-list-item-img-wr w-inline-block" href={`/templates/${product.slug}`}>
        <Image
          alt=""
          src={product.image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="image-cover"
        />
      </Link>
      <div className="template-list-text-wr">
        <Link className="w-inline-block" href={`/templates/${product.slug}`}>
          <p className="heading-style-h5 text-color-dark-primary text-style-1line">{product.title}</p>
        </Link>
        <p className="text-size-regular text-style-2lines line-clamp-2">{product.description}</p>
      </div>
      <div className="template-list-btn-wr">
        <a href={product.buyHref} {...getGumroadLinkProps(product.buyHref, "button-small w-inline-block")}>
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
