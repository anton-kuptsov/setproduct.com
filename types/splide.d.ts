declare module "@splidejs/react-splide" {
  import { ComponentType, ReactNode } from "react";

  export interface SplideProps {
    options?: {
      type?: string;
      perPage?: number;
      gap?: string;
      arrows?: boolean;
      pagination?: boolean;
      autoplay?: boolean;
      interval?: number;
      rewind?: boolean;
    };
    className?: string;
    "aria-label"?: string;
    children?: ReactNode;
  }

  export interface SplideSlideProps {
    className?: string;
    children?: ReactNode;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
}

declare module "@splidejs/react-splide/css/core";
