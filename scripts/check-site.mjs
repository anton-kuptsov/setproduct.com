#!/usr/bin/env node
// Site health checker:
// - Verifies every sitemap URL returns 200 on the target host
// - Scans each page for <a>, <img>, <source srcset>, <link>, <script>, og:image
// - Verifies all referenced URLs (internal + external + assets) return 2xx/3xx
//
// Usage:
//   node scripts/check-site.mjs [TARGET_ORIGIN]
//   TARGET_ORIGIN default: https://setproduct-com.vercel.app
//
// Output:
//   scripts/report.json  - full structured report
//   scripts/report.md    - human-readable summary

import fs from 'node:fs/promises';
import path from 'node:path';

const TARGET = (process.argv[2] || process.env.TARGET || 'https://setproduct-com.vercel.app').replace(/\/+$/, '');
const TARGET_HOST = new URL(TARGET).host;
const SITEMAP_HOSTS_TO_REWRITE = new Set(['www.setproduct.com', 'setproduct.com']);
const SITEMAP_URL = `${TARGET}/sitemap.xml`;

const PAGE_CONCURRENCY = Number(process.env.PAGE_CONCURRENCY || 12);
const ASSET_CONCURRENCY = Number(process.env.ASSET_CONCURRENCY || 24);
const REQUEST_TIMEOUT_MS = Number(process.env.TIMEOUT || 20000);
const MAX_RETRIES = 2;
const USER_AGENT = 'SetproductLinkChecker/1.0 (+https://setproduct.com)';

// --- helpers ---------------------------------------------------------------

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(new Error('timeout')), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: ctrl.signal,
      headers: {
        'user-agent': USER_AGENT,
        'accept-language': 'en-US,en;q=0.9',
        ...(options.headers || {}),
      },
      redirect: 'follow',
    });
  } finally {
    clearTimeout(t);
  }
}

async function checkUrl(url, { method = 'HEAD' } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      let res = await fetchWithTimeout(url, { method });
      // Some CDNs dislike HEAD or block it -> retry as GET
      if (method === 'HEAD' && (res.status === 405 || res.status === 403 || res.status === 501)) {
        res = await fetchWithTimeout(url, { method: 'GET' });
      }
      return {
        url,
        status: res.status,
        ok: res.status >= 200 && res.status < 400,
        finalUrl: res.url,
        contentType: res.headers.get('content-type') || '',
      };
    } catch (err) {
      lastErr = err;
      // retry on abort/network
      if (attempt < MAX_RETRIES) {
        await sleep(300 * (attempt + 1));
        continue;
      }
    }
  }
  return { url, status: 0, ok: false, error: String(lastErr?.message || lastErr) };
}

async function fetchPageHtml(url) {
  try {
    const res = await fetchWithTimeout(url, { method: 'GET', headers: { accept: 'text/html,*/*' } });
    const status = res.status;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      return { url, status, html: null, finalUrl: res.url, contentType };
    }
    const html = await res.text();
    return { url, status, html, finalUrl: res.url, contentType };
  } catch (err) {
    return { url, status: 0, html: null, error: String(err?.message || err) };
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function pool(items, worker, concurrency) {
  const results = new Array(items.length);
  let i = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      try {
        results[idx] = await worker(items[idx], idx);
      } catch (err) {
        results[idx] = { error: String(err?.message || err) };
      }
    }
  });
  await Promise.all(runners);
  return results;
}

// --- sitemap ---------------------------------------------------------------

function extractLocsFromSitemap(xml) {
  const locs = [];
  const re = /<loc>\s*([^<\s][^<]*?)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) locs.push(m[1].trim());
  return locs;
}

function rewriteToTarget(url) {
  try {
    const u = new URL(url);
    if (SITEMAP_HOSTS_TO_REWRITE.has(u.host)) {
      u.host = TARGET_HOST;
      u.protocol = new URL(TARGET).protocol;
    }
    return u.toString();
  } catch {
    return url;
  }
}

// --- HTML parsing ----------------------------------------------------------

function extractLinks(html, baseUrl) {
  const out = {
    anchors: new Set(),
    images: new Set(),
    assets: new Set(), // CSS / JS / fonts / preload
    meta: new Set(),   // og:image etc.
  };
  if (!html) return out;

  const decodeEntities = (s) =>
    s
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#x2F;/gi, '/')
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

  const abs = (raw) => {
    if (!raw) return null;
    const s = decodeEntities(raw.trim());
    if (!s) return null;
    if (s.startsWith('#')) return null;
    if (s.startsWith('javascript:') || s.startsWith('mailto:') || s.startsWith('tel:') || s.startsWith('data:')) return null;
    try {
      return new URL(s, baseUrl).toString();
    } catch {
      return null;
    }
  };

  // <a href="...">
  for (const m of html.matchAll(/<a\b[^>]*?\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)) {
    const href = m[1] ?? m[2] ?? m[3];
    const u = abs(href);
    if (u) out.anchors.add(u);
  }

  // <img src="...">
  for (const m of html.matchAll(/<img\b[^>]*?\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)) {
    const src = m[1] ?? m[2] ?? m[3];
    const u = abs(src);
    if (u) out.images.add(u);
  }

  // <img srcset="..."> & <source srcset="...">
  for (const m of html.matchAll(/<(?:img|source)\b[^>]*?\ssrcset\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi)) {
    const srcset = m[1] ?? m[2];
    if (!srcset) continue;
    for (const entry of srcset.split(',')) {
      const src = entry.trim().split(/\s+/)[0];
      const u = abs(src);
      if (u) out.images.add(u);
    }
  }

  // <link rel="..." href="..."> (stylesheets, icons, preload, manifest)
  for (const m of html.matchAll(/<link\b([^>]*?)>/gi)) {
    const attrs = m[1];
    const hrefMatch = attrs.match(/\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const relMatch = attrs.match(/\srel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const asMatch = attrs.match(/\sas\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3];
    const rel = (relMatch?.[1] ?? relMatch?.[2] ?? relMatch?.[3] ?? '').toLowerCase();
    const asAttr = (asMatch?.[1] ?? asMatch?.[2] ?? asMatch?.[3] ?? '').toLowerCase();
    const u = abs(href);
    if (!u) continue;
    // Skip DNS prefetch / preconnect (no real asset)
    if (rel.includes('dns-prefetch') || rel.includes('preconnect')) continue;
    if (rel.includes('icon') || asAttr === 'image') {
      out.images.add(u);
    } else {
      out.assets.add(u);
    }
  }

  // <script src="...">
  for (const m of html.matchAll(/<script\b[^>]*?\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)) {
    const src = m[1] ?? m[2] ?? m[3];
    const u = abs(src);
    if (u) out.assets.add(u);
  }

  // <meta property="og:image" content="..."> and twitter:image
  for (const m of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = m[1];
    const prop = attrs.match(/\s(?:property|name)\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const cont = attrs.match(/\scontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    const p = (prop?.[1] ?? prop?.[2] ?? '').toLowerCase();
    const c = cont?.[1] ?? cont?.[2];
    if (!p || !c) continue;
    if (p.includes('og:image') || p.includes('twitter:image')) {
      const u = abs(c);
      if (u) out.meta.add(u);
    }
  }

  return out;
}

// --- main ------------------------------------------------------------------

function isInternal(url) {
  try {
    return new URL(url).host === TARGET_HOST;
  } catch {
    return false;
  }
}

function classifyUrl(u) {
  try {
    const url = new URL(u);
    if (url.host !== TARGET_HOST) return 'external';
    const p = url.pathname;
    if (/\.(png|jpe?g|webp|avif|gif|svg|ico|bmp|tiff?)$/i.test(p)) return 'image';
    if (/\.(css|js|mjs|woff2?|ttf|otf|eot|map|json|xml|txt)$/i.test(p)) return 'asset';
    return 'page';
  } catch {
    return 'unknown';
  }
}

async function main() {
  console.log(`[check-site] target = ${TARGET}`);
  console.log(`[check-site] sitemap = ${SITEMAP_URL}`);

  // 1) Fetch sitemap
  const smRes = await fetchWithTimeout(SITEMAP_URL, { method: 'GET' });
  if (!smRes.ok) {
    console.error(`Sitemap fetch failed: ${smRes.status}`);
    process.exit(2);
  }
  const smXml = await smRes.text();
  const sitemapLocsOriginal = extractLocsFromSitemap(smXml);
  const sitemapUrls = [...new Set(sitemapLocsOriginal.map(rewriteToTarget))];
  console.log(`[check-site] sitemap URLs: ${sitemapUrls.length}`);

  // 2) Fetch each page, classify status, collect links
  console.log(`[check-site] crawling pages with concurrency=${PAGE_CONCURRENCY}`);
  const pageResults = await pool(sitemapUrls, async (url) => {
    const r = await fetchPageHtml(url);
    const ok = r.status >= 200 && r.status < 400;
    let links = { anchors: [], images: [], assets: [], meta: [] };
    if (ok && r.html) {
      const e = extractLinks(r.html, r.finalUrl || url);
      links = {
        anchors: [...e.anchors],
        images: [...e.images],
        assets: [...e.assets],
        meta: [...e.meta],
      };
    }
    return {
      url,
      finalUrl: r.finalUrl,
      status: r.status,
      ok,
      error: r.error,
      contentType: r.contentType,
      links,
    };
  }, PAGE_CONCURRENCY);

  const pagesFailed = pageResults.filter((p) => !p.ok);
  console.log(`[check-site] pages ok: ${pageResults.length - pagesFailed.length}/${pageResults.length}`);

  // 3) Collect all referenced URLs
  const allRefs = new Map(); // url -> Set<pageUrl>
  const addRef = (u, sourcePage) => {
    if (!u) return;
    if (!allRefs.has(u)) allRefs.set(u, new Set());
    allRefs.get(u).add(sourcePage);
  };

  for (const p of pageResults) {
    if (!p.ok) continue;
    for (const u of p.links.anchors) addRef(u, p.url);
    for (const u of p.links.images) addRef(u, p.url);
    for (const u of p.links.assets) addRef(u, p.url);
    for (const u of p.links.meta) addRef(u, p.url);
  }

  const allRefUrls = [...allRefs.keys()];
  console.log(`[check-site] unique referenced URLs: ${allRefUrls.length}`);

  // Skip HEAD-check on sitemap pages we already checked
  const alreadyChecked = new Map();
  for (const p of pageResults) alreadyChecked.set(p.url, p);

  const toCheck = allRefUrls.filter((u) => !alreadyChecked.has(u));
  console.log(`[check-site] checking referenced URLs with concurrency=${ASSET_CONCURRENCY}`);

  const refResults = await pool(toCheck, async (url) => {
    const res = await checkUrl(url, { method: 'HEAD' });
    return res;
  }, ASSET_CONCURRENCY);

  // Merge: treat pages already crawled as part of the pool
  const urlToResult = new Map();
  for (const r of refResults) urlToResult.set(r.url, r);
  for (const p of pageResults) {
    urlToResult.set(p.url, {
      url: p.url,
      status: p.status,
      ok: p.ok,
      finalUrl: p.finalUrl,
      error: p.error,
      contentType: p.contentType,
    });
  }

  // 4) Build report
  const broken = []; // { url, status, kind, sources:[] }
  for (const [u, srcSet] of allRefs) {
    const r = urlToResult.get(u);
    if (!r) continue;
    if (!r.ok) {
      broken.push({
        url: u,
        status: r.status,
        error: r.error,
        kind: classifyUrl(u),
        internal: isInternal(u),
        sources: [...srcSet].slice(0, 5),
        sourcesTotal: srcSet.size,
      });
    }
  }

  // Also include sitemap pages that failed (they may not be referenced anywhere)
  for (const p of pagesFailed) {
    broken.push({
      url: p.url,
      status: p.status,
      error: p.error,
      kind: 'sitemap-page',
      internal: true,
      sources: ['(sitemap.xml)'],
      sourcesTotal: 1,
    });
  }

  broken.sort((a, b) => {
    // internal first, then by kind
    if (a.internal !== b.internal) return a.internal ? -1 : 1;
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    return a.url.localeCompare(b.url);
  });

  const summary = {
    target: TARGET,
    sitemapUrls: sitemapUrls.length,
    pagesChecked: pageResults.length,
    pagesFailed: pagesFailed.length,
    referencedUrls: allRefUrls.length,
    refChecked: toCheck.length,
    brokenTotal: broken.length,
    brokenInternal: broken.filter((b) => b.internal).length,
    brokenExternal: broken.filter((b) => !b.internal).length,
    byKind: broken.reduce((acc, b) => {
      acc[b.kind] = (acc[b.kind] || 0) + 1;
      return acc;
    }, {}),
  };

  const report = { summary, broken, pagesFailed };

  const reportDir = path.dirname(new URL(import.meta.url).pathname);
  const jsonPath = path.join(reportDir, 'report.json');
  const mdPath = path.join(reportDir, 'report.md');
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));
  // Do not overwrite curated report.md if it exists.
  try {
    await fs.access(mdPath);
  } catch {
    await fs.writeFile(mdPath, renderMd(report));
  }

  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nFull report: ${jsonPath}`);
  console.log(`Markdown:    ${mdPath}`);

  if (summary.brokenInternal > 0 || summary.pagesFailed > 0) {
    process.exitCode = 1;
  }
}

function renderMd(report) {
  const { summary, broken } = report;
  const lines = [];
  lines.push(`# Site Health Report`);
  lines.push('');
  lines.push(`- Target: ${summary.target}`);
  lines.push(`- Sitemap URLs: ${summary.sitemapUrls}`);
  lines.push(`- Pages OK: ${summary.pagesChecked - summary.pagesFailed}/${summary.pagesChecked}`);
  lines.push(`- Referenced URLs: ${summary.referencedUrls}`);
  lines.push(`- **Broken total**: ${summary.brokenTotal} (internal: ${summary.brokenInternal}, external: ${summary.brokenExternal})`);
  lines.push(`- By kind: ${JSON.stringify(summary.byKind)}`);
  lines.push('');

  const internal = broken.filter((b) => b.internal);
  const external = broken.filter((b) => !b.internal);

  if (internal.length) {
    lines.push(`## Broken internal links (${internal.length})`);
    lines.push('');
    lines.push(`| Status | Kind | URL | Sample source |`);
    lines.push(`|---|---|---|---|`);
    for (const b of internal) {
      const src = b.sources[0] || '';
      const status = b.status || (b.error ? `ERR ${b.error}` : '0');
      lines.push(`| ${status} | ${b.kind} | \`${b.url}\` | \`${src}\` |`);
    }
    lines.push('');
  } else {
    lines.push(`## Broken internal links: none ✅`);
    lines.push('');
  }

  if (external.length) {
    lines.push(`## Broken external links (${external.length})`);
    lines.push('');
    lines.push(`| Status | URL | Sample source |`);
    lines.push(`|---|---|---|`);
    for (const b of external) {
      const src = b.sources[0] || '';
      const status = b.status || (b.error ? `ERR ${b.error}` : '0');
      lines.push(`| ${status} | \`${b.url}\` | \`${src}\` |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
