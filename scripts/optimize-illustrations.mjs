import sharp from 'sharp';
import {readdir,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
const source='artwork/jfa';
const target='public/illustrations';
await mkdir(target,{recursive:true});
for(const name of (await readdir(source)).filter(name=>name.endsWith('.png'))){
 const input=path.join(source,name),output=path.join(target,name.replace('.png','.webp'));
 await sharp(input).webp({quality:90,alphaQuality:100,effort:6}).toFile(output);
 console.log(`${name}: ${Math.round((await stat(input)).size/1024)} KB → ${Math.round((await stat(output)).size/1024)} KB`);
}
