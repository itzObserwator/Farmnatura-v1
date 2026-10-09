import sharp from 'sharp';
import { readFile, stat } from 'node:fs/promises';
const config = JSON.parse(await readFile('src/data/heroImages.json', 'utf8'));
for (const name of [...Object.keys(config.sizes), 'chilli-sprig']) {
  for (const width of config.widths) {
    const input = `public/illustrations/hero/${name}.webp`;
    const base = `public/illustrations/hero/${name}-${width}`;
    await sharp(input).resize({ width }).webp({ quality: 82, alphaQuality: 100, effort: 6 }).toFile(`${base}.webp`);
    await sharp(input).resize({ width }).avif({ quality: 40, chromaSubsampling: '4:2:0', effort: 7 }).toFile(`${base}.avif`);
  }
}
for (const width of [170, 240, 340, 680]) {
  const output = `public/branding/farmnatura-logo-${width}.webp`;
  await sharp('public/branding/farmnatura-logo.png').resize({ width, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 100, effort: 6 }).toFile(output);
  await sharp('public/branding/farmnatura-logo.png').resize({ width, withoutEnlargement: true }).avif({ quality: 50, effort: 7 }).toFile(output.replace('.webp', '.avif'));
  console.log(output, (await stat(output)).size);
}
