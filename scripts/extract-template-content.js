const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, '../legacy-pages/templates');
const outputDir = path.join(__dirname, '../data/template-content');

// Ensure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(legacyDir).filter(f => f.endsWith('.html') && f !== 'template-of-templates.html');

function extractText(html, regex) {
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

function extractAllMatches(html, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match);
  }
  return matches;
}

function decodeHtml(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<br\s*\/?>/g, '<br/>')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFaq(html) {
  const faqItems = [];
  const faqRegex = /<div class="faq_item-wrapper">([\s\S]*?)<div class="faq_shadow-closed"><\/div>/g;
  const matches = html.matchAll(faqRegex);

  for (const match of matches) {
    const item = match[1];
    const questionMatch = item.match(/<p class="text-size-regular">([^<]+)<\/p>/);
    const answerMatch = item.match(/<div class="faq_answer-wrapper">\s*<p class="text-size-small">([\s\S]*?)<\/p>\s*<\/div>/);

    if (questionMatch && answerMatch) {
      faqItems.push({
        question: decodeHtml(questionMatch[1]),
        answerHtml: decodeHtml(answerMatch[1]),
      });
    }
  }
  return faqItems;
}

function extractSplitterTabs(html) {
  const tabs = [];
  const tabLinkRegex = /<a[^>]*class="button-small tab[^"]*"[^>]*data-w-tab="([^"]+)"[^>]*>\s*<div class="text-size-small">([^<]+)<\/div>/g;
  const tabPaneRegex = /<div[^>]*class="w-tab-pane[^"]*"[^>]*data-w-tab="([^"]+)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?=<div[^>]*class="w-tab-pane|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/g;

  // Extract tab labels
  const labels = new Map();
  let match;
  while ((match = tabLinkRegex.exec(html)) !== null) {
    labels.set(match[1], match[2].trim());
  }

  // Extract splitter images from tab panes
  const splitterRegex = /<div[^>]*class="splitter_component[^"]*"[^>]*dc-splitter="splitter"[^>]*>[\s\S]*?<div[^>]*dc-splitter="before"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<div[^>]*dc-splitter="after"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"/g;

  const tabPanes = html.matchAll(/<div[^>]*class="w-tab-pane[^"]*"[^>]*data-w-tab="([^"]+)"[^>]*>([\s\S]*?)(?=<div[^>]*class="w-tab-pane|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="section)/g);

  for (const pane of tabPanes) {
    const tabId = pane[1];
    const content = pane[2];
    const label = labels.get(tabId) || tabId;

    const splitterMatch = content.match(/<div[^>]*class="splitter_component([^"]*)"[^>]*>[\s\S]*?<div[^>]*dc-splitter="before"[^>]*>\s*<img[^>]*src="([^"]+)"[\s\S]*?<div[^>]*dc-splitter="after"[^>]*>\s*<img[^>]*src="([^"]+)"/);

    if (splitterMatch) {
      const heightClassMatch = splitterMatch[1].match(/is-height-(\d+)/);
      tabs.push({
        id: tabId.toLowerCase().replace(/\s+/g, '-'),
        label,
        beforeImage: splitterMatch[2].replace(/^\.\./, ''),
        afterImage: splitterMatch[3].replace(/^\.\./, ''),
        heightClass: heightClassMatch ? `is-height-${heightClassMatch[1]}` : undefined,
      });
    }
  }

  return tabs;
}

function extractVideo(html) {
  const match = html.match(/youtube[^"]*\/embed\/([^"?]+)/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function extractPricing(html) {
  const cards = [];
  const cardRegex = /<div class="template-list-item">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*(?=<div class="template-list-item">|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/g;

  const matches = html.matchAll(cardRegex);
  for (const match of matches) {
    const card = match[1];
    const titleMatch = card.match(/<p class="heading-style-h5 text-color-dark-primary">([^<]+)<\/p>/);
    const descMatch = card.match(/<p class="text-size-regular">([^<]+)<\/p>/);
    const imgMatch = card.match(/<div class="template-list-item-img-wr[^"]*">\s*<img[^>]*src="([^"]+)"/);
    const buyMatch = card.match(/<a[^>]*class="button-small[^"]*"[^>]*href="([^"]+)"[^>]*>\s*<div[^>]*>([^<]+)<\/div>/);
    const previewMatch = card.match(/<a[^>]*class="button-small outlined[^"]*"[^>]*href="([^"]+)"/);

    if (titleMatch) {
      cards.push({
        title: decodeHtml(titleMatch[1]),
        description: descMatch ? decodeHtml(descMatch[1]) : '',
        image: imgMatch ? imgMatch[1].replace(/^\.\./, '') : '',
        buyLabel: buyMatch ? buyMatch[2].replace(/\$\d+/, '').trim() : 'Buy now',
        price: buyMatch && buyMatch[2].match(/\$\d+/) ? buyMatch[2].match(/\$\d+/)[0] : undefined,
        buyHref: buyMatch ? buyMatch[1] : '',
        previewHref: previewMatch ? previewMatch[1] : undefined,
      });
    }
  }
  return cards;
}

for (const file of files) {
  const slug = file.replace('.html', '');
  if (slug === 'charts') continue; // Already done

  const html = fs.readFileSync(path.join(legacyDir, file), 'utf8');

  const faq = extractFaq(html);
  const tabs = extractSplitterTabs(html);
  const videoUrl = extractVideo(html);
  const pricing = extractPricing(html);

  // Extract section headings
  const videoSectionMatch = html.match(/<div class="heading-center-wr is-template-page">\s*<h2[^>]*>([^<]+)<\/h2>\s*<div[^>]*>([^<]+)<\/div>/);
  const tabsSectionMatch = html.match(/<div class="heading-center-wr is-template-page2">\s*<h2[^>]*>([^<]+)<\/h2>\s*<div[^>]*>([^<]+)<\/div>/);

  const content = {
    ...(videoUrl && {
      video: {
        url: videoUrl,
        title: videoSectionMatch ? decodeHtml(videoSectionMatch[1]) : '',
        subtitle: videoSectionMatch ? decodeHtml(videoSectionMatch[2]) : '',
      }
    }),
    ...(tabs.length > 0 && {
      tabsSection: {
        title: tabsSectionMatch ? decodeHtml(tabsSectionMatch[1]) : '',
        subtitle: tabsSectionMatch ? decodeHtml(tabsSectionMatch[2]) : '',
        tabs,
      }
    }),
    ...(pricing.length > 0 && {
      pricing: {
        title: 'Get started⚡',
        subtitle: '',
        cards: pricing,
      }
    }),
    faq,
  };

  const output = `export const ${slug.replace(/-/g, '_')}Content = ${JSON.stringify(content, null, 2)};
`;

  fs.writeFileSync(path.join(outputDir, `${slug}.ts`), output);
  console.log(`Created ${slug}.ts`);
}

console.log('Done!');
