import {
  DribbbleIcon,
  LinkedInIcon,
  MediumIcon,
  PinterestIcon,
  RedditIcon,
  TwitterIcon,
  type FooterSocialIconComponent,
} from "./FooterSocialIcons";
import { useContactModal } from "../modals/ContactModalContext";
import { useSubscribe } from "../../hooks/useSubscribe";


type FooterLink = { href: string; label: string; external?: boolean; modal?: boolean };
type FooterColumn = { title: string; titleHref?: string; links: FooterLink[] };
type SocialLink = { href: string; label: string; Icon: FooterSocialIconComponent };

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Tutorials",
    titleHref: "/blog",
    links: [
      { href: "/blog?category=Startups%20%26%20SaaS", label: "Startups & SaaS" },
      { href: "/blog?category=UI%20Design", label: "UI Design" },
      { href: "/blog?category=Growth%20Hacking", label: "Growth Hacking" },
      { href: "/blog?category=Inspiration", label: "Inspiration" },
      { href: "/blog?category=Resources", label: "Resources" },
      { href: "/blog?category=Technology", label: "Technology" },
      { href: "/blog?category=Research", label: "Research" },
    ],
  },
  {
    title: "Design Kits",
    titleHref: "/all",
    links: [
      { href: "/dashboards", label: "Dashboards" },
      { href: "/mobile", label: "Mobile" },
      { href: "/dataviz", label: "Charts" },
      { href: "/code", label: "Code" },
      { href: "/websites", label: "Websites" },
      { href: "/bundle", label: "Bundle" },
      { href: "/freebies", label: "Freebies" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "https://publish.setproduct.com/", label: "Write for Us", external: true },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/legal/license", label: "License" },
      { href: "/legal/refunds-policy", label: "Refund Policy" },
      { href: "#", label: "Contact us", modal: true },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://dribbble.com/setproduct/shots",
    label: "Dribbble",
    Icon: DribbbleIcon,
  },
  {
    href: "https://twitter.com/set_product?lang=en",
    label: "Twitter",
    Icon: TwitterIcon,
  },
  {
    href: "https://www.reddit.com/r/FigmaDesignSystems/",
    label: "Reddit",
    Icon: RedditIcon,
  },
  {
    href: "https://www.pinterest.com/setproduct/",
    label: "Pinterest",
    Icon: PinterestIcon,
  },
  {
    href: "https://kamushken.medium.com/",
    label: "Medium",
    Icon: MediumIcon,
  },
  {
    href: "https://www.linkedin.com/company/setproduct/",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
];

export default function SiteFooter() {
  const { isSubscribed, isSubmitting, handleSubscribe } = useSubscribe();
  const { openContactModal } = useContactModal();

  return (
    <div className="section">
      <div className="section-padding bottom-80">
        <div className="container">
          <div className="footer">
            <div className="footer-card">
              <div className="footer_links-wr">
                {FOOTER_COLUMNS.map((column) => (
                  <div className="footer_column" key={column.title}>
                    {column.titleHref ? (
                      <a className="footer-link-title w-inline-block" href={column.titleHref}>
                        <div className="text-size-regular text-weight-bold">{column.title}</div>
                        <img alt="" className="footer-link-dropdown-icon" loading="lazy" src="/images/Mask.svg" />
                      </a>
                    ) : (
                      <div className="footer-link-title">
                        <div className="text-size-regular text-weight-bold">{column.title}</div>
                        <img alt="" className="footer-link-dropdown-icon" loading="lazy" src="/images/Mask.svg" />
                      </div>
                    )}
                    <div className="footer-links">
                      {column.links.map((link) => (
                        <a
                          className="link-block w-inline-block"
                          href={link.href}
                          key={link.href}
                          onClick={link.modal ? (e) => { e.preventDefault(); openContactModal(); } : undefined}
                          rel={link.external ? "noreferrer" : undefined}
                          target={link.external ? "_blank" : undefined}
                        >
                          <div className="text-size-small">{link.label}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="footer_logo-cta-wr">
                <div className="footer_logo-wr">
                  <img alt="" className="footer_logo-img" height={56} loading="lazy" src="/images/Vectors-Wrapper_1.svg" width={137} />
                  <a aria-label="Setproduct home" className="brand-link w-inline-block" href="/" />
                </div>
                <div className="footer_cta-wr">
                  <div className={`footer_cta-active${isSubscribed ? " hidden" : ""}`}>
                    <p className="heading-style-h4">Subscribe to Setproduct</p>
                    <div className="spacer-12" />
                    <p className="text-size-small">Join our newsletter to stay up to date on features and releases.</p>
                    <div className="spacer-24" />
                    <div className="form-block w-form">
                      <form className="form-cta" onSubmit={handleSubscribe}>
                        <input name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
                        <input aria-label="Email address" className="text-input w-input" disabled={isSubmitting} maxLength={256} name="Email" placeholder="Enter your email" required type="email" />
                        <div className="button-form-wr">
                          <button className="button w-inline-block" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }} type="submit">
                            {isSubmitting ? (
                              <svg
                                width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                style={{ animation: "spin 0.8s linear infinite", display: "block" }}
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
                  </div>
                  <div
                    className="footer_cta-success"
                    style={{ display: isSubscribed ? "flex" : "none" }}
                  >
                    <p className="heading-style-h4">Congratulations!</p>
                    <div className="spacer-12" />
                    <p className="text-size-small">You&apos;re in! Expect awesome updates in your inbox</p>
                    <div className="footer_cta-trigger" />
                  </div>
                </div>
              </div>
            </div>
            <div className="footer_credits">
              <div className="footer_credits-text">
                <div className="footer_credits-text-wr">
                  <div className="text-size-small">© All rights reserved. Setproduct.com</div>
                </div>
              </div>
              <div className="footer_socials">
                {SOCIAL_LINKS.map((social) => (
                  <a className="link-block footer-social-media w-inline-block" href={social.href} key={social.href} rel="noreferrer" target="_blank">
                    <div className="footer_social-icon w-embed">
                      <social.Icon height="100%" width="100%" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
