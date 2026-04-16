"use client";

import { useState } from "react";
import type { FaqItem } from "../../types/data";

type Props = { items: FaqItem[] };

export default function FaqSection({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="section">
      <div className="container">
        <div className="faq_wrapper">
          <h2 className="heading-style-h2">FAQ</h2>
          <div className="spacer-32"></div>
          {items.map((item, i) => (
            <div key={i} className="faq_item-wrapper">
              <button
                className="faq_question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                type="button"
              >
                <p className="text-size-medium text-weight-semibold">{item.question}</p>
                <div className="faq_icon-wr">
                  <div className="faq_icon-line is-vertical" style={{ transform: openIndex === i ? "rotate(90deg)" : undefined }} />
                  <div className="faq_icon-line" />
                </div>
              </button>
              {openIndex === i && (
                <div className="faq_answer-wrapper">
                  <p className="text-size-medium">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
