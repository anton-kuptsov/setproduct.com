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

async function takeScreenshot(slug) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(`${BASE_URL}/blog/${slug}`, { waitUntil: 'commit', timeout: 15000 });
    await page.waitForTimeout(800);
    const screenshotPath = path.join(EVIDENCE_DIR, `${slug}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`✅ ${slug}`);
    return screenshotPath;
  } catch (e) {
    console.log(`❌ ${slug}: ${e.message.split('\n')[0]}`);
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  let saved = 0;
  for (const slug of SLUGS) {
    const p = await takeScreenshot(slug);
    if (p) saved++;
  }
  
  const reportPath = path.join(EVIDENCE_DIR, 'report.json');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  let count = 0;
  report.posts.forEach(post => {
    const p = path.join(EVIDENCE_DIR, `${post.slug}.png`);
    if (fs.existsSync(p)) {
      post.screenshot = p;
      count++;
    }
  });
  report.summary.screenshots = `${count} saved`;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nScreenshots saved: ${saved}/8`);
  console.log('Report updated.');
}

main().catch(console.error);
