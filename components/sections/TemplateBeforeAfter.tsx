"use client";

import { useState, useCallback, useRef, type MouseEvent, type TouchEvent } from "react";

type Props = {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  heightClass?: string;
};

export default function TemplateBeforeAfter({
  beforeImage,
  afterImage,
  beforeAlt = "Light theme",
  afterAlt = "Dark theme",
  heightClass = "is-height-729",
}: Props) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setPosition(percentage);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      updatePosition(e.touches[0].clientX);
    },
    [isDragging, updatePosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  return (
    <div
      ref={containerRef}
      className={`splitter_component ${heightClass}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Before image (light theme) */}
      <div
        className="splitter_before"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          clipPath: `inset(0 ${100 - position}% 0 0)`,
          zIndex: 3,
        }}
      >
        <img
          alt={beforeAlt}
          className="splitter_image"
          loading="lazy"
          src={beforeImage}
        />
      </div>

      {/* After image (dark theme) */}
      <div className=" spliter_after" style={{ width: "100%" }}>
        <img
          alt={afterAlt}
          className="splitter_image is-after"
          loading="lazy"
          src={afterImage}
        />
      </div>

      {/* Handle */}
      <div
        className="splitter_handle-component"
        style={{
          position: "absolute",
          top: 0,
          left: `${position}%`,
          transform: "translateX(-50%)",
          height: "100%",
          zIndex: 4,
          cursor: "ew-resize",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="splitter_handle-wrapper">
          <div className="circle-wrapper">
            <img
              alt=""
              className="image-cover hide-on-mobile"
              loading="lazy"
              src="/images/Buttons.svg"
            />
            <img
              alt=""
              className="image-cover hide-on-desktop"
              loading="lazy"
              src="/images/Buttons2.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
