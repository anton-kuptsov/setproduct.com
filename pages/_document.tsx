import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <link
          href="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/65cc9f6b13cfc5104fa9b88c_fav-32.jpg"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          href="/external/cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/65cc9f74c3e01c04ab839b0b_fav-256.jpg"
          rel="apple-touch-icon"
        />
        <link href="/css/normalize.css" rel="stylesheet" />
        <link href="/css/webflow.css" rel="stylesheet" />
        <link href="/css/setproduct.webflow.css" rel="stylesheet" />
        <link href="/css/setproduct.webflow.shared.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.2.2/dist/css/splide-core.min.css" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
