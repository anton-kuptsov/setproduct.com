import { useState } from "react";
import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import TemplateShowcase from "../sections/TemplateShowcase";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";

const CDN_PREFIX = "/testimonials/";

const TESTIMONIAL_PAGES: string[][] = [
  [
    "654cf0ae0fab332b65ef6723_Tim_Rupper_-_Jul_2_2.avif",
    "654cf0a6a5238a68cf491070_testimonial_Massimo.avif",
    "654cf094524505aedbfc24ad_testimonial_Leo.avif",
    "654cf086eef31db8d000efd6_testimonial_Alex_Mer.avif",
    "654cf07df60c6aba42f6bc65_Terence_Tam_2021-09-.avif",
    "654cf06b83cd0d767a8ed60f_Robert_A_-_Nov_24_20.avif",
    "654cf05fec4269cad82d5b5d_rob_malkovich.avif",
    "654cf051de54ce9c00a94493_Richard_Glesson_2021.avif",
    "654cf022502f3f75e87637eb_Rich_2021-04-05.avif",
    "654cf01853c07be25f02e2e2_reddit2.avif",
    "654ceff6649dc5f89d8557ed_reddit.avif",
    "654cefe2b2b57c902be79ac6_Nov_23.avif",
    "654cefce5217a84f6619c85a_Mar_26.avif",
    "654cefbeb2bdbdd4559875e8_Mar_24.avif",
  ],
  [
    "654cefb31bafa9308ad93429_Luke_Obrien_2020-08-.avif",
    "654cefa8c881c8c725fd9984_Luke_oBrien.avif",
    "654cef63c42a1748dac2c0e9_Kevin_Walter_2021-04.avif",
    "654cef513a0148c227d84cb9_Junaid_2020-10-30_Li.avif",
    "654cef3f8c9bad8727d5e755_Jun_3.avif",
    "654cef376f1c868fc4e43f42_Joe_Bezdek_2020-06-2.avif",
    "654cef290fab332b65ee40b7_Jase_Orion_Kit.avif",
    "654cef19a88615b8ffafa114_Jan_Irwin_levelup.avif",
    "654cef030fab332b65ee2c07_Jake_L_testimonial_1.avif",
    "654ce84347b3c0f693500802_Igor_2022-02-03.avif",
    "654ce82620363b98515ac7b7_driver202_2022-02-03.avif",
    "654ce81726e093a7971eda67_dec_28.avif",
    "654ce8072fb21427fb61c564_Dec_5.avif",
    "654ce7fe46abe2bc9b0a7f89_datamagican_24may.avif",
  ],
  [
    "654ce7edafad7f95897a9370_DanJasnowski_testimo.avif",
    "654ce7dd29303a3832d8831e_Craig_Revi_-_Feb_27_.avif",
    "654ce7c64c53ed2ebfd26575_Berc_Topcu_-_Mar_15_.avif",
    "654ce7b96be8fabc4f9ce662_Ash_-_Jun_2_2021.avif",
    "654ce7a933cff09f4d9ee160_Anqi_L_18-10-22-min.avif",
    "654ce78df8de29b8f399f74c_Andrzej_-_Mar_3_2021.avif",
  ],
];

export default function TestimonialsPage() {
  const meta = PAGE_META.testimonials;
  const breadcrumbs = PAGE_BREADCRUMBS.testimonials ?? [];
  const [visiblePages, setVisiblePages] = useState(1);

  const visibleItems = TESTIMONIAL_PAGES.slice(0, visiblePages).flat();
  const hasMore = visiblePages < TESTIMONIAL_PAGES.length;

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
              <div className="heading-left-text-wr">
                <h1 className="heading-style-h1">Our satisfied Customers</h1>
                <div className="heading-style-h5">
                  We helped more than 3,000 designers, developers and startups to design faster and better
                </div>
              </div>
              <div className="spacer-64"></div>
              <div className="testimonials_sect">
                <div className="testimonials_cl-wr w-dyn-list">
                  <div role="list" className="testimonials_cl w-dyn-items">
                    {visibleItems.map((filename) => (
                      <div key={filename} role="listitem" className="testimonials_cl-item w-dyn-item">
                        <a
                          href={`${CDN_PREFIX}${filename}`}
                          target="_blank"
                          rel="noreferrer"
                          className="lightbox-link-with-zoom w-inline-block"
                        >
                          <img
                            src={`${CDN_PREFIX}${filename}`}
                            alt=""
                            loading="lazy"
                            className="image-cover"
                          />
                        </a>
                      </div>
                    ))}
                  </div>
                  {hasMore && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
                      <a
                        href="#"
                        aria-label="Next Page"
                        onClick={(e) => {
                          e.preventDefault();
                          setVisiblePages((p) => p + 1);
                        }}
                        className="button secondary w-inline-block"
                      >
                        <div className="text-size-large text-weight-bold">Load more</div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section background-color-light-primary">
          <div className="section-padding top-80 bottom-80">
            <div className="container">
              <div className="main_cta-section">
                <div className="main_cta-active">
                  <div className="heading-center-wr lets-connect">
                    <h2 className="heading-style-h2">
                      Hire us to custom design &amp; code! Let&apos;s build together ✊
                    </h2>
                    <div className="heading-style-h5 mob-18">
                      We design in Figma &amp; Webflow using the top-notch UX expertise and lay down the lines of code in React, Vue, Angular, Flutter and Swift.
                    </div>
                  </div>
                  <div data-remodal-target="modal2" className="btn-link-align-center">
                    <a data-remodal-target="modal2" href="#" className="button w-inline-block">
                      <div className="text-size-large text-weight-bold">Let&rsquo;s connect</div>
                    </a>
                  </div>
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
