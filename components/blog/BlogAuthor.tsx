import Image from "next/image";
import { getAuthor } from "../../lib/blog/authors";

type BlogAuthorProps = {
  authorSlug: string;
};

export default function BlogAuthor({ authorSlug }: BlogAuthorProps) {
  const author = getAuthor(authorSlug);
  return (
    <a href="#" className="blogpost_author-wr w-inline-block">
      <div className="blogpost_author-img">
        <Image
          src={author.avatar}
          alt={author.name}
          width={40}
          height={40}
          className="image-cover"
          unoptimized={author.avatar.startsWith("http")}
        />
      </div>
      <p className="text-size-regular text-weight-semibold">{author.name}</p>
    </a>
  );
}
