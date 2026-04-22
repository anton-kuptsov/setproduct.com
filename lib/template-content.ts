import fs from "fs";
import path from "path";

export function getTemplateMiddleHtml(slug: string): string {
  const htmlPath = path.join(process.cwd(), "legacy-pages", "templates", `${slug}.html`);

  if (!fs.existsSync(htmlPath)) {
    return "";
  }

  const content = fs.readFileSync(htmlPath, "utf-8");

  // Extract middle content (after hero/breadcrumbs, before footer sections)
  // This is a simplified extraction - adjust line numbers per template
  const lines = content.split("\n");

  // Find the start of middle content (after feature grid section around line 480)
  // Find the end before template showcase section (around line 855)
  const startLine = findSectionStart(lines, 'class="section"', 480);
  const endLine = findSectionEnd(lines, 'main_template-list-section', startLine);

  if (startLine === -1 || endLine === -1) {
    return "";
  }

  const middleHtml = lines.slice(startLine - 1, endLine - 1).join("\n");

  // Fix image paths from ../images/ to /images/
  return middleHtml.replace(/\.\.\/images\//g, "/images/");
}

function findSectionStart(lines: string[], marker: string, afterLine: number): number {
  for (let i = afterLine; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      return i + 1;
    }
  }
  return -1;
}

function findSectionEnd(lines: string[], marker: string, afterLine: number): number {
  for (let i = afterLine; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      return i;
    }
  }
  return -1;
}

export function getChartsTemplateHtml(): string {
  return getTemplateMiddleHtml("charts");
}
