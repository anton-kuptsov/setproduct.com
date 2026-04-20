"use client";

import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import { useContactModal } from "../modals/ContactModalContext";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";

export default function RefundsPolicyPage() {
  const { openContactModal } = useContactModal();
  const meta = PAGE_META["refunds-policy"];
  const breadcrumbs = PAGE_BREADCRUMBS["refunds-policy"] ?? [];

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader />
      <main>
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="freebies_rich-text-component">
                <div className="rich-text-18 w-richtext">
                  <h1 >Refunds policy</h1>

                  <p className="pt-8">
                    If you&apos;re not satisfied with the product you&apos;ve purchased —{" "}
                    <a href="#" onClick={(e) => { e.preventDefault(); openContactModal(); }}>
                      contact us
                    </a>{" "}
                    and provide a trustworthy explanation of why you changed your mind. We do not
                    proceed with a refund for a Design Bundle or Subscription. Due to the essence of
                    the digital products, we can&apos;t verify you stopped using our assets and
                    deleted it.
                    <br />
                    <br />
                    For a single purchase, we may issue a refund or decline. It depends on a variety
                    of circumstances, you have to explain in details before asking for a refund. Each
                    situation is reviewing by our team independently and you&apos;ll be notified
                    about our decision within 30 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
