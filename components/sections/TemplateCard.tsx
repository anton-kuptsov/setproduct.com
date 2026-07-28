import Link from "next/link";
import Image from "next/image";
import type { Product } from "../../types/data";
import ArrowIcon from "./ArrowIcon";
import { getGumroadLinkProps } from "../../lib/gumroad";

type Props = { product: Product; imgHeight?: "default" | "480" };

export default function TemplateCard({ product, imgHeight = "480" }: Props) {
  const imgClass =
    imgHeight === "480"
      ? "template-list-item-img-wr is-height-480 w-inline-block"
      : "template-list-item-img-wr w-inline-block";
  return (
    <div className="template-list-item">
      <Link className={imgClass} href={`/templates/${product.slug}`}>
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
          <p className="heading-style-h4 text-color-dark-primary text-style-2lines">{product.title}</p>
        </Link>
        <p className="text-size-medium text-style-3lines">{product.description}</p>
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
