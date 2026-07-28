import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import AppLightbox, { preloadLightbox } from "../ui/AppLightbox";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import Breadcrumbs from "../sections/Breadcrumbs";
import { useContactModal } from "../modals/ContactModalContext";
import { PAGE_META } from "../../data/pages-meta";
import { PAGE_BREADCRUMBS } from "../../data/breadcrumbs";
import type { BlogPostPreview } from "../../types/data";

type Photo = { src: string; width: number; height: number };

const CDN_PREFIX = "/testimonials/";

const TESTIMONIAL_PAGES: Photo[][] = [
  [
    { src: "Tim_Rupper_-_Jul_2_2.webp", width: 755, height: 195 },
    { src: "testimonial_Massimo.webp", width: 875, height: 703 },
    { src: "testimonial_Leo.webp", width: 928, height: 372 },
    { src: "testimonial_Alex_Mer.webp", width: 972, height: 1606 },
    { src: "Terence_Tam_2021-09-.webp", width: 992, height: 761 },
    { src: "Robert_A_-_Nov_24_20.webp", width: 1012, height: 282 },
    { src: "rob_malkovich.webp", width: 901, height: 394 },
    { src: "Richard_Glesson_2021.webp", width: 676, height: 352 },
    { src: "Rich_2021-04-05.webp", width: 771, height: 285 },
    { src: "reddit2.webp", width: 1242, height: 203 },
    { src: "reddit.webp", width: 500, height: 284 },
    { src: "Nov_23.webp", width: 500, height: 371 },
    { src: "Mar_26.webp", width: 500, height: 577 },
    { src: "Mar_24.webp", width: 500, height: 333 },
  ],
  [
    { src: "Luke_Obrien_2020-08-.webp", width: 1206, height: 617 },
    { src: "Luke_oBrien.webp", width: 943, height: 444 },
    { src: "Kevin_Walter_2021-04.webp", width: 672, height: 378 },
    { src: "Junaid_2020-10-30_Li.webp", width: 1152, height: 1005 },
    { src: "Jun_3.webp", width: 500, height: 371 },
    { src: "Joe_Bezdek_2020-06-2.webp", width: 871, height: 948 },
    { src: "Jase_Orion_Kit.webp", width: 1371, height: 526 },
    { src: "Jan_Irwin_levelup.webp", width: 1007, height: 268 },
    { src: "Jake_L_testimonial_1.webp", width: 902, height: 590 },
    { src: "Igor_2022-02-03.webp", width: 672, height: 208 },
    { src: "driver202_2022-02-03.webp", width: 657, height: 150 },
    { src: "dec_28.webp", width: 500, height: 774 },
    { src: "Dec_5.webp", width: 500, height: 769 },
    { src: "datamagican_24may.webp", width: 895, height: 207 },
  ],
  [
    { src: "DanJasnowski_testimo.webp", width: 887, height: 831 },
    { src: "Craig_Revi_-_Feb_27_.webp", width: 717, height: 357 },
    { src: "Berc_Topcu_-_Mar_15_.webp", width: 588, height: 273 },
    { src: "Ash_-_Jun_2_2021.webp", width: 956, height: 422 },
    { src: "Anqi_L_18-10-22-min.webp", width: 950, height: 546 },
    { src: "Andrzej_-_Mar_3_2021.webp", width: 767, height: 171 },
  ],
];

type Props = {
  blogPosts?: BlogPostPreview[];
};

export default function TestimonialsPage({ blogPosts = [] }: Props) {
  const meta = PAGE_META.testimonials;
  const breadcrumbs = PAGE_BREADCRUMBS.testimonials ?? [];
  const [visiblePages, setVisiblePages] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const { openContactModal } = useContactModal();

  const visiblePhotos = TESTIMONIAL_PAGES.slice(0, visiblePages)
    .flat()
    .map((p) => ({ ...p, src: `${CDN_PREFIX}${p.src}` }));
  const hasMore = visiblePages < TESTIMONIAL_PAGES.length;

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader blogPosts={blogPosts} />
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
                    {visiblePhotos.map((photo, index) => (
                      <div
                        key={photo.src}
                        role="listitem"
                        className="testimonials_cl-item w-dyn-item"
                        style={{ breakInside: "avoid" }}
                      >
                        <a
                          href={photo.src}
                          onClick={(e) => {
                            e.preventDefault();
                            setLightboxIndex(index);
                          }}
                          onMouseEnter={preloadLightbox}
                          onTouchStart={preloadLightbox}
                          className="lightbox-link-with-zoom w-inline-block"
                          style={{ cursor: "zoom-in" }}
                        >
                          <Image
                            src={photo.src}
                            width={photo.width}
                            height={photo.height}
                            alt=""
                            priority={index < 3}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="image-cover block w-full h-auto"
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
              <AppLightbox
                open={lightboxIndex >= 0}
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
                slides={visiblePhotos}
                thumbnails
              />
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
                  <div className="btn-link-align-center">
                    <a href="#" className="button w-inline-block" onClick={(e) => { e.preventDefault(); openContactModal(); }}>
                      <div className="text-size-large text-weight-bold">Let&rsquo;s connect</div>
                    </a>
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
