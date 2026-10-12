import { lazy } from "react";
// Prerender complete views on the server; fetch alternate views only when used.
export const EntranceView = import.meta.env.SSR
  ? (await import("./FarmEntrance")).default
  : lazy(() => import("./FarmEntrance"));
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
