/** Official Farm Natura gallery, locally optimized. Edit captions and categories here. */
export const galleryCategories = [
  "All moments",
  "Land & harvest",
  "Farm life",
  "Goshala",
] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
const collection: [string, string, Exclude<GalleryCategory, "All moments">][] =
  [
    ["farm", "A little closer to the land", "Land & harvest"],
    ["fnsi2", "An orchard taking root", "Land & harvest"],
    ["farmhouse", "A place to return to", "Farm life"],
    ["fnsi3", "Growing together, season by season", "Land & harvest"],
    ["fnsi16", "Good things grow slowly", "Land & harvest"],
    ["fnsi15", "A mother and her calf", "Goshala"],
    ["dining", "Gather around the table", "Farm life"],
    ["fnsi17", "A field full of sunshine", "Land & harvest"],
    ["fnsi14", "Made by hand, with care", "Farm life"],
    ["fnsi1", "Inside the goshala", "Goshala"],
    ["fnsi4", "Traditions at the farm", "Goshala"],
    ["fnsi5", "A quiet place to pause", "Farm life"],
    ["fnsi6", "Green spaces, open skies", "Farm life"],
    ["fnsi7", "A celebration at the goshala", "Goshala"],
    ["fnsi8", "New beginnings in the soil", "Land & harvest"],
    ["fnsi9", "Room to breathe", "Land & harvest"],
    ["fnsi10", "Life beneath the orchard trees", "Land & harvest"],
    ["fnsi11", "The farm pantry", "Farm life"],
    ["fnsi12", "Paths through the farmland", "Land & harvest"],
    ["fnsi13", "A different kind of weekend", "Farm life"],
    ["fnsi18", "Leaves reaching for the light", "Land & harvest"],
    ["fnsi19", "Colour from the kitchen garden", "Land & harvest"],
    ["fnsi20", "A small moment of stillness", "Farm life"],
    ["fnsi21", "The farm from above", "Farm life"],
    ["farmhouse2", "A home beside the fields", "Farm life"],
    ["goshala", "The heart of farm life", "Goshala"],
    ["goshalatopview", "Fields around the goshala", "Goshala"],
    ["openfarm", "Land, as far as the eye can wander", "Land & harvest"],
    ["openplace2", "Every season starts here", "Land & harvest"],
  ];
export const galleryPhotos = collection.map(([id, title, category]) => ({
  id,
  title,
  category,
  src: `/images/gallery/${id}.webp`,
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
