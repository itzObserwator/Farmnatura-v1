/** Photos supplied in public/images/gallery; film thumbnails stay in the Films tab. */
import { galleryDimensions } from "./galleryDimensions";
export const galleryCategories = [
  "All moments",
  "Land & harvest",
  "Farm life",
] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
const collection: [string, string, Exclude<GalleryCategory, "All moments">][] =
  [
    ["farm", "Farm fields from above", "Land & harvest"],
    ["farmhouse", "Farmhouses among the fields", "Farm life"],
    ["farmhouse2", "A farmhouse surrounded by greenery", "Farm life"],
    ["dining", "The farm dining pavilion", "Farm life"],
    ["goshala", "The goshala and its surroundings", "Farm life"],
    ["goshalatopview", "An aerial view of the goshala", "Farm life"],
    ["openfarm", "Open farmland and country paths", "Land & harvest"],
    ["openplace2", "A vegetable plot from above", "Land & harvest"],
    ["fnsi1", "Cattle resting in the goshala", "Farm life"],
    ["fnsi2", "A path through the orchard", "Land & harvest"],
    ["fnsi3", "Tending the vegetable rows", "Land & harvest"],
    ["fnsi4", "Preparing the farm's natural inputs", "Land & harvest"],
    ["fnsi5", "A gathering pavilion at the farm", "Farm life"],
    ["fnsi6", "A farmhouse and its garden", "Farm life"],
    ["fnsi7", "A quiet place of worship", "Farm life"],
    ["fnsi8", "New growth along the planting rows", "Land & harvest"],
    ["fnsi9", "Green fields under an open sky", "Land & harvest"],
    ["fnsi10", "Cultivated fields and orchard trees", "Land & harvest"],
    ["fnsi11", "Produce and provisions from the farm", "Farm life"],
    ["fnsi12", "Farm roads and fields from above", "Land & harvest"],
    ["fnsi13", "Tented stays beside the fields", "Farm life"],
    ["fnsi14", "Hands shaping clay on a pottery wheel", "Farm life"],
    ["fnsi15", "A cow and calf together", "Farm life"],
    ["fnsi16", "Bananas growing on the farm", "Land & harvest"],
    ["fnsi17", "Sunflowers in the field", "Land & harvest"],
    ["fnsi18", "Drumstick pods among the leaves", "Land & harvest"],
    ["fnsi19", "Tomatoes ripening on the vine", "Land & harvest"],
    ["fnsi20", "A water lily on the pond", "Farm life"],
    ["fnsi21", "An aerial view of the farm community", "Farm life"],
  ];
export const galleryPhotos = collection.map(([id, title, category]) => ({
  id,
  title,
  category,
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
