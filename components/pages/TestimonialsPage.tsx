import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import HeroSection from "../sections/HeroSection";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";

export default function TestimonialsPage() {
  const meta = PAGE_META.testimonials;
  const breadcrumbs = PAGE_BREADCRUMBS.testimonials ?? [];

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
        <HeroSection
          title="Testimonials"
          description="Hundreds of satisfied Setproduct buyers already boosted an entire workflow, development and sprints by using our products."
        />
        <div className="section">
          <div className="container">
            <div className="testimonials_list">
              <p className="text-size-medium">
                Testimonial content is dynamically loaded from external sources. Visit our Gumroad page to see customer reviews.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
