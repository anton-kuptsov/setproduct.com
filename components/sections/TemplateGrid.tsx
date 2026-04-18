import type { Product } from "../../types/data";
import TemplateCard from "./TemplateCard";

type Props = {
  products: Product[];
  visibleCount?: number;
  onLoadMore?: () => void;
};

export default function TemplateGrid({ products, visibleCount, onLoadMore }: Props) {
  const displayProducts = visibleCount != null ? products.slice(0, visibleCount) : products;
  const hasMore = visibleCount != null && visibleCount < products.length;

  return (
    <div className="w-dyn-list">
      <div className="templates_cl w-dyn-items" role="list">
        {displayProducts.map((product) => (
          <div key={product.slug} className="w-dyn-item" role="listitem">
            <TemplateCard product={product} />
          </div>
        ))}
      </div>
      {hasMore && onLoadMore && (
        <div className="mt-14">
          <div className="main_blog-liist2-btn-wr">
            <a
              className="button-small outlined w-inline-block"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onLoadMore();
              }}
            >
              <div className="text-size-medium text-weight-bold">Load More</div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
