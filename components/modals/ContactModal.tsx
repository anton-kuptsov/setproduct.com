import { type FormEvent, useEffect, useRef, useState } from "react";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [csrf, setCsrf] = useState<{ token: string; timestamp: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetch("/api/csrf")
        .then(res => res.json())
        .then(data => setCsrf(data))
        .catch(() => {});
    } else {
      document.body.style.overflow = "";
      setIsSubmitted(false);
      setErrorMessage(null);
      setCsrf(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("Email") as string;
    const message = formData.get("Message") as string;
    const website = formData.get("website") as string;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message,
          website,
          _token: csrf?.token,
          _timestamp: csrf?.timestamp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
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
                  <input name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                  <div className="modal_form-item">
                    <p className="text-size-regular">Email</p>
                    <input
                      className="text-input w-input"
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                      maxLength={5000}
                      name="Message"
                      placeholder="Type your message..."
                      required
                    />
                  </div>
                  {errorMessage && (
                    <div className="error-message" style={{ display: "block", marginBottom: "16px" }}>
                      <div className="text-size-small">{errorMessage}</div>
                    </div>
                  )}
                  <div className="modal_button-wr">
                    <div className="button-form-wr">
                      <button
                        className="button w-inline-block"
                        disabled={isSubmitting}
                        style={{ opacity: isSubmitting ? 0.7 : 1 }}
                        type="submit"
                      >
                        <div className="text-size-large text-weight-bold">
                          {isSubmitting ? "Sending..." : "Send your Message"}
                        </div>
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
