import Image from "next/image";
import Link from "next/link";

type BlogHeroProps = {
  title: string;
  subtitle?: string;
  coverImage?: string;
  coverImageAlt?: string;
  date: string;
  readingTimeText: string;
  category?: string;
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

function categoryLabel(cat: string): string {
  return cat
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace("And", "&");
}

export default function BlogHero({
  title,
  subtitle,
  coverImage,
  coverImageAlt,
  date,
  readingTimeText,
  category,
}: BlogHeroProps) {
  return (
    <div className="section">
      <div className="section-padding top-80 bottom-40">
        <div className="container">
          <div className="blogpost_hero-section">
            <div className="heading-center-wr max-width-900 mob-text-align-left">
              <h1 className="heading-style-h2">{title}</h1>
              {subtitle && (
                <div>
                  <p className="paragraph">{subtitle}</p>
                </div>
              )}
            </div>
            {coverImage && (
              <div className="blogpost_hero-img-wr" style={{ position: "relative", overflow: "hidden" }}>
                <Image
                  src={coverImage}
                  alt={coverImageAlt ?? title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="image-cover"
                  unoptimized={coverImage.startsWith("http")}
                />
              </div>
            )}
            <div className="spacer-24" />
            <div className="blogpost_hero-info-wr">
              {category && (
                <Link
                  href={`/blog?category=${category}`}
                  className="button-x-small is-text-no-pointer"
                >
                  <div className="text-size-regular text-weight-bold">
                    {categoryLabel(category)}
                  </div>
                </Link>
              )}
              <div className="blogpost_hero-info-intro">
                <p className="text-size-small">Published on</p>
                <p className="text-size-small">{formatDate(date)}</p>
                <p className="text-size-small">|</p>
                <p className="text-size-small">{readingTimeText}</p>
              </div>
            </div>
            <div className="spacer-40" />
            <div className="blogpost_hero-breadcrump-wr">
              <Link href="/blog" className="link-block no-margins w-inline-block">
                <div className="text-size-regular">Blog</div>
              </Link>
              <img
                src="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/65cdfb7d6149e6e6dd43d92e_Icon.svg"
                loading="lazy"
                alt=""
                className="breadcrump-icon"
              />
              <p className="text-size-regular">{title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
