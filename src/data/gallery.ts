/** Photos supplied in public/images/gallery; film thumbnails stay in the Our Stories tab. */
import collection from "./galleryCollection.json";
import { galleryDimensions } from "./galleryDimensions";
export const galleryCategories = [
  "All moments",
  "Land & harvest",
  "Farm life",
] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
export const galleryPhotos = collection.map(({ id, title, category }) => ({
  id,
  title,
  category: category as Exclude<GalleryCategory, "All moments">,
  src: `/images/gallery/${id}.webp`,
  ...galleryDimensions[id],
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
