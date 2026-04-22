type PricingCard = {
  title: string;
  description: string;
  image: string;
  price?: string;
  buyHref: string;
  buyLabel: string;
  previewHref?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  cards: PricingCard[];
};

export default function TemplatePricing({ title, subtitle, cards }: Props) {
  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          {(title || subtitle) && (
            <div className="heading-center-wr is-template-page2">
              {title && <h2 className="heading-style-h2">{title}</h2>}
              {subtitle && <div className="heading-style-h5 mob-18">{subtitle}</div>}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-40" />}

          <div className="template_2col-cards">
            {cards.map((card, index) => (
              <div key={index} className="template-list-item">
                <div className="template-list-item-img-wr is-height-480">
                  <img
                    alt={card.title}
                    className="image-cover"
                    loading="lazy"
                    src={card.image}
                  />
                </div>
                <div className="template-list-text-wr">
                  <p className="heading-style-h5 text-color-dark-primary">{card.title}</p>
                  <p className="text-size-regular">{card.description}</p>
                </div>
                <div className="template-list-btn-wr">
                  <a
                    className="button-small w-inline-block"
                    href={card.buyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="text-size-medium text-weight-bold">
                      {card.price ? `${card.buyLabel} ${card.price}` : card.buyLabel}
                    </div>
                  </a>
                  {card.previewHref && (
                    <a
                      className="button-small outlined w-inline-block"
                      href={card.previewHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="text-size-medium text-weight-bold">Preview in Figma</div>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
