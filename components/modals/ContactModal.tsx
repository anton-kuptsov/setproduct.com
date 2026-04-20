"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsSubmitted(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="remodal-overlay"
      onClick={handleOverlayClick}
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="remodal"
        style={{
          background: "transparent",
          width: "auto",
          padding: 0,
          maxWidth: "none",
        }}
      >
        <div className="container">
          <div className="modal-wr">
            <div className="modal_heading-wr">
              <p className="heading-style-h2">Contact us</p>
              <p className="text-size-medium mob-16">
                Send your questions, ideas, and collaboration inquires
              </p>
            </div>
            <div className="modal_form-block w-form">
              {!isSubmitted ? (
                <form className="modal_form" onSubmit={handleSubmit}>
                  <div className="modal_form-item">
                    <p className="text-size-regular">Email</p>
                    <input
                      className="text-input w-input"
                      maxLength={256}
                      name="Email"
                      placeholder="Whats your e-mail"
                      required
                      type="email"
                    />
                  </div>
                  <div className="modal_form-item">
                    <p className="text-size-regular">Message</p>
                    <textarea
                      className="textarea-input w-input"
                      maxLength={5000}
                      name="Message"
                      placeholder="Type your message..."
                    />
                  </div>
                  <div className="modal_button-wr">
                    <div className="button-form-wr">
                      <button className="button w-inline-block" type="submit">
                        <div className="text-size-large text-weight-bold">Send your Message</div>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="success-message align-center" style={{ display: "block" }}>
                  <div className="text-size-small">Thank you! Your submission has been received!</div>
                </div>
              )}
            </div>
          </div>
          <button
            className="modal_close-btn"
            onClick={onClose}
            style={{ cursor: "pointer", border: "none", background: "transparent" }}
            type="button"
          >
            <img alt="Close" loading="lazy" src="/images/close-circle.svg" />
          </button>
        </div>
      </div>
    </div>
  );
}
