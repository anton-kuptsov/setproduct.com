import Image from "next/image";

type Props = {
  title: string;
  description: string;
  heroImage: string;
  buyHref: string;
  previewHref: string;
  price?: string;
};

export default function TemplateHero({
  title,
  description,
  heroImage,
  buyHref,
  previewHref,
}: Props) {
  return (
    <div className="section is-height-100vh">
      <div className="section-padding top-80 bottom-64">
        <div className="container">
          <div className="template_hero-sect">
            <div className="template_hero-wr max-width-900">
              <h1 className="heading-style-h1">{title}</h1>
              <p className="heading-style-h5">{description}</p>
              <div className="template_hero-btn-wr">
                <a
                  className="button secondary w-inline-block"
                  href={buyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-size-large text-weight-bold">Get Started</div>
                </a>
                <a
                  className="button w-inline-block"
                  href={previewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-size-large text-weight-bold">Preview in Figma</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-bg-image-wr">
        <Image
          alt={title}
          className="image-cover"
          fill
          priority
          sizes="100vw"
          src={heroImage}
          style={{ objectFit: "cover" }}
        />
        <div className="section-bg-gradient" />
      </div>
    </div>
  );
}
