import { lazy } from "react";
// Prerender complete views on the server; fetch alternate views only when used.
export const IntroView = import.meta.env.SSR
  ? (await import("./Intro")).default
  : lazy(() => import("./Intro"));
export const CarouselView = import.meta.env.SSR
  ? (await import("./ChapterCarousel")).default
  : lazy(() => import("./ChapterCarousel"));
export const GalleryView = import.meta.env.SSR
  ? (await import("./GalleryPage")).default
  : lazy(() => import("./GalleryPage"));
export const FarmingLayoutView = import.meta.env.SSR
  ? (await import("./NaturalFarmingLayout")).default
  : lazy(() => import("./NaturalFarmingLayout"));
export const FarmLifeLayoutView = import.meta.env.SSR
  ? (await import("./FarmLifeLayout")).default
  : lazy(() => import("./FarmLifeLayout"));
