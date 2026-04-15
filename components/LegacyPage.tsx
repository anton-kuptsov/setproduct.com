import Head from "next/head";
import PageShell from "./layout/PageShell";
import type { LegacyPageData } from "../types/legacy";

export default function LegacyPage({
  title,
  description,
  canonical,
  inlineStyles = [],
  contentHtml = "",
  bodyHtml,
}: LegacyPageData) {
  const pageContentHtml = contentHtml || bodyHtml;

  return (
    <>
      <Head>
        {title ? <title>{title}</title> : null}
        {description ? <meta content={description} name="description" /> : null}
        {canonical ? <link href={canonical} rel="canonical" /> : null}
        {inlineStyles.map((style, index) => (
          <style dangerouslySetInnerHTML={{ __html: style }} key={`legacy-style-${index}`} />
        ))}
      </Head>
      <PageShell contentHtml={pageContentHtml} />
    </>
  );
}
