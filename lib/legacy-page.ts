import fs from "fs";
import path from "path";
import type { LegacyPageData } from "../types/legacy";

function extract(html: string, regex: RegExp): string {
  const match = html.match(regex);
  return match ? match[1] : "";
}

function rewriteLegacyLinks(markup: string): string {
  return markup
    .replace(/href="\.\.\/index\.html"/g, 'href="/"')
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="\/(blog|templates|freebies|dashboard-templates)\/([^"]+)\.html"/g, 'href="/$1/$2"')
    .replace(/href="\.\.\/(blog|templates|freebies|dashboard-templates)\/([^"]+)\.html"/g, 'href="/$1/$2"')
    .replace(/href="(blog|templates|freebies|dashboard-templates)\/([^"]+)\.html"/g, 'href="/$1/$2"')
    .replace(/href="\.\.\/legal\/license\.html"/g, 'href="/legal/license"')
    .replace(/href="\.\.\/legal\/refunds-policy\.html"/g, 'href="/legal/refunds-policy"')
    .replace(/href="\/legal\/license\.html"/g, 'href="/legal/license"')
    .replace(/href="\/legal\/refunds-policy\.html"/g, 'href="/legal/refunds-policy"');
}

function extractMatches(input: string, regex: RegExp, groupIndex = 1): string[] {
  return [...input.matchAll(regex)].map((match) => match[groupIndex] ?? "");
}

function stripScriptTags(markup: string): string {
  return markup.replace(/<script[\s\S]*?<\/script>/gi, "");
}

function extractHtmlBlockByClass(markup: string, className: string): string {
  const classMarker = `class="${className}"`;
  const classIndex = markup.indexOf(classMarker);

  if (classIndex === -1) {
    return "";
  }

  const openTagStart = markup.lastIndexOf("<", classIndex);
  if (openTagStart === -1) {
    return "";
  }

  const openTagEnd = markup.indexOf(">", openTagStart);
  if (openTagEnd === -1) {
    return "";
  }

  const openTagText = markup.slice(openTagStart, openTagEnd + 1);
  const tagMatch = openTagText.match(/^<([a-zA-Z0-9-]+)/);
  if (!tagMatch) {
    return "";
  }

  const tagName = tagMatch[1];
  const openTagRegex = new RegExp(`<${tagName}(\\s|>)`);
  const closeTagRegex = new RegExp(`</${tagName}>`);
  const combinedRegex = new RegExp(`</?${tagName}(\\s[^>]*|)>`, "g");

  let depth = 0;
  combinedRegex.lastIndex = openTagStart;

  for (const tag of markup.matchAll(combinedRegex)) {
    const tagText = tag[0];
    const tagStart = tag.index ?? 0;

    if (tagStart < openTagStart) {
      continue;
    }

    if (openTagRegex.test(tagText)) {
      depth += 1;
    } else if (closeTagRegex.test(tagText)) {
      depth -= 1;
      if (depth === 0) {
        return markup.slice(openTagStart, tagStart + tagText.length);
      }
    }
  }

  return "";
}

function stripLegacyLayout(bodyHtml: string): string {
  const headerHtml = extractHtmlBlockByClass(bodyHtml, "navbar w-nav");
  const footerHtml = extractHtmlBlockByClass(bodyHtml, "footer");

  let contentHtml = bodyHtml;

  if (headerHtml) {
    contentHtml = contentHtml.replace(headerHtml, "");
  }

  if (footerHtml) {
    contentHtml = contentHtml.replace(footerHtml, "");
  }

  return contentHtml;
}

export function buildLegacyPageData(relativePath: string): LegacyPageData {
  const htmlPath = path.join(process.cwd(), "legacy-pages", relativePath);
  const html = fs.readFileSync(htmlPath, "utf8");
  const head = extract(html, /<head[^>]*>([\s\S]*?)<\/head>/i);
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  const description = extract(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
  const canonical = extract(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
  const body = stripScriptTags(extract(html, /<body[^>]*>([\s\S]*?)<\/body>/i));
  const inlineStyles = extractMatches(head, /<style[^>]*>([\s\S]*?)<\/style>/gi);

  const bodyHtml = rewriteLegacyLinks(body);
  const contentHtml = stripLegacyLayout(bodyHtml);

  return {
    title,
    description,
    canonical,
    inlineStyles,
    contentHtml,
    bodyHtml,
  };
}
