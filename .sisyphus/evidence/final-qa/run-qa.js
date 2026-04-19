const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = path.join(__dirname);
const BASE_URL = 'http://localhost:3000';

const SLUGS = [
  'accordion-ui-design',
  'button-ui-design',
  'how-to-design-landing',
  'figma-tables-data-grid-design',
  'dashboard-design-best-practices-top-dashboard-ui-design-tips',
  'tabs-ui-design',
  'toggle-switch-ui-design',
  'settings-ui-design',
];

async function testPost(slug) {
  const url = `${BASE_URL}/blog/${slug}`;
  const consoleErrors = [];
  const result = {
    slug,
    url,
    status: null,
    h1Visible: false,
    h1Text: null,
    headerVisible: false,
    footerVisible: false,
    ogType: false,
    ogTitle: false,
    ogImage: false,
    twitterCard: false,
    jsonLd: false,
    jsonLdType: false,
    canonical: false,
    consoleErrors: [],
    screenshot: null,
    pass: false,
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message.split('\n')[0]);
  });

  let response;
  try {
    response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    result.status = response ? response.status() : null;
  } catch (e) {
    result.error = `Navigation error: ${e.message}`;
    await browser.close();
    return result;
  }

  await page.waitForTimeout(1500);

  try {
    await page.waitForSelector('h1', { timeout: 10000 });
    const h1 = await page.$('h1');
    if (h1) {
      result.h1Visible = await h1.isVisible();
      result.h1Text = (await h1.textContent() || '').trim();
    }
  } catch (e) {
    result.h1Error = `H1 not found`;
  }

  try {
    const header = await page.$('[role="banner"], .navbar.w-nav, .navbar');
    if (header) {
      result.headerVisible = await header.isVisible();
    }
  } catch (e) {
    result.headerError = e.message;
  }

  try {
    const footer = await page.$('.footer, footer');
    if (footer) {
      result.footerVisible = await footer.isVisible();
    }
  } catch (e) {
    result.footerError = e.message;
  }

  const html = await page.content();

  result.ogType = html.includes('og:type') && (html.includes('"article"') || html.includes("'article'") || html.includes('content="article"') || html.includes("content='article'"));
  result.ogTitle = html.includes('og:title');
  result.ogImage = html.includes('og:image');
  result.twitterCard = html.includes('twitter:card') && html.includes('summary_large_image');
  result.canonical = html.includes('<link rel="canonical"') || html.includes("<link rel='canonical'");
  result.jsonLd = html.includes('application/ld+json');
  result.jsonLdType = html.includes('"@type":"BlogPosting"') || html.includes('"@type": "BlogPosting"');

  const screenshotPath = path.join(EVIDENCE_DIR, `${slug}.png`);
  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
    result.screenshot = screenshotPath;
  } catch (e) {
    result.screenshotError = e.message;
  }

  result.consoleErrors = consoleErrors;
  result.pass = (
    result.status === 200 &&
    result.h1Visible &&
    result.headerVisible &&
    result.footerVisible &&
    result.ogType &&
    result.ogTitle &&
    result.ogImage &&
    result.twitterCard &&
    result.jsonLd &&
    result.jsonLdType &&
    result.canonical
  );

  await browser.close();
  return result;
}

async function test404() {
  const url = `${BASE_URL}/blog/nonexistent-xyz-123456`;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  let status = null;
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    status = response ? response.status() : null;
  } catch (e) {
    status = null;
  }
  await browser.close();
  return { url, status, pass: status === 404 };
}

async function main() {
  const report = {
    timestamp: new Date().toISOString(),
    posts: [],
    edgeCases: {},
    summary: {},
  };

  console.log('Starting QA tests...\n');

  for (const slug of SLUGS) {
    process.stdout.write(`Testing: ${slug} ... `);
    const result = await testPost(slug);
    report.posts.push(result);
    
    const icon = result.pass ? '✅' : '❌';
    console.log(`${icon}`);
    console.log(`  HTTP ${result.status} | H1: ${result.h1Visible ? '✅' : '❌'} "${result.h1Text ? result.h1Text.slice(0, 50) : 'N/A'}" | header: ${result.headerVisible ? '✅' : '❌'} | footer: ${result.footerVisible ? '✅' : '❌'}`);
    console.log(`  OG[type:${result.ogType ? '✅' : '❌'} title:${result.ogTitle ? '✅' : '❌'} img:${result.ogImage ? '✅' : '❌'}] Twitter:${result.twitterCard ? '✅' : '❌'} JSON-LD:${result.jsonLd ? '✅' : '❌'} BlogPosting:${result.jsonLdType ? '✅' : '❌'} Canonical:${result.canonical ? '✅' : '❌'}`);
    if (result.consoleErrors.length) {
      console.log(`  ⚠️  Console errors (${result.consoleErrors.length}): ${result.consoleErrors[0].slice(0, 80)}...`);
    }
    if (result.error) console.log(`  ❗ Error: ${result.error}`);
  }

  console.log('\nTesting 404 edge case...');
  const result404 = await test404();
  report.edgeCases.notFound = result404;
  console.log(`  ${result404.pass ? '✅' : '❌'} 404 test: got HTTP ${result404.status}`);

  const figmaResult = report.posts.find(r => r.slug === 'figma-tables-data-grid-design');
  report.edgeCases.figmaTablesFixed = {
    status: figmaResult ? figmaResult.status : null,
    pass: figmaResult ? figmaResult.status === 200 : false,
  };

  const passCount = report.posts.filter(r => r.pass).length;
  const ogPassCount = report.posts.filter(r => r.ogType && r.ogTitle && r.ogImage && r.twitterCard).length;
  const jsonLdPassCount = report.posts.filter(r => r.jsonLd && r.jsonLdType).length;
  const screenshotCount = report.posts.filter(r => r.screenshot).length;
  const allConsoleErrors = report.posts.flatMap(r => r.consoleErrors.map(e => `[${r.slug}] ${e.slice(0, 80)}`));

  report.summary = {
    urlsPass: `${passCount}/8`,
    ogPass: `${ogPassCount}/8`,
    jsonLdPass: `${jsonLdPassCount}/8`,
    screenshots: `${screenshotCount} saved`,
    notFoundTest: result404.pass ? 'PASS' : 'FAIL',
    figmaTablesStatus: figmaResult ? figmaResult.status : 'UNKNOWN',
    consoleErrors: allConsoleErrors,
    verdict: passCount === 8 && result404.pass ? 'APPROVE' : 'REJECT',
  };

  const reportPath = path.join(EVIDENCE_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('FINAL QA REPORT');
  console.log('='.repeat(60));
  console.log(`URLs: [${report.summary.urlsPass} pass]`);
  console.log(`OG: [${report.summary.ogPass}]`);
  console.log(`JSON-LD: [${report.summary.jsonLdPass} valid]`);
  console.log(`Screenshots: [${report.summary.screenshots}]`);
  console.log(`404 test: [${report.summary.notFoundTest}]`);
  console.log(`figma-tables fixed: [${report.summary.figmaTablesStatus}]`);
  console.log(`Console errors: [${allConsoleErrors.length === 0 ? '0' : allConsoleErrors.length + ' error(s) — see report.json'}]`);
  console.log(`VERDICT: ${report.summary.verdict}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
