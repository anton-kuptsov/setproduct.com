import { useSubscribe } from "../../hooks/useSubscribe";

export default function CtaSubscribe() {
  const { isSubscribed, isSubmitting, handleSubscribe } = useSubscribe();

  return (
    <div className="section">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="main_cta-section">
            {!isSubscribed ? (
              <div className="main_cta-active">
                <div className="heading-center-wr">
                  <h2 className="heading-style-h2">Subscribe to Setproduct</h2>
                  <div className="heading-style-h5 mob-18">
                    Once per week we send a newsletter with new releases, freebies and blog publications
                  </div>
                </div>
                <div className="actions">
                  <div className="form-block w-form">
                    <form className="form-cta" onSubmit={handleSubscribe}>
                      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                      <input
                        aria-label="Email address"
                        className="text-input w-input"
                        disabled={isSubmitting}
                        maxLength={256}
                        name="Email"
                        placeholder="Enter your email"
                        required
                        type="email"
                      />
                      <div className="button-form-wr">
                        <button
                          className="button w-inline-block disabled:opacity-70"
                          disabled={isSubmitting}
                          type="submit"
                        >
                          {isSubmitting ? (
                            <svg
                              width="20" height="20" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                              className="animate-spin block"
                            >
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                          ) : (
                            <div className="text-size-large text-weight-bold">Subscribe</div>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="action-par-wr">
                    <p className="text-tiny-normal">
                      By clicking Sign Up you&apos;re confirming that you agree with our{" "}
                      <a className="link-text-primary" href="/legal/license">Terms and Conditions.</a>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
                <div className="heading-center-wr py-12">
                  <h2 className="heading-style-h2">Congratulations!</h2>
                  <div className="heading-style-h5 mob-18">
                    You&apos;re in! Expect awesome updates in your inbox
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
