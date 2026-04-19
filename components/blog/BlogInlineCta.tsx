import type { InlineCta } from "../../types/blog";

type BlogInlineCtaProps = {
  cta: InlineCta;
};

export default function BlogInlineCta({ cta }: BlogInlineCtaProps) {
  return (
    <div className="section background-color-light-primary">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="main_cta-section">
            <div className="main_cta-active">
              <div className="heading-center-wr lets-connect is-bigger">
                <h2 className="heading-style-h2">{cta.title}</h2>
                <div className="heading-style-h5 mob-18">{cta.description}</div>
              </div>
              <div className="btn-link-align-center">
                <a
                  href={cta.buttonLink}
                  className="button w-inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="text-size-large text-weight-bold">{cta.buttonText}</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
