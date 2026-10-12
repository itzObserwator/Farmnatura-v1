/** Existing redesigned pages retain crawlable URLs and prerendered metadata. */
export const routePaths = {
  story: "/about-us",
  farming: "/natural-farming",
  living: "/farmhouses-for-sale-in-hyderabad",
  gallery: "/gallery",
  impact: "/involve-indulge-impact",
  home: "/",
} as const;
export type PageId = Exclude<keyof typeof routePaths, "home">;
const description =
  "Discover Farm Natura, a managed natural farming estate in Kandukur near Hyderabad. Own your land, grow your food, and reconnect with nature.";
export const pageMetadata = {
  home: { title: "Farm Natura — A Life Rooted in Nature", description },
  story: { title: "Our Story — Farm Natura", description },
  farming: { title: "Natural Farming — Farm Natura", description },
  living: { title: "Farm Life — Farm Natura", description },
  gallery: { title: "Gallery — Farm Natura", description },
  impact: {
    title: "Rooted in Purpose — Farm Natura",
    description:
      "Discover Farm Natura’s founder’s vision, research, inspirations, mission and awards. Explore natural farm living, plot options and legal documentation.",
  },
} as const;
