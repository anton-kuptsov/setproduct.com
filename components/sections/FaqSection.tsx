import { useState, useCallback } from "react";
import type { FaqItem } from "../../types/data";

type Props = { items: FaqItem[] };

const FaqMinusIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M19 13H5C4.448 13 4 12.553 4 12C4 11.447 4.448 11 5 11H19C19.553 11 20 11.447 20 12C20 12.553 19.553 13 19 13Z"
      fill="#1A191C"
      fillRule="evenodd"
    />
  </svg>
);

const FaqPlusIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M19 13H5C4.448 13 4 12.553 4 12C4 11.447 4.448 11 5 11H19C19.553 11 20 11.447 20 12C20 12.553 19.553 13 19 13Z"
      fill="#1A191C"
      fillRule="evenodd"
    />
  </svg>
);

export default function FaqSection({ items }: Props) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());

  const toggle = useCallback((i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="max-width-768-centered">
            <div className="main_faq-section">
              <div className="heading-center-wr">
                <h2 className="heading-style-h2">FAQs</h2>
              </div>
              <div className="faq_component">
                {items.map((item, i) => (
                  <div key={i} className="faq_item-wrapper">
                    <div
                      className="faq_question"
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(i);
                        }
                      }}
                    >
                      <p className="text-size-regular">{item.question}</p>
                      <div className="faq_icons-wr">
                        <div className="faq_icon minus w-embed"><FaqMinusIcon /></div>
                        <div className="faq_icon plus w-embed"><FaqPlusIcon /></div>
                      </div>
                    </div>
                    {openSet.has(i) && (
                      <div className="faq_answer">
                        <div className="faq_answer-wrapper">
                          <p
                            className="text-size-small"
                            dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="faq_shadow-closed" />
                    <div className="faq_shadow-opened" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
