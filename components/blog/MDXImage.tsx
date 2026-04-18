import Image from "next/image";

type MDXImageProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
};

export default function MDXImage({
  src,
  alt = "",
  width,
  height,
  caption,
}: MDXImageProps) {
  if (!src) return null;

  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  const imageEl =
    width && height ? (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-md"
        unoptimized={isExternal}
      />
    ) : (
      <div className="relative w-full aspect-[16/9] my-4">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 900px"
          className="object-cover rounded-md"
          unoptimized={isExternal}
        />
      </div>
    );

  if (caption) {
    return (
      <figure className="my-6">
        {imageEl}
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return imageEl;
}
