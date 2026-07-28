import Link from "next/link";
import { getAuthor, isRegisteredAuthor } from "../../lib/blog/authors";

type BlogAuthorProps = {
  authorSlug: string;
};

export default function BlogAuthor({ authorSlug }: BlogAuthorProps) {
  const author = getAuthor(authorSlug);
  const registered = isRegisteredAuthor(authorSlug);

  const inner = (
    <>
      <div className="blogpost_author-img">
        <img
          src={author.avatar}
          alt={author.name}
          width={40}
          height={40}
          className="image-cover"
          loading="lazy"
          style={{ color: "transparent" }}
        />
      </div>
      <p className="text-size-regular text-weight-semibold">{author.name}</p>
    </>
  );

  if (registered) {
    return (
      <Link
        href={`/authors/${author.slug}`}
        className="blogpost_author-wr w-inline-block"
        style={{ display: "inline-flex", width: "fit-content" }}
      >
        {inner}
      </Link>
    );
  }

  return <div className="blogpost_author-wr">{inner}</div>;
}
