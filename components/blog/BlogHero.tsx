import Link from "next/link";
import Image from "next/image";

type BlogHeroProps = {
  title: string;
  subtitle?: string;
  coverImage?: string;
  coverImageAlt?: string;
  date: string;
  readingTimeText: string;
  category?: string;
  lastUpdated?: string;
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

// Accepts both "YYYY-MM" and "YYYY-MM-DD". When the day is missing
// it renders just the month and year, e.g. "June 2026".
function formatUpdated(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = day ? new Date(year, month - 1, day) : new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    ...(day ? { day: "numeric" } : {}),
  }).format(date);
}

function categoryLabel(cat: string): string {
  return cat;
}

export default function BlogHero({
  title,
  subtitle,
  coverImage,
  coverImageAlt,
  date,
  readingTimeText,
  category,
  lastUpdated,
}: BlogHeroProps) {
  return (
    <>
      <div style={{ height: "70px" }} />
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
              <div className="blogpost_hero-img-wr relative overflow-hidden">
                <Image
                  src={coverImage}
                  alt={coverImageAlt ?? title}
                  fill
                  priority
                  sizes="(max-width: 991px) 100vw, 960px"
                  className="image-cover"
                />
              </div>
            )}
            <div className="spacer-24" />
            <div className="blogpost_hero-info-wr">
              {category && (
                <Link
                  href={`/blog?category=${encodeURIComponent(category)}`}
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
                {lastUpdated && (
                  <>
                    <p className="text-size-small">|</p>
                    <p className="text-size-small">Updated {formatUpdated(lastUpdated)}</p>
                  </>
                )}
              </div>
            </div>
            <div className="spacer-40" />
            <div className="blogpost_hero-breadcrump-wr">
              <Link href="/blog" className="link-block no-margins w-inline-block">
                <div className="text-size-regular">Blog</div>
              </Link>
              <img
                src="/images/Icon.svg"
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
    </>
  );
}
