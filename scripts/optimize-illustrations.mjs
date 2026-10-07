import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
const jobs = [
  { source: 'artwork/jfa', target: 'public/illustrations', quality: 90 },
  { source: 'artwork/hero', target: 'public/illustrations/hero', quality: 92, width: 1000 },
];
for (const { source, target, quality, width } of jobs) {
  await mkdir(target, { recursive: true });
  for (const name of (await readdir(source)).filter(name => name.endsWith('.png'))) {
    const input = path.join(source, name);
    const output = path.join(target, name.replace('.png', '.webp'));
    const pipeline = sharp(input);
    if (width) pipeline.resize({ width, withoutEnlargement: true });
    await pipeline.webp({ quality, alphaQuality: 100, effort: 6 }).toFile(output);
    console.log(`${output}: ${Math.round((await stat(output)).size / 1024)} KB`);
  }
}
