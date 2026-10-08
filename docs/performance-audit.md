# Performance verification — 8 October 2026

The existing redesigned copy is unchanged. These are isolated Lighthouse runs against Our Story, after the performance changes. Scores vary with hardware and browser workload; the development server includes hot reload and unbundled application modules.

| Test | Performance | Accessibility | Best practices | SEO | First paint | Largest paint | Blocking time | Layout shift |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Development, mobile (`5173/#story`) | 72 | 100 | 100 | 100 | 2.9 s | 5.6 s | 160 ms | 0 |
| Production, mobile (`4173/about-us`) | 96 | 100 | 100 | 100 | 0.9 s | 2.7 s | 40 ms | 0 |
| Production, desktop (`4173/about-us`) | 100 | 100 | 100 | 100 | 0.2 s | 0.6 s | 0 ms | 0 |

The user's development screenshot scored 55. Development dependency minification, gzip, separate debugging maps and importing only the icons used by the site reduce its download costs. The production build benefits additionally from prerendered HTML and optimized bundles.

Scroll smoothing starts immediately. GSAP choreography and the hero curve load on interaction; WebGL surfaces and photo transitions load near the viewport. The footer carousel reserves its final height before loading, avoiding a scroll jump. Photo transition textures use responsive derivatives rather than downloading the full original again. Hero dimensions match the actual assets and fonts preload before paint. The original tune is retained, with a browser AAC version reduced from 7,680,044 to 678,586 bytes (91% smaller). Audio still begins only on a user request.

Verification: the full desktop/mobile suite passed 46 applicable tests (4 skipped by platform/build). Production content and deferral checks passed 10 tests. Subsequent development transport and audio checks verified accessible source maps, gzip, navigation and the compact tune.

To reproduce production measurements:

```sh
npm run build
npm run preview -- --port 4173
npm exec --yes --package=lighthouse -- lighthouse http://127.0.0.1:4173/about-us --only-categories=performance,seo,accessibility,best-practices --output=html --output-path=/tmp/farm-natura-lighthouse.html
```

The default Lighthouse profile is mobile; add `--preset=desktop` for desktop. This workspace uses `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` with `--chrome-flags='--headless --no-sandbox'`. Run audits one at a time with other browser tests stopped. Production hosting must serve the generated page HTML and compress text assets. Canonical routes and prerendering are covered by browser tests. Raw metric values and Lighthouse timestamps are in [performance-audit.json](performance-audit.json).
