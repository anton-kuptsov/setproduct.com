import Image from "next/image";

type BlogHeroProps = {
  title: string;
  coverImage?: string;
  coverImageAlt?: string;
};

export default function BlogHero({
  title,
  coverImage,
  coverImageAlt,
}: BlogHeroProps) {
  return (
    <div className="mb-8">
      {coverImage && (
        <div className="relative w-full aspect-[2/1] mb-6 overflow-hidden rounded-lg">
          <Image
            src={coverImage}
            alt={coverImageAlt ?? title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      )}
      <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
        {title}
      </h1>
    </div>
  );
}
