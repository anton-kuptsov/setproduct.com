"use client";

import { type FormEvent, useState } from "react";
import {
  DribbbleIcon,
  LinkedInIcon,
  MediumIcon,
  PinterestIcon,
  RedditIcon,
  TwitterIcon,
  type FooterSocialIconComponent,
} from "./FooterSocialIcons";

type FooterLink = { href: string; label: string; external?: boolean; modal?: boolean };
type FooterColumn = { title: string; titleHref?: string; links: FooterLink[] };
type SocialLink = { href: string; label: string; Icon: FooterSocialIconComponent };

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Tutorials",
    titleHref: "/blog",
    links: [
      { href: "/blog?blog-categories=Startups+%26+Saas", label: "Startups & SaaS" },
      { href: "/blog?blog-categories=Tutorials", label: "UI Design" },
      { href: "/blog?blog-categories=Growth+Hacking", label: "Growth Hacking" },
      { href: "/blog?blog-categories=Inspiration", label: "Inspiration" },
      { href: "/blog?blog-categories=Resources", label: "Resources" },
      { href: "/blog?blog-categories=Technology", label: "Technology" },
      { href: "/blog?blog-categories=Research", label: "Research" },
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
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubscribed(true);
  };

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
                          data-remodal-target={link.modal ? "modal2" : undefined}
                          href={link.href}
                          key={link.href}
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
                  <a className="brand-link w-inline-block" href="/" />
                </div>
                <div className="footer_cta-wr">
                  <div
                    className="footer_cta-active"
                    style={{ display: isSubscribed ? "none" : undefined }}
                  >
                    <p className="heading-style-h4">Subscribe to Setproduct</p>
                    <div className="spacer-12" />
                    <p className="text-size-small">Join our newsletter to stay up to date on features and releases.</p>
                    <div className="spacer-24" />
                    <div className="form-block w-form">
                      <form className="form-cta" method="get" onSubmit={handleSubscribe}>
                        <input className="text-input w-input" maxLength={256} name="Email" placeholder="Enter your email" required type="email" />
                        <div className="button-form-wr">
                          <input className="hide w-button" type="submit" value="Subscribe" />
                          <a className="button w-inline-block" href="#">
                            <div className="text-size-large text-weight-bold">Subscribe</div>
                          </a>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    className="footer_cta-success"
                    style={{ display: isSubscribed ? undefined : "none" }}
                  >
                    <p className="heading-style-h4">Congratulations!</p>
                    <div className="spacer-12" />
                    <p className="text-size-small">You are in! Expect awesome updates in your inbox</p>
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
