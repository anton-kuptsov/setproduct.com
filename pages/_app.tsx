import "../styles/globals.css";
import type { AppProps } from "next/app";
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
      <Component {...pageProps} />
    </ContactModalProvider>
  );
}
