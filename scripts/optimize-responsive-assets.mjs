import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const ornaments = ['mango-branch','marigold-stem','native-foliage','orchard-bird','okra-branch','chilli-sprig'];
for (const name of ornaments) {
  for (const width of [120,240,480,800]) {
    const base = `public/illustrations/hero/${name}`;
    await sharp(`${base}.webp`).resize({width}).webp({quality:80,alphaQuality:90}).toFile(`${base}-${width}.webp`);
    await sharp(`${base}.webp`).resize({width}).avif({quality:32,effort:5}).toFile(`${base}-${width}.avif`);
  }
}
for (const name of ['story-grove','farming-peppers','living-harvest-moringa']) {
  for (const width of [480,800,1200]) {
    await sharp(`public/illustrations/${name}.webp`).resize({width}).webp({quality:82,alphaQuality:90}).toFile(`public/illustrations/${name}-${width}.webp`);
  }
}
for (const width of [340,680]) {
  await sharp('public/branding/farmnatura-logo.png').resize({width}).webp({quality:90}).toFile(`public/branding/farmnatura-logo-${width}.webp`);
}
// Keep the live site's social image URL valid in the redesigned deployment.
await mkdir('public/images',{recursive:true});
await sharp('public/branding/farmnatura-logo.png').resize({width:1200,height:630,fit:'contain',background:'#fafaf6'}).png().toFile('public/images/logo.png');
