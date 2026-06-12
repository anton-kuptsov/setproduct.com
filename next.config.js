// On Vercel preview deployments (VERCEL_ENV === "preview") the image
// optimizer quota is easy to blow through, so serve raw files instead.
const isVercelPreview = process.env.VERCEL_ENV === "preview";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: isVercelPreview,
    // Сначала пробуем WebP (универсальная поддержка), AVIF — для современных браузеров.
    formats: ["image/webp", "image/avif"],
    // Сокращённый набор брекпоинтов: мобайл / таблет / десктоп / ретина-десктоп
    deviceSizes: [640, 1080, 1920],
    // Размеры для явно заданных width/height (иконки, аватары, thumbnails)
    imageSizes: [64, 256, 384],
  },
  async redirects() {
    const fs = require("fs");
    const path = require("path");

    // Webflow migration redirects — source of truth: data/webflow-redirects.csv.
    // Read once at build time; compiled into the redirects manifest.
    const csvPath = path.join(__dirname, "data/webflow-redirects.csv");
    const csvContent = fs.readFileSync(csvPath, "utf8");

    // split on \r?\n (Webflow export may use CRLF); slice(1) skips the header row.
    const webflowRedirects = csvContent
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const parts = line.split(",");
        if (parts.length !== 2) {
          console.warn(`[redirects] skip malformed CSV row ${i + 2}: "${line}"`);
          return null;
        }
        const source = parts[0].trim();
        const destination = parts[1].trim();
        if (!source.startsWith("/") || !destination.startsWith("/")) {
          console.warn(`[redirects] skip invalid CSV row ${i + 2}: "${line}"`);
          return null;
        }
        return { source, destination, permanent: true };
      })
      .filter(Boolean);

    return [
      // Specific .html rule must stay above the generic catch-all below.
      { source: "/index.html", destination: "/", permanent: true },

      // All Webflow CSV redirects (incl. page*.html) — ABOVE the generic .html
      // catch-all so the specific legacy page URLs resolve correctly.
      ...webflowRedirects,

      // Generic .html catch-all — AFTER the specific page*.html rules from CSV.
      { source: "/:path+.html", destination: "/:path+", permanent: true },

      // Deprecated dashboard D-posts merged into the pillar (Phase 4).
      {
        source: "/blog/dashboard-design-best-practices-top-dashboard-ui-design-tips",
        destination: "/blog/dashboard-ui-design",
        permanent: true,
      },
      {
        source: "/blog/why-are-dashboards-important",
        destination: "/blog/dashboard-ui-design",
        permanent: true,
      },
      {
        source: "/blog/benefits-of-dashboards",
        destination: "/blog/dashboard-ui-design",
        permanent: true,
      },
      {
        source: "/blog/marketing-dashboard-examples-templates",
        destination: "/blog/marketing-dashboard-ui-design-guide",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

module.exports = nextConfig;
