"use client";

import { useEffect, useRef } from "react";
import { useContactModal } from "../modals/ContactModalContext";

type Props = {
  html: string;
};

export default function LegacyHtmlSection({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openContactModal } = useContactModal();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize Webflow-style tabs
    initializeTabs(container);

    // Initialize dc-splitter (before/after comparison)
    initializeSplitters(container);

    // Initialize FAQ accordions
    initializeFaqAccordions(container);

    // Handle contact modal triggers
    const modalTriggers = container.querySelectorAll('[data-remodal-target="modal2"]');
    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        openContactModal();
      });
    });

    return () => {
      modalTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", () => {});
      });
    };
  }, [html, openContactModal]);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function initializeTabs(container: HTMLElement) {
  const tabMenus = container.querySelectorAll(".w-tab-menu");

  tabMenus.forEach((menu) => {
    const tabLinks = menu.querySelectorAll(".w-tab-link");
    const tabContent = menu.nextElementSibling;
    if (!tabContent) return;

    const tabPanes = tabContent.querySelectorAll(".w-tab-pane");

    tabLinks.forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active from all tabs
        tabLinks.forEach((l) => l.classList.remove("w--current"));
        tabPanes.forEach((p) => p.classList.remove("w--tab-active"));

        // Add active to clicked tab
        link.classList.add("w--current");
        if (tabPanes[index]) {
          tabPanes[index].classList.add("w--tab-active");
        }
      });
    });
  });
}

function initializeSplitters(container: HTMLElement) {
  const splitters = container.querySelectorAll('[dc-splitter="splitter"]');

  splitters.forEach((splitter) => {
    const beforeEl = splitter.querySelector('[dc-splitter="before"]') as HTMLElement;
    const handleEl = splitter.querySelector('[dc-splitter="handle"]') as HTMLElement;

    if (!beforeEl || !handleEl) return;

    let isDragging = false;

    const updatePosition = (clientX: number) => {
      const rect = splitter.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);

      beforeEl.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      handleEl.style.left = `${percentage}%`;
    };

    // Set initial position
    beforeEl.style.position = "absolute";
    beforeEl.style.top = "0";
    beforeEl.style.left = "0";
    beforeEl.style.width = "100%";
    beforeEl.style.height = "100%";
    beforeEl.style.clipPath = "inset(0 50% 0 0)";
    beforeEl.style.zIndex = "2";

    handleEl.style.position = "absolute";
    handleEl.style.top = "0";
    handleEl.style.left = "50%";
    handleEl.style.transform = "translateX(-50%)";
    handleEl.style.height = "100%";
    handleEl.style.zIndex = "10";
    handleEl.style.cursor = "ew-resize";

    // Mouse events
    handleEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch events
    handleEl.addEventListener("touchstart", () => {
      isDragging = true;
    });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging || !e.touches[0]) return;
      updatePosition(e.touches[0].clientX);
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Click anywhere on splitter to move handle
    splitter.addEventListener("click", (e) => {
      updatePosition((e as MouseEvent).clientX);
    });
  });
}

function initializeFaqAccordions(container: HTMLElement) {
  const faqItems = container.querySelectorAll(".faq_item-wrapper");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq_question");
    const answer = item.querySelector(".faq_answer") as HTMLElement;

    if (!question || !answer) return;

    // Initially hide answers
    answer.style.maxHeight = "0";
    answer.style.overflow = "hidden";
    answer.style.transition = "max-height 0.3s ease";

    question.addEventListener("click", () => {
      const isOpen = answer.style.maxHeight !== "0px" && answer.style.maxHeight !== "0";

      // Close all other answers in this FAQ section
      const parentFaq = item.closest(".faq_component");
      if (parentFaq) {
        parentFaq.querySelectorAll(".faq_answer").forEach((a) => {
          (a as HTMLElement).style.maxHeight = "0";
        });
      }

      // Toggle current answer
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}
