export default function CtaSubscribe() {
  return (
    <div className="section background-color-light-primary">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          <div className="main_cta-section">
            <div className="main_cta-active">
              <div className="heading-center-wr">
                <h2 className="heading-style-h2">Subscribe to Setproduct</h2>
                <div className="heading-style-h5 mob-18">
                  Once per week we send a newsletter with new releases, freebies and blog publications
                </div>
              </div>
              <div className="actions">
                <div className="form-block w-form">
                  <form className="form-cta" method="get">
                    <input
                      className="text-input w-input"
                      maxLength={256}
                      name="Email"
                      placeholder="Enter your email"
                      required
                      type="email"
                    />
                    <div className="button-form-wr">
                      <a className="button w-inline-block" href="#">
                        <div className="text-size-large text-weight-bold">Subscribe</div>
                      </a>
                    </div>
                  </form>
                </div>
                <div className="action-par-wr">
                  <p className="text-tiny-normal">
                    By clicking Sign Up you&apos;re confirming that you agree with our{" "}
                    <a className="link-text-primary" href="/legal/terms-and-conditions">Terms and Conditions.</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
