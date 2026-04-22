type Props = {
  title?: string;
  subtitle?: string;
  image: string;
  alt?: string;
};

export default function TemplateImageSection({ title, subtitle, image, alt = "" }: Props) {
  return (
    <div className="section is-overflow-hidden">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          {(title || subtitle) && (
            <div className="heading-center-wr is-template-page2">
              {title && <h2 className="heading-style-h2" dangerouslySetInnerHTML={{ __html: title }} />}
              {subtitle && <div className="heading-style-h5 mob-18">{subtitle}</div>}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-64" />}
          <div className="template-single-img-wr">
            <img alt={alt} loading="lazy" sizes="100vw" src={image} />
          </div>
        </div>
      </div>
    </div>
  );
}
