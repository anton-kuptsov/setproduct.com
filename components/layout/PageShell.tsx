import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

type PageShellProps = {
  contentHtml: string;
};

export default function PageShell({ contentHtml }: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <SiteFooter />
    </>
  );
}
