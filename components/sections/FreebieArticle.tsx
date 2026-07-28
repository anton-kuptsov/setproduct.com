"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";

type Props = {
  slug: string;
};

type ArticleHeading = {
  id: string;
  text: string;
};

const DRIVER_JS_HEADINGS: ArticleHeading[] = [
  { id: "what-driver-js-does", text: "What driver.js actually does" },
  { id: "why-onboarding", text: "Why onboarding is the thing you postpone" },
  { id: "how-it-works", text: "How it works under the hood" },
  { id: "size-argument", text: "The size argument that matters" },
  { id: "more-than-tours", text: "More than tours" },
  { id: "wiring-into-ai-app", text: "Wiring it into an AI-built app" },
  { id: "why-it-belongs", text: "Why it belongs in your stack" },
];

/**
 * Long-form body content for specific freebie detail pages.
 * Rendered between the breadcrumbs and the "More Figma freebies" showcase.
 * Reuses the blog two-column layout: sticky navigation on the left,
 * rich-text body on the right. Add a new branch per slug when a freebie
 * needs an editorial article.
 */
export default function FreebieArticle({ slug }: Props) {
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [stickyStyle, setStickyStyle] = useState<CSSProperties>({});
  const [activeId, setActiveId] = useState<string>("");

  const isDriverJs = slug === "driver-js";

  useEffect(() => {
    if (!isDriverJs) return;
    const checkMobile = () => {
      const mobile = window.innerWidth < 991;
      setIsMobile(mobile);
      if (mobile) setStickyStyle({});
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isDriverJs]);

  useEffect(() => {
    if (!isDriverJs || isMobile) {
      setStickyStyle({});
      return;
    }

    const inner = innerRef.current;
    const container = contentSectionRef.current;
    const wrapper = inner?.parentElement;
    if (!inner || !container || !wrapper) return;

    const topOffset = 80;

    const calculate = () => {
      if (!inner || !container || !wrapper) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const innerHeight = inner.scrollHeight;
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const stickyBottom = topOffset + innerHeight;

      if (containerTop >= topOffset) {
        setStickyStyle({});
      } else if (containerBottom <= stickyBottom) {
        setStickyStyle({
          position: "fixed",
          top: containerBottom - innerHeight,
          left: wrapperRect.left,
          width: wrapperRect.width,
        });
      } else {
        setStickyStyle({
          position: "fixed",
          top: topOffset,
          left: wrapperRect.left,
          width: wrapperRect.width,
        });
      }
    };

    const handleScroll = () => requestAnimationFrame(calculate);
    const handleResize = () => calculate();

    calculate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDriverJs, isMobile]);

  useEffect(() => {
    if (!isDriverJs) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    DRIVER_JS_HEADINGS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isDriverJs]);

  if (!isDriverJs) return null;

  return (
    <div className="section">
      <div className="section-padding top-64 bottom-64">
        <div className="container">
          <div className="blogpost_content-section" ref={contentSectionRef}>
            <div className="blogpost_content-column1">
              <div ref={innerRef} style={{ ...stickyStyle, transition: "none" }}>
                <div className="hide-on-mobile">
                  <p className="text-size-medium text-weight-bold">Navigation</p>
                </div>
                <div className="spacer-16 hide-on-mobile" />
                <div className="blogpost_navigation-wr">
                  {DRIVER_JS_HEADINGS.map((h) => (
                    <div key={h.id} className="blogpost_navigation-link-wr">
                      <a
                        href={`#${h.id}`}
                        className={`blogpost_navigation-link w-inline-block${
                          activeId === h.id ? " fs-cmsfilter_active" : ""
                        }`}
                      >
                        <p>{h.text}</p>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="blogpost_content-column2">
              <article className="rich-text-18 w-richtext">
                <p className="blog_big-paragraph">
                  You shipped the app. The AI wrote half the code. The feature
                  works. Then the first real user opens it, stares at the screen,
                  and leaves before they find the one button that mattered.
                  Driver.js closes that gap with a single small file and a list
                  of steps.
                </p>

                <h2 id="what-driver-js-does">What driver.js actually does</h2>
                <p>
                  Driver.js highlights any element on a page, dims everything
                  else, and walks the user through your interface one step at a
                  time. You point it at a button, a menu, or a form field. It
                  draws a spotlight around that element, shows a small popover
                  with your text, and waits. The user clicks next, the spotlight
                  moves, and the next idea lands. That is the whole mechanic, and
                  it covers most of what onboarding needs.
                </p>
                <p>
                  The library ships as vanilla TypeScript with zero
                  dependencies. It weighs around 5kb gzipped. It runs in every
                  major browser, responds to the keyboard, and carries an MIT
                  license, so you use it in personal and commercial work without
                  paying anyone or asking permission. The numbers back the
                  adoption: roughly 4.3 million downloads a month and 287 million
                  jsDelivr hits a month.
                </p>

                <h2 id="why-onboarding">
                  Why onboarding is the thing you postpone
                </h2>
                <p>
                  Onboarding is the distance between &ldquo;it works&rdquo; and
                  &ldquo;people use it.&rdquo; Most solo founders skip it because
                  the usual options feel heavy. A full product-tour SaaS wants a
                  monthly fee and a script tag that loads a chunk of someone
                  else&rsquo;s framework. A hand-built tour eats a weekend you do
                  not have. So the tour never ships, and new users keep churning
                  on day one.
                </p>
                <p>
                  Driver.js removes that excuse. You add one file. You write a
                  list of steps. You point each step at a CSS selector. The first
                  session now ends with a user who understands the product
                  instead of one who guessed and gave up.
                </p>

                <h2 id="how-it-works">How it works under the hood</h2>
                <p>
                  A tour in driver.js is an array of steps. Each step names an
                  element on the page and the text you want beside it:
                </p>
                <ul>
                  <li>
                    <code>element</code> → the CSS selector you want to highlight
                  </li>
                  <li>
                    <code>popover</code> → the title and description shown next
                    to it
                  </li>
                  <li>
                    <code>side</code> and <code>align</code> → where the popover
                    sits relative to the element
                  </li>
                </ul>
                <p>
                  You pass that array to a <code>driver()</code> call and run{" "}
                  <code>drive()</code>. The library handles the overlay, the
                  focus trap, the keyboard arrows, and the next and previous
                  buttons. You write copy and selectors. It handles the rest.
                </p>
                <p>
                  The part that makes it flexible is the hooks. Driver.js gives
                  you callbacks for the moment an element is about to be
                  highlighted, the moment it gets highlighted, and the moment it
                  is deselected. You use those hooks to change the page as the
                  tour moves. Open a dropdown right before you point at an item
                  inside it. Load chart data before you highlight the chart.
                  Scroll a hidden panel into view. The tour and your app stay in
                  step instead of fighting each other.
                </p>

                <h2 id="size-argument">The size argument that matters</h2>
                <p>
                  Five kilobytes sounds like a detail. It is not. Every script
                  you add to onboarding loads before the user has done anything
                  useful. A 12kb-plus tour library competes with your own app for
                  that first second. Driver.js is roughly half the weight of the
                  common alternatives, and it pulls in nothing else. No React
                  requirement, no framework lock-in.
                </p>
                <p>
                  It drops into a Next.js app, a plain HTML page, or whatever the
                  model generated for you, and it behaves the same way in each.
                  That consistency is worth more than it looks: you write the
                  tour once and trust it across browsers rather than chasing edge
                  cases one device at a time.
                </p>

                <h2 id="more-than-tours">More than tours</h2>
                <p>
                  Calling it a tour library undersells it. A tour is one use
                  case. The same spotlight mechanic covers a lot of ground:
                </p>
                <ul>
                  <li>
                    ❶ Point at a single new feature and explain it in one popover
                  </li>
                  <li>
                    ❷ Open contextual help with the rest of the page dimmed
                  </li>
                  <li>
                    ❸ Shift focus to one form field so the user finishes signup
                  </li>
                  <li>
                    ❹ Build a &ldquo;turn off the lights&rdquo; widget that
                    frames any section
                  </li>
                  <li>❺ Drive a simple modal without writing modal code</li>
                </ul>
                <p>
                  You learn one API and reuse it for half a dozen jobs you would
                  otherwise solve with separate libraries and separate bugs.
                </p>

                <h2 id="wiring-into-ai-app">Wiring it into an AI-built app</h2>
                <p>
                  If you built your product by prompting an AI, this fits your
                  workflow. You do not need to master a framework. You need three
                  things: the file, a list of selectors, and your copy.
                </p>
                <p>
                  Ask your assistant to install driver.js, then describe the path
                  in plain language. &ldquo;Highlight the new-project button
                  first, then the share menu, then the export icon.&rdquo; Paste
                  the selectors it returns. Write the popover text yourself,
                  because that text is your product voice and the model does not
                  know it yet. Trigger the tour the first time someone logs in,
                  store a flag in local storage so it runs once, and you have
                  onboarding that plenty of funded startups still skip.
                </p>

                <h2 id="why-it-belongs">Why it belongs in your stack</h2>
                <p>
                  You care about activation. You want the first session to end
                  with a user who gets the product. Driver.js gives you that for
                  the price of one small file and an afternoon of writing steps.
                  It is free, it is light, it is written in TypeScript, and it
                  works the same in every browser.
                </p>
                <p>
                  For a solo founder shipping fast with AI, that combination is
                  rare. Grab the code, point it at your three most important
                  buttons, and watch how many more users make it past the first
                  screen. When you want the interface those tours point at to
                  look sharp, the rest of our{" "}
                  <Link href="/freebies">free Figma resources</Link> and{" "}
                  <Link href="/code">design and code kits</Link> are built for
                  the same fast, solo-founder workflow.
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
