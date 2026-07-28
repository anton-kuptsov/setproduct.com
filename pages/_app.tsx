import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ContactModalProvider } from "../components/modals/ContactModalContext";
import { GA_TRACKING_ID, pageview } from "../lib/gtag";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_TRACKING_ID) return;

    pageview(window.location.pathname);

    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ContactModalProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {GA_TRACKING_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                send_page_view: false,
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      ) : null}
      {/* Gumroad overlay: gumroad.js intercepts clicks on plain gumroad.com
          links (without target="_blank") and opens the product in an on-site
          popup instead of a new tab. */}
      <Script
        src="https://gumroad.com/js/gumroad.js"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </ContactModalProvider>
  );
}
