/** Uploaded Farm Natura photos, optimized locally with their original resolution. */
export const galleryCategories = [
  "All moments",
  "Land & harvest",
  "Farm life",
] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
const collection: [string, string, Exclude<GalleryCategory, "All moments">][] =
  [
    ["story-farmland", "The land we return to", "Land & harvest"],
    ["farmhouse", "A little room to breathe", "Farm life"],
    ["living-fields", "Growing with the season", "Land & harvest"],
    ["sunflowers", "Sunshine between the rows", "Land & harvest"],
    ["farm-estate", "A life rooted in nature", "Farm life"],
    ["garden-planter", "Little details in the garden", "Farm life"],
  ];
export const galleryPhotos = collection.map(([id, title, category]) => ({
  id,
  title,
  category,
  src: `/images/${id}.webp`,
}));
/** These six YouTube IDs are linked by the official gallery. */
export const galleryVideos = [
  ["C_XpxL-KpOs", "Pragya Jaiswal on sustainable living"],
  ["owtXLPUAH9g", "Lavanya Tripathi on a greener life"],
  ["mgT9ySCyooc", "Nagarjuna in conversation with Shilpa Reddy"],
  ["tDs5icKaxQQ", "Shilpa Reddy on reconnecting with nature"],
  ["BY2d9W9o3t8", "Amala Akkineni on natural farming"],
  ["N7pTLiM0Zzo", "Sadhguru on sustainability"],
].map(([id, title]) => ({
  id,
  title,
  src: `https://www.youtube-nocookie.com/embed/${id}`,
  url: `https://www.youtube.com/watch?v=${id}`,
  poster: `/images/gallery/video-${id}.webp`,
}));
