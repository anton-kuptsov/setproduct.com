import { useEffect, useState, type RefObject, type CSSProperties } from "react";

type StickyState = "static" | "fixed" | "stuck";

type UseStickyInContainerOptions = {
  topOffset?: number;
  enabled?: boolean;
};

export function useStickyInContainer(
  sidebarRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  options: UseStickyInContainerOptions = {}
) {
  const { topOffset = 80, enabled = true } = options;
  const [stickyState, setStickyState] = useState<StickyState>("static");
  const [dimensions, setDimensions] = useState<{ width: number; left: number } | null>(null);
  const [stuckTop, setStuckTop] = useState<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const sidebar = sidebarRef.current;
    const container = containerRef.current;
    if (!sidebar || !container) return;

    let dims = dimensions;
    if (!dims) {
      const rect = sidebar.getBoundingClientRect();
      dims = { width: rect.width, left: rect.left };
      setDimensions(dims);
    }

    const calculate = () => {
      if (!sidebar || !container) return;

      const containerRect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const stickyBottom = topOffset + sidebarHeight;

      if (containerTop >= topOffset) {
        setStickyState("static");
      } else if (containerBottom <= stickyBottom) {
        const finalTop = containerRect.height - sidebarHeight;
        setStuckTop(finalTop);
        setStickyState("stuck");
      } else {
        setStickyState("fixed");
      }
    };

    const handleScroll = () => requestAnimationFrame(calculate);
    const handleResize = () => {
      const rect = sidebar.getBoundingClientRect();
      setDimensions({ width: rect.width, left: rect.left });
      calculate();
    };

    calculate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [enabled, sidebarRef, containerRef, topOffset, dimensions]);

  const style: CSSProperties = (() => {
    if (!enabled || !dimensions) {
      return {};
    }

    switch (stickyState) {
      case "fixed":
        return {
          position: "fixed",
          top: topOffset,
          left: dimensions.left,
          width: dimensions.width,
        };
      case "stuck":
        return {
          position: "absolute",
          top: stuckTop,
          left: 0,
          width: dimensions.width,
        };
      default:
        return {};
    }
  })();

  return { style, stickyState };
}
