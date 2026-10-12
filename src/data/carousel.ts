import { chapters } from "./chapters";

/** One navigation order shared by the menu, footer and illustrated carousel. */
export const carouselDestinations = [
  chapters[0],
  {
    id: "impact",
    title: "Rooted in Purpose",
    tag: "A VISION ROOTED IN NATURE",
    color: "#f4efd9",
    art: "/illustrations/living-ecosystem-folk.webp",
    alt: "Folk art garden with vegetables, birds, pollinators and living roots",
  },
  chapters[1],
  chapters[2],
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
