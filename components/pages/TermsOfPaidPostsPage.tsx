import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import TemplateShowcase from "../sections/TemplateShowcase";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";

export default function TermsOfPaidPostsPage() {
  const meta = PAGE_META["terms-of-paid-posts"];
  const breadcrumbs = PAGE_BREADCRUMBS["terms-of-paid-posts"] ?? [];

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
                  <h1>Paid posts terms of service</h1>
                  <p>
                    By utilizing the{" "}
                    <a href="https://setproduct.gumroad.com/l/setproduct-paid-post" target="_blank" rel="noreferrer">
                      Advertisement Paid Post
                    </a>{" "}
                    feature on &apos;Setproduct Design Blog,&apos; you agree to the following terms
                    and conditions:
                  </p>
                  <ol>
                    <li>
                      <strong>Content Submission</strong>: Clients are responsible for the accuracy
                      and completeness of the content they submit for their Advertisement Paid Post.
                      The content should align with our guidelines and be relevant to the design and
                      tech industry. We reserve the right to reject or request revisions for any
                      content that does not meet our standards or contains inappropriate or offensive
                      material.
                    </li>
                    <li>
                      <strong>Payment</strong>: Payment for the Advertisement Paid Post feature must
                      be made in full before the post is published on &apos;Setproduct Design
                      Blog.&apos; We offer secure payment options to ensure a smooth transaction
                      process through{" "}
                      <a href="http://gumroad.com/" target="_blank" rel="noreferrer">
                        Gumroad
                      </a>
                      .
                    </li>
                    <li>
                      <strong>Intellectual Property</strong>: By submitting content for an
                      Advertisement Paid Post, clients represent and warrant that they have the
                      necessary rights and permissions to use and display the content. Clients retain
                      ownership of their intellectual property; however, they grant &apos;Setproduct
                      Design Blog&apos; a non-exclusive, worldwide license to use, reproduce, and
                      display their content for promotional purposes.
                    </li>
                    <li>
                      <strong>Post Modifications</strong>: Our team strives to present client content
                      in the best possible light. We may make necessary edits for formatting, visual
                      enhancements, and to ensure the content aligns with our blog&apos;s style and
                      guidelines. Clients will have the opportunity to review and approve the final
                      version of their Advertisement Paid Post before it is published.
                    </li>
                    <li>
                      <strong>Post Duration</strong>: The duration of each Advertisement Paid Post
                      will be clearly indicated based on the selected package. It is the
                      client&apos;s responsibility to be aware of the timeframe their post will be
                      featured on &apos;Setproduct Design Blog.&apos;
                    </li>
                    <li>
                      <strong>Post Visibility</strong>: While we aim to maximize the visibility and
                      exposure of each Advertisement Paid Post, we cannot guarantee specific traffic,
                      engagement, or conversions. Factors such as audience preferences and external
                      market conditions may impact the performance of the post.
                    </li>
                    <li>
                      <strong>Termination</strong>: &apos;Setproduct Design Blog&apos; reserves the
                      right to terminate or remove any Advertisement Paid Post at our discretion if
                      it violates our guidelines or for any other reason deemed necessary. In such
                      cases, a pro-rata refund may be considered depending on the circumstances.
                    </li>
                    <li>
                      <strong>Non-refundable</strong>: Payments made for the Advertisement Paid Post
                      feature are non-refundable, as the service involves manual efforts, resources,
                      and publication costs.
                    </li>
                    <li>
                      <strong>Limitation of Liability</strong>: &apos;Setproduct Design Blog&apos;
                      shall not be liable for any direct, indirect, incidental, consequential, or
                      special damages arising from the use or inability to use the Advertisement Paid
                      Post feature or any content posted on the blog.
                    </li>
                    <li>
                      <strong>Modification of Terms</strong>: &apos;Setproduct Design Blog&apos;
                      reserves the right to modify these Terms of Service at any time. Clients will
                      be notified of any changes, and continued use of the Advertisement Paid Post
                      feature constitutes acceptance of the updated terms.
                    </li>
                  </ol>
                  <p>
                    By proceeding with the{" "}
                    <a href="https://setproduct.gumroad.com/l/setproduct-paid-post" target="_blank" rel="noreferrer">
                      Advertisement Paid Post
                    </a>{" "}
                    feature on &apos;Setproduct Design Blog,&apos; you acknowledge that you have
                    read, understood, and agreed to abide by these Terms of Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TemplateShowcase />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
