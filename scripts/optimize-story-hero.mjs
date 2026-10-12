import sharp from "sharp";
import { mkdir, readFile, stat } from "node:fs/promises";
const config = JSON.parse(
  await readFile("src/data/storyHeroImages.json", "utf8"),
);
const directory = "public/illustrations/hero-scenes";
await mkdir(directory, { recursive: true });
for (const name of config.scenes) {
  for (const width of config.widths) {
    const input = `public/illustrations/${name}.webp`;
    const target = `${directory}/${name}-${width}`;
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, alphaQuality: 90, effort: 6 })
      .toFile(`${target}.webp`);
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 40, chromaSubsampling: "4:2:0", effort: 6 })
      .toFile(`${target}.avif`);
    console.log(name, width, (await stat(`${target}.avif`)).size);
  }
}
for (const width of config.birdWidths) {
  const input = "public/illustrations/hero/flying-oriole.webp";
  const target = `public/illustrations/hero/flying-oriole-${width}`;
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 76, alphaQuality: 90, effort: 6 })
    .toFile(`${target}.webp`);
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: 40, effort: 6 })
    .toFile(`${target}.avif`);
}
