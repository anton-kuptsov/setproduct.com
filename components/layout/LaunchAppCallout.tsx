"use client";

import { useEffect, useState } from "react";

// Keep in sync with the [animation:launch-app-callout-fade-out_260ms…] duration below.
const EXIT_DURATION_MS = 260;

export default function LaunchAppCallout() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let exitTimer: number | null = null;

    const dismiss = () => {
      if (exitTimer !== null) return;
      setExiting(true);
      exitTimer = window.setTimeout(() => setVisible(false), EXIT_DURATION_MS);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };

    // Capture phase so the Launch App anchor's own click also dismisses
    // before the navigation handler runs.
    document.addEventListener("click", dismiss, { capture: true });
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("click", dismiss, { capture: true });
      document.removeEventListener("keydown", onKey);
      if (exitTimer !== null) window.clearTimeout(exitTimer);
    };
  }, []);

  if (!visible) return null;

  const animationClass = exiting ? "launch-app-callout-fade-out" : "swing-in-top-bck";

  return (
    <div
      data-launch-app-callout
      role="status"
      aria-live="polite"
      className={`pointer-events-none absolute right-0 top-[calc(100%+12px)] z-50 w-max max-w-[320px] rounded-xl bg-white px-4 py-3 font-sans text-[14px] leading-snug text-neutral-900 shadow-[0_1px_2px_rgba(15,15,15,0.06),0_8px_24px_rgba(15,15,15,0.12)] sm:max-w-[280px] ${animationClass}`}
    >
      <span
        aria-hidden="true"
        className="absolute right-7 top-[-7px] h-3.5 w-3.5 rotate-45 rounded-tl-[3px] bg-white shadow-[-1px_-1px_2px_rgba(15,15,15,0.05)]"
      />
      <span className="block whitespace-normal text-[14px] leading-snug">
        <span className="font-semibold">Open the AI UI library</span>
        <span>: Thousands of design references</span>
      </span>
    </div>
  );
}
