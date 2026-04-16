import Link from "next/link";
import type { BreadcrumbItem } from "../../types/data";

type Props = { items: BreadcrumbItem[] };

export default function Breadcrumbs({ items }: Props) {
  return (
    <div className="section">
      <div className="container pt-6.5">
        <div className="inline-flex gap-2 items-center ">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              {i > 0 && (
                <img
                  alt=""
                  className="breadcrump-icon"
                  loading="lazy"
                  src="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/65cdfb7d6149e6e6dd43d92e_Icon.svg"
                />
              )}
              {item.href ? (
                <Link className="text-size-regular" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <p className="text-size-regular">{item.label}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
