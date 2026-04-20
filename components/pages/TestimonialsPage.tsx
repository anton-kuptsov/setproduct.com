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
          title="Our satisfied Customers"
          description="We helped more than 3,000 designers, developers and startups to design faster and better"
        />
        <div className="section">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="testimonials_sect">
                <div className="testimonials_cl-wr w-dyn-list">
                  <div className="testimonials_cl w-dyn-items">
                    <div className="testimonials_cl-item w-dyn-item">
                      <a
                        className="lightbox-link-with-zoom w-inline-block"
                        href="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7edafad7f95897a9370_DanJasnowski_testimo.avif"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7edafad7f95897a9370_DanJasnowski_testimo.avif"
                          srcSet="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7edafad7f95897a9370_DanJasnowski_testimo.avif 500w, /external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7edafad7f95897a9370_DanJasnowski_testimo.avif"
                          alt="Dan Jasnowski testimonial"
                          loading="lazy"
                        />
                      </a>
                    </div>
                    <div className="testimonials_cl-item w-dyn-item">
                      <a
                        className="lightbox-link-with-zoom w-inline-block"
                        href="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7dd29303a3832d8831e_Craig_Revi_-_Feb_27_.avif"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7dd29303a3832d8831e_Craig_Revi_-_Feb_27_.avif"
                          srcSet="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7dd29303a3832d8831e_Craig_Revi_-_Feb_27_.avif 500w, /external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7dd29303a3832d8831e_Craig_Revi_-_Feb_27_.avif"
                          alt="Craig testimonial"
                          loading="lazy"
                        />
                      </a>
                    </div>
                    <div className="testimonials_cl-item w-dyn-item">
                      <a
                        className="lightbox-link-with-zoom w-inline-block"
                        href="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7c64c53ed2ebfd26575_Berc_Topcu_-_Mar_15_.avif"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7c64c53ed2ebfd26575_Berc_Topcu_-_Mar_15_.avif"
                          alt="Berc Topcu testimonial"
                          loading="lazy"
                        />
                      </a>
                    </div>
                    <div className="testimonials_cl-item w-dyn-item">
                      <a
                        className="lightbox-link-with-zoom w-inline-block"
                        href="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7b96be8fabc4f9ce662_Ash_-_Jun_2_2021.avif"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7b96be8fabc4f9ce662_Ash_-_Jun_2_2021.avif"
                          srcSet="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7b96be8fabc4f9ce662_Ash_-_Jun_2_2021.avif 500w, /external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7b96be8fabc4f9ce662_Ash_-_Jun_2_2021.avif"
                          alt="Ash testimonial"
                          loading="lazy"
                        />
                      </a>
                    </div>
                    <div className="testimonials_cl-item w-dyn-item">
                      <a
                        className="lightbox-link-with-zoom w-inline-block"
                        href="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7a933cff09f4d9ee160_Anqi_L_18-10-22-min.avif"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7a933cff09f4d9ee160_Anqi_L_18-10-22-min.avif"
                          srcSet="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7a933cff09f4d9ee160_Anqi_L_18-10-22-min.avif 500w, /external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7a933cff09f4d9ee160_Anqi_L_18-10-22-min.avif"
                          alt="Anqi L testimonial"
                          loading="lazy"
                        />
                      </a>
                    </div>
                    <div className="testimonials_cl-item w-dyn-item">
                      <a
                        className="lightbox-link-with-zoom w-inline-block"
                        href="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce78df8de29b8f399f74c_Andrzej_-_Mar_3_2021.avif"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce78df8de29b8f399f74c_Andrzej_-_Mar_3_2021.avif"
                          srcSet="/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce78df8de29b8f399f74c_Andrzej_-_Mar_3_2021.avif 500w, /external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce78df8de29b8f399f74c_Andrzej_-_Mar_3_2021.avif"
                          alt="Andrzej testimonial"
                          loading="lazy"
                        />
                      </a>
                    </div>
                  </div>
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
