import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
await build({build:{ssr:'src/prerender.tsx',outDir:'.prerender',emptyOutDir:true},ssr:{noExternal:['gsap']}});
const {render, pageMetadata} = await import('../.prerender/prerender.js');
const template = (await readFile('dist/index.html','utf8')).replace(/<link rel="preload"[^>]*as="font"[^>]*>/g, '');
const cssFile = template.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)?.[1];
const css = cssFile ? await readFile('dist'+cssFile,'utf8') : '';
const escape = s => s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for (const [path, route] of [['','home'],['about-us','story'],['natural-farming','farming'],['farmhouses-for-sale-in-hyderabad','living'],['gallery','gallery']]) {
  const copy = pageMetadata[route];
  const metadata = `<title>${escape(copy.title)}</title><meta name="description" content="${escape(copy.description)}"/><link rel="canonical" href="https://www.farmnatura.in/${path}"/><meta name="robots" content="index, follow"/><meta property="og:title" content="${escape(copy.title)}"/><meta property="og:description" content="${escape(copy.description)}"/><meta property="og:url" content="https://www.farmnatura.in/${path}"/><meta property="og:image" content="https://www.farmnatura.in/branding/farmnatura-logo.png"/><meta name="twitter:card" content="summary_large_image"/><link rel="preload" href="/fonts/italiana.woff2" as="font" type="font/woff2" crossorigin/><link rel="preload" href="/fonts/lato.woff2" as="font" type="font/woff2" crossorigin/><link rel="preload" href="/fonts/lato-bold.woff2" as="font" type="font/woff2" crossorigin/>`;
  let html = template.replace(/<title>.*?<\/title>/s,'').replace(/<meta name="description"[^>]*\/>/,'').replace('</head>',metadata+'</head>');
  html = html.replace(/<link rel="stylesheet"[^>]*>/,`<style>${css}</style>`).replace('<script type="module"','<script fetchpriority="low" type="module"').replaceAll('<link rel="modulepreload"','<link fetchpriority="low" rel="modulepreload"');
  if (['story','farming','living'].includes(route)) {
    const heroAssets = ['mango-branch',route==='farming'?'okra-branch':'marigold-stem','native-foliage','orchard-bird',...(route==='story'?['okra-branch']:[])];
    const preloads = heroAssets.map(name=>`<link rel="preload" as="image" fetchpriority="${name==='marigold-stem'?'high':'low'}" type="image/avif" imagesrcset="/illustrations/hero/${name}-240.avif 240w, /illustrations/hero/${name}-480.avif 480w, /illustrations/hero/${name}-800.avif 800w" imagesizes="(max-width: 767px) 180px, 400px"/>`).join('');
    html = html.replace('</head>',preloads+'</head>');
  }
  html = html.replace('<div id="root"></div>',`<div id="root">${render(route==='home'?null:route)}</div>`);
  html = html.replace('</head>','<noscript><style>img[data-src]{display:none}</style></noscript></head>');
  if (!path) html = html.replace('<head>',`<head><script>var legacy={story:'about-us',farming:'natural-farming',living:'farmhouses-for-sale-in-hyderabad',gallery:'gallery'};var destination=legacy[location.hash.slice(1)];if(destination)location.replace('/'+destination);</script>`);
  await mkdir(`dist/${path}`,{recursive:true});
  await writeFile(`dist/${path?path+'/':''}index.html`,html);
}
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['','about-us','natural-farming','farmhouses-for-sale-in-hyderabad','gallery'].map(path=>`<url><loc>https://www.farmnatura.in/${path}</loc></url>`).join('')+'</urlset>');

await writeFile("dist/_redirects", ["about-us","natural-farming","farmhouses-for-sale-in-hyderabad","gallery"].map(path=>`/${path} /${path}/index.html 200`).join("\n")+"\n");
