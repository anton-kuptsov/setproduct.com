import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import https from 'https';
import http from 'http';

const BASE_URL = 'http://localhost:3000';
const EVIDENCE_DIR = '/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/.sisyphus/evidence/task-17-playwright';

const SLUGS = [
  'accordion-ui-design',
  'dashboard-design-best-practices-top-dashboard-ui-design-tips',
  'figma-tables-data-grid-design',
  'button-ui-design',
  'how-to-design-landing',
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, (res) => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(0));
    req.setTimeout(8000, () => { req.destroy(); resolve(0); });
  });
}

async function testPost(page, slug) {
  const url = `${BASE_URL}/blog/${slug}`;
  const result = {
    slug,
    url,
    h1_found: false,
    h1_text: '',
    header_found: false,
    footer_found: false,
    og_type: false,
    og_title: false,
    og_image: false,
    twitter_card: false,
    json_ld_found: false,
    json_ld_type: '',
    json_ld_valid: false,
    cover_url: '',
    cover_status: 0,
    cover_loads: false,
    console_errors: [],
    screenshot: `${slug}.png`,
    pass: false,
  };

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('h1', { timeout: 15000 });

    // H1
    const h1 = await page.$('h1');
    if (h1) {
      result.h1_found = true;
      result.h1_text = (await h1.textContent()).trim();
    }

    // Header — try multiple selectors
    const header = await page.$('header, [data-testid="header"], nav.site-header, .site-header');
    result.header_found = !!header;

    // Footer
    const footer = await page.$('footer, [data-testid="footer"], .site-footer');
    result.footer_found = !!footer;

    // OG / meta tags from DOM
    const ogType = await page.$('meta[property="og:type"]');
    result.og_type = !!ogType;

    const ogTitle = await page.$('meta[property="og:title"]');
    result.og_title = !!ogTitle;

    const ogImage = await page.$('meta[property="og:image"]');
    result.og_image = !!ogImage;

    const twitterCard = await page.$('meta[name="twitter:card"]');
    result.twitter_card = !!twitterCard;

    // JSON-LD
    const ldScript = await page.$('script[type="application/ld+json"]');
    if (ldScript) {
      result.json_ld_found = true;
      const ldText = await ldScript.textContent();
      try {
        const ldData = JSON.parse(ldText);
        result.json_ld_type = ldData['@type'] || '';
        result.json_ld_valid = ldData['@type'] === 'BlogPosting';
      } catch (e) {
        result.json_ld_valid = false;
      }
    }

    // Cover image — look for img in article or hero area
    const coverImg = await page.$('article img, .blog-hero img, main img, [class*="hero"] img, [class*="cover"] img');
    if (coverImg) {
      const src = await coverImg.getAttribute('src');
      if (src) {
        result.cover_url = src.startsWith('http') ? src : `${BASE_URL}${src}`;
        result.cover_status = await checkUrl(result.cover_url);
        result.cover_loads = result.cover_status === 200;
      }
    } else {
      // Some posts may not have cover images — check if cover served at standard path
      const coverPath = `/blog/covers/${slug}.jpg`;
      const coverUrl = `${BASE_URL}${coverPath}`;
      result.cover_url = coverUrl;
      result.cover_status = await checkUrl(coverUrl);
      result.cover_loads = result.cover_status === 200;
    }

    result.console_errors = [...consoleErrors];

    // Screenshot
    const screenshotPath = join(EVIDENCE_DIR, `${slug}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`  Screenshot saved: ${slug}.png`);

    // Overall pass: h1 + header + footer + og_title + json_ld_valid, no console errors
    result.pass = result.h1_found && result.header_found && result.footer_found
      && result.og_title && result.json_ld_valid && result.console_errors.length === 0;

  } catch (err) {
    result.error = err.message;
    result.console_errors = [...consoleErrors];
    console.error(`  ERROR for ${slug}: ${err.message}`);
  }

  return result;
}

async function test404(page) {
  const slug = 'definitely-nonexistent-slug-xyz123';
  const url = `${BASE_URL}/blog/${slug}`;
  let status = 0;
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    status = response ? response.status() : 0;
  } catch (err) {
    status = -1;
  }
  return { slug, url, status, pass: status === 404 };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  });

  const results = [];

  for (const slug of SLUGS) {
    console.log(`\nTesting: ${slug}`);
    const page = await context.newPage();
    const result = await testPost(page, slug);
    results.push(result);
    await page.close();

    console.log(`  h1: ${result.h1_found} "${result.h1_text?.substring(0, 60)}"`);
    console.log(`  header: ${result.header_found}, footer: ${result.footer_found}`);
    console.log(`  og_type: ${result.og_type}, og_title: ${result.og_title}, og_image: ${result.og_image}, twitter_card: ${result.twitter_card}`);
    console.log(`  json_ld: ${result.json_ld_found}, type: "${result.json_ld_type}", valid: ${result.json_ld_valid}`);
    console.log(`  cover: ${result.cover_url} => ${result.cover_status}`);
    console.log(`  console_errors: ${result.console_errors.length}`);
    console.log(`  PASS: ${result.pass}`);
  }

  // 404 test
  console.log('\nTesting 404...');
  const page404 = await context.newPage();
  const notFoundResult = await test404(page404);
  await page404.close();
  console.log(`  Status: ${notFoundResult.status}, PASS: ${notFoundResult.pass}`);

  // Screenshot of 404 page
  const page404ss = await context.newPage();
  await page404ss.goto(`${BASE_URL}/blog/definitely-nonexistent-slug-xyz123`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await page404ss.screenshot({ path: join(EVIDENCE_DIR, '404-test.png'), fullPage: true });
  await page404ss.close();

  await browser.close();

  // Build report
  const overallPass = results.every(r => r.pass) && notFoundResult.pass;

  const report = {
    timestamp: new Date().toISOString(),
    posts_tested: SLUGS.length,
    results: results.map(r => ({
      slug: r.slug,
      h1_found: r.h1_found,
      h1_text: r.h1_text,
      header_found: r.header_found,
      footer_found: r.footer_found,
      og_tags: r.og_type && r.og_title && r.og_image && r.twitter_card,
      og_type: r.og_type,
      og_title: r.og_title,
      og_image: r.og_image,
      twitter_card: r.twitter_card,
      json_ld_found: r.json_ld_found,
      json_ld_type: r.json_ld_type,
      json_ld_valid: r.json_ld_valid,
      cover_url: r.cover_url,
      cover_status: r.cover_status,
      cover_loads: r.cover_loads,
      console_errors: r.console_errors,
      screenshot: r.screenshot,
      pass: r.pass,
      error: r.error || undefined,
    })),
    '404_test': {
      slug: notFoundResult.slug,
      status: notFoundResult.status,
      pass: notFoundResult.pass,
    },
    overall: overallPass ? 'PASS' : 'FAIL',
  };

  writeFileSync(join(EVIDENCE_DIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log('\n=== REPORT SAVED ===');
  console.log(`Overall: ${report.overall}`);
  console.log(`Posts passed: ${results.filter(r => r.pass).length}/${SLUGS.length}`);
  console.log(`404 test: ${notFoundResult.pass ? 'PASS' : 'FAIL'}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
