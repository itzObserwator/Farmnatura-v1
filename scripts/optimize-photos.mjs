import sharp from "sharp";
import { stat } from "node:fs/promises";
const photos = [
  ["Screenshot 2026-10-08 at 2.44.32 PM.png", "story-farmland"],
  ["Screenshot 2026-10-08 at 2.59.13 PM.png", "farm-estate"],
  ["Screenshot 2026-10-08 at 3.02.34 PM.png", "living-fields"],
  ["Screenshot 2026-10-08 at 3.11.26 PM.png", "sunflowers"],
  ["DSC09523.JPG", "farmhouse"],
  ["DSC09638.JPG", "garden-planter"],
];
for (const [source, name] of photos) {
  const output = `public/images/${name}.webp`;
  await sharp(`public/images/${source}`)
    .autoOrient()
    .webp({ quality: 90, effort: 5 })
    .toFile(output);
  console.log(`${output}: ${Math.round((await stat(output)).size / 1024)} KB`);
}
