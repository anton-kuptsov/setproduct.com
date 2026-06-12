import { useState, useCallback, type MouseEvent } from "react";
import type { FaqItem } from "../../types/data";
import { useContactModal } from "../modals/ContactModalContext";

type Props = {
  items: FaqItem[];
  title?: string;
};

const FaqToggleIcon = () => (
  <svg
    className="faq-toggle-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <line className="faq-toggle-icon__line faq-toggle-icon__line--h" x1="5" y1="12" x2="19" y2="12" />
    <line className="faq-toggle-icon__line faq-toggle-icon__line--v" x1="12" y1="5" x2="12" y2="19" />
  </svg>
);

export default function FaqSection({ items, title = "FAQs" }: Props) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const { openContactModal } = useContactModal();

  const toggle = useCallback((i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  // Answers are rendered from HTML strings, so links that should open the
  // contact modal are tagged with data-contact and intercepted here.
  const handleAnswerClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const link = (e.target as HTMLElement).closest("a[data-contact]");
      if (link) {
        e.preventDefault();
        openContactModal();
      }
    },
    [openContactModal],
  );

  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="max-width-768-centered">
            <div className="main_faq-section">
              <div className="heading-center-wr">
                <h2 className="heading-style-h2">{title}</h2>
              </div>
              <div className="faq_component">
                {items.map((item, i) => {
                  const open = openSet.has(i);
                  return (
                    <div
                      key={i}
                      className={`faq_item-wrapper${open ? " is-open" : ""}`}
                    >
                      <div
                        className="faq_question"
                        role="button"
                        tabIndex={0}
                        aria-expanded={open}
                        aria-controls={`faq-answer-${i}`}
                        onClick={() => toggle(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle(i);
                          }
                        }}
                      >
                        <p className="text-size-regular">{item.question}</p>
                        <div className="faq_icons-wr w-embed">
                          <FaqToggleIcon />
                        </div>
                      </div>
                      <div id={`faq-answer-${i}`} className="faq_answer-grid">
                        <div className="faq_answer-grid-inner">
                          <div className="faq_answer">
                            <div className="faq_answer-wrapper">
                              <p
                                className="text-size-small"
                                onClick={handleAnswerClick}
                                dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="faq_shadow-closed" />
                      <div className="faq_shadow-opened" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
