# Performance verification — 8 October 2026

## Development rendering follow-up — 12 October 2026

The subsequent screenshot measured `http://localhost:5173/about-us` at 95 Performance and LCP 1.4 seconds. Critical images were already preloaded, but development HTML still waited for the React module graph before rendering the page. The development server now renders current source HTML with its initial stylesheet, using [Vite's SSR support](https://vite.dev/guide/ssr), while retaining client hydration and hot reload. Startup warms the server module graph; every request reads current source and route metadata. The inline initial stylesheet is removed after Vite installs its live stylesheet, so deleted CSS rules do not persist during HMR.

The final isolated desktop audit on that exact localhost URL measured **100 Performance, 100 Accessibility, 100 Best Practices and 100 SEO**, with FCP 0.5 seconds, LCP 0.7 seconds, zero blocking time and zero layout shift. Other verification runs scored 99–100. The screenshot's Best Practices failure did not reproduce in clean browser runs; no console errors were found. Details and timestamps are recorded under `developmentRenderingFollowup` in [performance-audit.json](performance-audit.json).

Verification covers HTML visible without JavaScript, route metadata, hydration on all four pages, menus, live CSS updates and removed rules, wind animation, deferred engines, debugging maps and SEO. The checks also exposed stale audio-play callbacks during React's development effect restart. Playback attempts now ignore canceled callbacks; preloader autoplay, gesture fallback and mute pass on desktop/mobile in both development and production. Production build passed; its existing prerendering remains in place.

## Animated Our Story hero — 12 October 2026

The supplied screenshot measured the development route `/about-us` at 88 Performance, with LCP 2.2 seconds. An isolated clean-browser reproduction measured 96 before these fixes; the screenshot's exact score did not reproduce. The production mobile baseline exposed a larger image-delivery cost after the animated scene became the hero.

| Clean audit | Performance before → after | LCP before → after | Accessibility / Best Practices / SEO after |
| --- | --- | --- | --- |
| Development desktop (`5173/about-us`) | 96 → 98 | 1.4 → 1.1 s | 100 / 100 / 100 |
| Production desktop (`4173/about-us`) | 100 → 100 | 0.8 → 0.6 s | 100 / 100 / 100 |
| Production mobile (`4173/about-us`) | 86 → 96 | 4.3 → 2.8 s | 100 / 100 / 100 |

The two tree scenes and flying bird now use responsive AVIF assets with WebP fallbacks. Their preload sizes match the rendered desktop, portrait and landscape sizes; development HTML discovers the critical images before React finishes loading. Hidden hero ornaments are no longer mounted, decorative AVIF sources stay deferred until near the viewport, and the footer logo loads lazily. Initial mobile image transfer fell from 361,466 to 77,712 bytes (79% smaller). Layout shift remains zero; the final mobile run measured 20 ms blocking time.

Tree sway and CSS bird/wind animations pause when the hero leaves the viewport or the tab is hidden, and resume when visible. The original full-resolution artwork is retained. Regenerate the new hero assets with `node scripts/optimize-story-hero.mjs`; `src/data/storyHeroImages.json` shares responsive widths and sizes with the component, development hints and production preloads. Raw measurements are in the `heroFollowup` entry of [performance-audit.json](performance-audit.json). Scores are local measurements, not a deployed-site guarantee.

## Uploaded report follow-up — 9 October 2026

The measurements below precede the subsequent user-requested restoration of decorative labels, captions and footnotes. Their styles have been restored; the image, font, deferred-loading, contrast and security changes remain.

The uploaded Lighthouse PDF reported 89 Performance, 96 Accessibility, 96 Best Practices and 100 SEO, and warned that browser extensions affected the run. A clean audit of the deployed page reproduced the contrast failures, but no browser console errors. Its clean Performance score was 97, so the PDF's 778 KiB unused-JavaScript estimate should not be attributed entirely to the application.

The fixes preserve the artwork and animations: readable muted chapter titles and FAQ ordinals; responsive AVIF images and correct image sizes; a 2.1 KiB numbers-only Voyage font with preload; deferred alternate page layouts and animation features; removal of obsolete decorative-text CSS; and Vercel CSP, frame, content-type, referrer, permissions, HSTS and opener headers. The legacy route redirect uses an external script compatible with the CSP.

| Clean production audit | Performance | Accessibility | Best Practices | SEO | Largest paint | Blocking time | Layout shift |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Local mobile | 96 | 100 | 100 | 100 | 2.7 s | 0 ms | 0 |
| Local desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 ms | 0 |

The final mobile image-delivery audit passes. Unused-JavaScript estimates decreased from 73 KiB in the clean deployed baseline to 50 KiB, and unused CSS from 14 KiB to 11 KiB. These residual estimates include interactive and below-fold functionality rather than demonstrably dead code. Trusted Types enforcement remains a manual compatibility review; the site does not claim that audit recommendation has been enforced. Local changes and security headers require deployment before affecting the live site.

Verification: production build; 36 applicable regression tests for responsiveness, sticky scrolling, wind animation, performance deferral, SEO, contrast, security headers and forms; and final desktop/mobile gallery-navigation and report-fix checks. Raw results are recorded in the `reportFollowup` entry in [performance-audit.json](performance-audit.json).

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
