"use client";

import { useContactModal } from "../modals/ContactModalContext";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function TemplateCtaHire({
  title = "Hire us to custom design & code! Let's build together ✊",
  subtitle = "We design in Figma & Webflow using the top-notch UX expertise and lay down the lines of code in React, Vue, Angular, Flutter and Swift.",
}: Props) {
  const { openContactModal } = useContactModal();

  return (
    <div className="section background-color-light-primary">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="main_cta-section">
            <div className="main_cta-active">
              <div className="heading-center-wr lets-connect">
                <h2 className="heading-style-h2">{title}</h2>
                <div className="heading-style-h5 mob-18">{subtitle}</div>
              </div>
              <div className="btn-link-align-center">
                <button
                  className="button w-inline-block"
                  onClick={openContactModal}
                  type="button"
                >
                  <div className="text-size-large text-weight-bold">Let's connect</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
