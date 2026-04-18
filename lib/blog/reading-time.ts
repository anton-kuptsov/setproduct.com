import readingTime from "reading-time";

/**
 * Strips MDX-specific syntax (frontmatter, import/export statements)
 * from content before calculating reading time.
 */
function stripMdxSyntax(content: string): string {
  // Strip YAML frontmatter (--- ... ---)
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, "");
  // Strip import/export statements
  const withoutImports = withoutFrontmatter.replace(
    /^(import|export)\s+.*$/gm,
    ""
  );
  return withoutImports;
}

export function computeReadingTime(
  markdownContent: string
): { text: string; minutes: number } {
  const cleaned = stripMdxSyntax(markdownContent);
  const stats = readingTime(cleaned);
  return {
    text: stats.text,
    minutes: Math.max(1, Math.round(stats.minutes)),
  };
}
