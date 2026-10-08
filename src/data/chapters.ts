/** Farm Natura copy and artwork configuration. Change these values to update the three chapters. */
export const chapters = [
  {
    id: "story",
    number: "01",
    title: "Our Story",
    tag: "A LIFE ROOTED IN NATURE",
    color: "#e8efdd",
    art: "/illustrations/story-grove.webp",
    alt: "An original Indian folk-art mango grove with a mother and child sharing fruit",
    hero: ["A LITTLE CLOSER", "TO THE LAND.", "TO EACH OTHER."],
    subtitle:
      "The story of Farm Natura. A living farm, a slower rhythm, and a place to put down roots.",
    intro:
      "Somewhere between the soil and the sky, there is a life waiting to be lived. A life that grows with you.",
    body: "Farm Natura is a managed natural-farming estate in Kandukur, near Hyderabad. Here, families own their land, grow seasonal food, and return to the simple pleasure of spending time outdoors.",
    secondary:
      "By Planet Green Infra, Farm Natura brings natural farming and family life together. Dedicated agronomy staff care for everyday farming, leaving you more time to enjoy the land and the people you share it with.",
    section: "OUR ROOTS",
    statement: "Indulge. Involve. Impact nature.",
    photo: "/images/story-farmland.webp",
  },
  {
    id: "farming",
    number: "02",
    title: "Natural Farming",
    tag: "GOOD THINGS START IN THE SOIL",
    color: "#dce8cc",
    art: "/illustrations/farming-peppers.webp",
    alt: "Original botanical folk art of tomatoes, aubergines, bell peppers, okra, marigolds and living roots",
    hero: ["GROW FOOD.", "GROW HEALTH.", "GROW A LIFE."],
    subtitle:
      "Indigenous seeds, living soil, and the little lives that keep a farm thriving.",
    intro:
      "Care for the soil, and the soil cares for us. Good living begins with a little more earth.",
    body: "Our approach works with the natural rhythms of the land. Indigenous seeds, seasonal crops and fruit-bearing trees grow through chemical-free farming practices, with soil health at the heart of every season.",
    secondary:
      "Farm Natura describes more than six years of soil revitalisation and ongoing attention to soil health and microbiology. Visit the estate to meet the team and understand how the managed farming programme works.",
    section: "NATURALLY, TOGETHER",
    statement: "Rooted in living soil. Grown with care.",
    photo: "/images/farm-estate.webp",
  },
  {
    id: "living",
    number: "03",
    title: "Farm Life",
    tag: "GROW A LITTLE CLOSER",
    color: "#fff3b5",
    art: "/illustrations/living-harvest-moringa.webp",
    alt: "Original Indian folk-art family planting a seedling and harvesting tomatoes beneath a flowering moringa tree",
    hero: ["LESS HURRY.", "MORE NATURE.", "MORE LIFE."],
    subtitle:
      "Weekends under open skies. Family around the table. A little space to simply breathe.",
    intro:
      "A home away from the everyday hurry. Somewhere to make memories that last a little longer.",
    body: "Farm Natura makes room for a different rhythm of life: farmhouse stays, seasonal harvests, orchard walks and time with a community of like-minded neighbours. You own the land while a dedicated team manages everyday farming.",
    secondary:
      "Set along the Srisailam Highway corridor in Kandukur, the estate is close enough to return to on a weekend. Explore the farmhouse living concept, current availability and managed maintenance terms with the Farm Natura team.",
    section: "COME, WALK THE LAND",
    statement: "Close enough to visit. Far enough to breathe.",
    photo: "/images/farmhouse.webp",
  },
] as const;
export type Chapter = (typeof chapters)[number];
export type ChapterId = Chapter["id"];
