import type { Product } from "../../types/data";
import TemplateCard from "./TemplateCard";

type Props = { products: Product[] };

export default function TemplateGrid({ products }: Props) {
  return (
    <div className="w-dyn-list">
      <div className="templates_list w-dyn-items" role="list">
        {products.map((product) => (
          <div key={product.slug} className="w-dyn-item" role="listitem">
            <TemplateCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
