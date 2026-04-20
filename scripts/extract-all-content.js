const fs = require('fs');
const path = require('path');

const legacyDir = path.join(__dirname, '../legacy-pages/templates');
const outputDir = path.join(__dirname, '../data/template-content');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(legacyDir).filter(f => f.endsWith('.html') && f !== 'template-of-templates.html');

function decodeHtml(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<br\s*\/?>/gi, '<br/>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFeatures(html) {
  const features = [];

  // Find the features section
  const sectionMatch = html.match(/<div class="template_4colm-cards">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
  if (!sectionMatch) return features;

  const sectionHtml = sectionMatch[1];

  // Match each card - they end with </div></div>
  const cardRegex = /<div class="template_4colm-card"[^>]*>[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<p class="heading-style-h5[^"]*">[\s\S]*?(?:<strong>)?([^<]+)(?:<\/strong>)?<\/p>\s*<p>([^<]+)<\/p>/g;

  let match;
  while ((match = cardRegex.exec(sectionHtml)) !== null) {
    const image = match[1].replace(/^\.\./, '');
    const title = decodeHtml(match[2]);
    const description = decodeHtml(match[3]);

    if (title) {
      features.push({ title, description, image });
    }
  }

  return features;
}

function extractFaq(html) {
  const faqItems = [];
  const faqSection = html.match(/<div class="faq_component">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);

  if (!faqSection) return faqItems;

  const faqHtml = faqSection[1];
  const itemRegex = /<div class="faq_item-wrapper">([\s\S]*?)<div class="faq_shadow-closed"><\/div>/g;

  let match;
  while ((match = itemRegex.exec(faqHtml)) !== null) {
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

  // Find the tabs section
  const tabsMatch = html.match(/<div class="template_before-after-tabs[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
  if (!tabsMatch) return tabs;

  // Extract tab labels
  const labelRegex = /<a[^>]*class="button-small tab[^"]*"[^>]*data-w-tab="([^"]+)"[^>]*>\s*<div[^>]*>([^<]+)<\/div>/g;
  const labels = new Map();
  let match;
  while ((match = labelRegex.exec(html)) !== null) {
    labels.set(match[1], match[2].trim());
  }

  // Extract splitter content from each tab pane
  const paneRegex = /<div[^>]*class="w-tab-pane[^"]*"[^>]*data-w-tab="([^"]+)"[^>]*>[\s\S]*?<div[^>]*class="splitter_component([^"]*)"[^>]*>[\s\S]*?dc-splitter="before"[^>]*>\s*<img[^>]*src="([^"]+)"[\s\S]*?dc-splitter="after"[^>]*>\s*<img[^>]*src="([^"]+)"/g;

  while ((match = paneRegex.exec(html)) !== null) {
    const tabId = match[1];
    const heightClassMatch = match[2].match(/is-height-(\d+)/);
    const label = labels.get(tabId) || tabId;

    tabs.push({
      id: tabId.toLowerCase().replace(/\s+/g, '-'),
      label,
      beforeImage: match[3].replace(/^\.\./, ''),
      afterImage: match[4].replace(/^\.\./, ''),
      heightClass: heightClassMatch ? `is-height-${heightClassMatch[1]}` : undefined,
    });
  }

  return tabs;
}

function extractVideo(html) {
  const match = html.match(/youtube[^"]*\/embed\/([^"?]+)/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function extractPricing(html) {
  const cards = [];

  // Find pricing section - look for "Get started" heading followed by template_2col-cards
  const pricingSection = html.match(/<h2[^>]*>Get started[^<]*<\/h2>[\s\S]*?<div class="template_2col-cards">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);

  if (!pricingSection) return cards;

  const pricingHtml = pricingSection[1];

  // Split by template-list-item divs
  const cardMatches = pricingHtml.split(/<div class="template-list-item">/);

  for (let i = 1; i < cardMatches.length; i++) {
    const card = cardMatches[i];

    // Title may have <strong> tags inside
    const titleMatch = card.match(/<p class="heading-style-h5 text-color-dark-primary"[^>]*>(?:<strong>)?([^<]+)(?:<\/strong>)?<\/p>/);
    const descMatch = card.match(/<p class="text-size-regular">([^<]+)<\/p>/);
    const imgMatch = card.match(/<div class="template-list-item-img-wr[^"]*"[^>]*>\s*<img[^>]*src="([^"]+)"/);

    // Get buy button
    const buyMatch = card.match(/<a[^>]*class="button-small[^"]*w-inline-block"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<div[^>]*>([^<]+)<\/div>/);

    // Get preview button
    const previewMatch = card.match(/<a[^>]*class="button-small outlined[^"]*"[^>]*href="([^"]+)"/);

    if (titleMatch && imgMatch) {
      const buyLabel = buyMatch ? buyMatch[2].trim() : 'Buy now';
      const priceMatch = buyLabel.match(/\$\d+/);

      cards.push({
        title: decodeHtml(titleMatch[1]),
        description: descMatch ? decodeHtml(descMatch[1]) : '',
        image: imgMatch[1].replace(/^\.\./, ''),
        buyLabel: buyLabel.replace(/\$\d+/, '').trim() || 'Buy now',
        price: priceMatch ? priceMatch[0] : undefined,
        buyHref: buyMatch ? buyMatch[1] : '',
        previewHref: previewMatch ? previewMatch[1] : undefined,
      });
    }
  }

  return cards;
}

function extractHeading(html, sectionClass) {
  const regex = new RegExp(`<div class="heading-center-wr ${sectionClass}"[^>]*>\\s*<h2[^>]*>([\\s\\S]*?)<\\/h2>\\s*<div[^>]*>([^<]+)<\\/div>`, 'i');
  const match = html.match(regex);
  if (match) {
    return {
      title: decodeHtml(match[1].replace(/<[^>]+>/g, '')),
      subtitle: decodeHtml(match[2])
    };
  }
  return null;
}

function extractCarousel(html) {
  const carousels = [];

  // Find carousel sections with splide image-gallery
  const carouselRegex = /<div class="heading-left-text-wr[^"]*">\s*<h2[^>]*>([\s\S]*?)<\/h2>\s*<div[^>]*>([^<]+)<\/div>[\s\S]*?<div class="splide image-gallery">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

  let match;
  while ((match = carouselRegex.exec(html)) !== null) {
    const titleHtml = match[1];
    const subtitle = decodeHtml(match[2]);
    const carouselHtml = match[3];

    // Extract preview link if exists
    const linkMatch = titleHtml.match(/<a[^>]*href="([^"]+)"[^>]*>Preview<\/a>\s*([^<]+)/);
    const title = linkMatch ? decodeHtml(linkMatch[2]) : decodeHtml(titleHtml.replace(/<[^>]+>/g, ''));
    const previewLink = linkMatch ? linkMatch[1] : undefined;

    // Extract images
    const images = [];
    const imgRegex = /<div class="splide__slide[^"]*">\s*<img[^>]*src="([^"]+)"/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(carouselHtml)) !== null) {
      images.push({ image: imgMatch[1].replace(/^\.\./, '') });
    }

    if (images.length > 0) {
      carousels.push({ title, subtitle, previewLink, items: images });
    }
  }

  return carousels;
}

function extractGallery(html) {
  const galleries = [];

  // Find gallery sections - look for template_img-gallery and extract nearby heading
  // Split by sections to avoid crossing section boundaries
  const sectionRegex = /<div class="section[^"]*is-overflow-hidden[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

  let sectionMatch;
  while ((sectionMatch = sectionRegex.exec(html)) !== null) {
    const sectionHtml = sectionMatch[1];

    // Check if this section has template_img-gallery (not splide)
    if (!sectionHtml.includes('template_img-gallery') || sectionHtml.includes('splide image-gallery')) {
      continue;
    }

    // Extract heading
    const headingMatch = sectionHtml.match(/<div class="heading-left-text-wr[^"]*">\s*<h2[^>]*>([\s\S]*?)<\/h2>\s*<div[^>]*>([^<]+)<\/div>/);
    if (!headingMatch) continue;

    const titleHtml = headingMatch[1];
    const subtitle = decodeHtml(headingMatch[2]);

    // Extract preview link if exists
    const linkMatch = titleHtml.match(/<a[^>]*href="([^"]+)"[^>]*>Preview<\/a>\s*([^<]+)/);
    const title = linkMatch ? decodeHtml(linkMatch[2]) : decodeHtml(titleHtml.replace(/<[^>]+>/g, ''));
    const previewLink = linkMatch ? linkMatch[1] : undefined;

    // Extract images with titles
    const items = [];
    const itemRegex = /<div class="template_img-gallery-item">[\s\S]*?<img[^>]*src="([^"]+)"[\s\S]*?<p class="heading-style-h4">([^<]+)<\/p>/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(sectionHtml)) !== null) {
      items.push({
        image: itemMatch[1].replace(/^\.\./, ''),
        title: decodeHtml(itemMatch[2])
      });
    }

    if (items.length > 0) {
      galleries.push({ title, subtitle, previewLink, items });
    }
  }

  return galleries;
}

for (const file of files) {
  const slug = file.replace('.html', '');
  if (slug === 'charts') continue; // Already done manually

  const html = fs.readFileSync(path.join(legacyDir, file), 'utf8');

  const features = extractFeatures(html);
  const faq = extractFaq(html);
  const tabs = extractSplitterTabs(html);
  const videoUrl = extractVideo(html);
  const pricing = extractPricing(html);
  const carousels = extractCarousel(html);
  const galleries = extractGallery(html);

  const videoHeading = extractHeading(html, 'is-template-page');
  const tabsHeading = extractHeading(html, 'is-template-page2');

  // Extract pricing heading
  const pricingHeadingMatch = html.match(/<h2[^>]*>Get started[^<]*<\/h2>\s*<div[^>]*>(?:<strong>)?([^<]+)(?:<\/strong>)?<\/div>/);
  const pricingSubtitle = pricingHeadingMatch ? decodeHtml(pricingHeadingMatch[1]) : '';

  const content = {
    features,
    ...(videoUrl && {
      video: {
        url: videoUrl,
        title: videoHeading?.title || '',
        subtitle: videoHeading?.subtitle || '',
      }
    }),
    ...(carousels.length > 0 && { carousels }),
    ...(galleries.length > 0 && { galleries }),
    ...(tabs.length > 0 && {
      tabsSection: {
        title: tabsHeading?.title || '',
        subtitle: tabsHeading?.subtitle || '',
        tabs,
      }
    }),
    ...(pricing.length > 0 && {
      pricing: {
        title: 'Get started⚡',
        subtitle: pricingSubtitle,
        cards: pricing,
      }
    }),
    faq,
  };

  const varName = slug.replace(/-/g, '_') + 'Content';
  const output = `export const ${varName} = ${JSON.stringify(content, null, 2)};
`;

  fs.writeFileSync(path.join(outputDir, `${slug}.ts`), output);
  console.log(`Created ${slug}.ts (features: ${features.length}, carousels: ${carousels.length}, galleries: ${galleries.length}, tabs: ${tabs.length}, pricing: ${pricing.length}, faq: ${faq.length})`);
}

console.log('Done!');
