import { chapters } from "./chapters";

/** Navigation artwork is separate from the three editorial chapter pages. */
export const carouselDestinations = [
  ...chapters,
  {
    id: "gallery",
    title: "Gallery",
    tag: "LITTLE MOMENTS, LASTING MEMORIES",
    color: "#f4efd9",
    art: "/illustrations/gallery-memories.webp",
    alt: "Hand-drawn Indian family enjoying a farm photo album while a father photographs them beneath a flowering tree",
  },
] as const;
export type CarouselDestinationId = (typeof carouselDestinations)[number]["id"];
