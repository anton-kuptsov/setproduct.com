type BlogMetaProps = {
  author: string;
  date: string;
  readingTimeText: string;
};

function formatDate(isoDate: string): string {
  // Parse YYYY-MM-DD safely without timezone shift
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default function BlogMeta({
  author,
  date,
  readingTimeText,
}: BlogMetaProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-6"
      data-testid="blog-meta"
    >
      <span>{author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden="true">·</span>
      <span>{readingTimeText}</span>
    </div>
  );
}
