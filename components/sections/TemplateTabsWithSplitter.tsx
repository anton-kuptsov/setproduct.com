"use client";

import TemplateTabs from "./TemplateTabs";
import TemplateBeforeAfter from "./TemplateBeforeAfter";

type SplitterTab = {
  id: string;
  label: string;
  beforeImage: string;
  afterImage: string;
  heightClass?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  previewLink?: string;
  tabs: SplitterTab[];
  defaultHeightClass?: string;
};

export default function TemplateTabsWithSplitter({
  title,
  subtitle,
  previewLink,
  tabs,
  defaultHeightClass = "is-height-729",
}: Props) {
  const tabItems = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    content: (
      <TemplateBeforeAfter
        beforeImage={tab.beforeImage}
        afterImage={tab.afterImage}
        beforeAlt={`${tab.label} Light`}
        afterAlt={`${tab.label} Dark`}
        heightClass={tab.heightClass || defaultHeightClass}
      />
    ),
  }));

  return (
    <div className="section is-overflow-hidden">
      <div className="section-padding top-80 bottom-80">
        <div className="container">
          {(title || subtitle) && (
            <div className="heading-center-wr is-template-page2">
              {title && (
                <h2 className="heading-style-h2">
                  {previewLink ? (
                    <>
                      <a
                        className="span-link"
                        href={previewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>{" "}
                      {title}
                    </>
                  ) : (
                    title
                  )}
                </h2>
              )}
              {subtitle && <div className="heading-style-h5 mob-18">{subtitle}</div>}
            </div>
          )}
          {(title || subtitle) && <div className="spacer-64" />}
          <TemplateTabs tabs={tabItems} />
        </div>
      </div>
    </div>
  );
}
