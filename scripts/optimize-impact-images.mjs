import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const source = 'artifacts/impact-reference/source';
const out = 'public/images/impact';
await mkdir(out, { recursive: true });
for (const [name, extension] of [['vinay-ram','png'],['subhash-palekar','svg'],...Array.from({length:7},(_,i)=>[`award-${i+1}`,'jpg'])]) {
  const widths = name.startsWith('award') ? [400,800,1280] : [160,320];
  for (const width of widths) await sharp(`${source}/${name}.${extension}`).resize({width,withoutEnlargement:true}).webp({quality:80}).toFile(`${out}/${name}-${width}.webp`);
}
