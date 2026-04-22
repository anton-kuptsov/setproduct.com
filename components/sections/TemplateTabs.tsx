"use client";

import { useState, useCallback, useRef, type KeyboardEvent } from "react";

type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  tabs: TabItem[];
  className?: string;
};

export default function TemplateTabs({ tabs, className = "" }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      let newIndex = activeIndex;

      switch (e.key) {
        case "ArrowLeft":
          newIndex = activeIndex === 0 ? tabs.length - 1 : activeIndex - 1;
          break;
        case "ArrowRight":
          newIndex = activeIndex === tabs.length - 1 ? 0 : activeIndex + 1;
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      setActiveIndex(newIndex);
      tabRefs.current[newIndex]?.focus();
    },
    [activeIndex, tabs.length]
  );

  return (
    <div className={`template_before-after-tabs ${className}`}>
      <div
        className="main_blog-liist1-tabs-wr is-template-before-after"
        role="tablist"
        aria-label="Template tabs"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            className={`button-small tab w-inline-block w-tab-link ${
              activeIndex === index ? "w--current" : ""
            }`}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
          >
            <div className="text-size-small">{tab.label}</div>
          </button>
        ))}
      </div>
      <div className="template_before-after-tabs-content">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={`w-tab-pane ${activeIndex === index ? "w--tab-active" : ""}`}
            hidden={activeIndex !== index}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
