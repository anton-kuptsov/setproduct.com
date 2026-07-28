import { getGumroadLinkProps } from "../../lib/gumroad";

type PricingCard = {
  title: string;
  description: string;
  descriptionHtml?: string;
  image: string;
  imageFit?: "cover" | "contain";
  price?: string;
  buyHref: string;
  buyLabel: string;
  previewHref?: string;
  previewLabel?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  cards: PricingCard[];
  previewLabel?: string;
};

export default function TemplatePricing({ title, subtitle, cards, previewLabel }: Props) {
  return (
    <div className="section" id="template-pricing">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          {(title || subtitle) && (
            <div className="heading-center-wr is-template-page2">
              {title && <h2 className="heading-style-h2">{title}</h2>}
              {subtitle && <div className="heading-style-h5 mob-18">{subtitle}</div>}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-40" />}

          <div
            className="template_2col-cards"
            style={
              cards.length === 1
                ? { gridTemplateColumns: "minmax(0, 640em)", justifyContent: "center" }
                : undefined
            }
          >
            {cards.map((card, index) => (
              <div key={index} className="template-list-item">
                <div className="template-list-item-img-wr is-height-480">
                  <img
                    alt={card.title}
                    className={
                      card.imageFit === "contain"
                        ? "image-cover is-fit-contain"
                        : "image-cover"
                    }
                    loading="lazy"
                    src={card.image}
                  />
                </div>
                <div className="template-list-text-wr">
                  <p className="heading-style-h5 text-color-dark-primary">{card.title}</p>
                  {card.descriptionHtml ? (
                    <div
                      className="text-size-regular"
                      dangerouslySetInnerHTML={{ __html: card.descriptionHtml }}
                    />
                  ) : (
                    <p className="text-size-regular">{card.description}</p>
                  )}
                </div>
                <div className="template-list-btn-wr">
                  <a
                    href={card.buyHref}
                    {...getGumroadLinkProps(card.buyHref, "button-small w-inline-block")}
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
                      <div className="text-size-medium text-weight-bold">
                        {card.previewLabel ?? previewLabel ?? "Preview in Figma"}
                      </div>
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
