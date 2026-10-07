# Farm Natura — a life rooted in nature

An illustrated, three-chapter website inspired by JFA Awards. Built with React, TypeScript and Vite, using Framer Motion for React interactions, GSAP for scene and scroll choreography, Three.js/WebGL for the animated sunlight atmosphere, and Lenis for smooth editorial-page scrolling. All illustrations are original Farm Natura artwork.

## Start the website

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. `npm run build` produces the production website in `dist/`. `npm run preview` serves that build.

## Where to edit

| File                                        | What it controls                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/data/chapters.ts`                      | Titles, colors, illustration paths, and copy for Our Story, Natural Farming, and Farm Life  |
| `src/data/story.ts`                         | Six story-list items, descriptions, captions, and photographs                               |
| `src/components/world/OurStoryLayout.tsx`   | Victoria Wharf-inspired editorial sections and sticky story selector                        |
| `src/components/world/HeroBotanicals.tsx`   | Hand-drawn hero artwork placements                                                          |
| `src/data/content.ts`                       | FAQ answers and Farm Natura’s contact details                                               |
| `src/App.tsx`                               | Routing, page transitions, menu, and visit enquiries                                        |
| `src/components/world/Intro.tsx`            | Illustrated entry screen and optional photographic introduction                             |
| `src/components/world/ChapterCarousel.tsx`  | Three-scene carousel, wheel/touch gestures, arrows, keyboard controls, and pointer parallax |
| `src/components/world/ChapterPage.tsx`      | Different section order for each chapter                                                    |
| `src/components/world/RevealText.tsx`       | Accessible, wrapping character reveal masks                                                 |
| `src/components/world/LandscapeChapter.tsx` | Large scroll-masked estate photos                                                           |
| `src/components/world/FarmingExplorer.tsx`  | Keyboard-accessible natural-farming practice selector                                       |
| `src/components/world/LifeMoments.tsx`      | Pinned desktop story cards and mobile reading layout                                        |
| `src/components/world/NextChapter.tsx`      | Full-height illustrated chapter ending                                                      |
| `src/components/world/PhotoTransition.tsx`  | Three.js curved photograph wipe and HTML fallback                                           |
| `src/animation/motionTokens.ts`             | Shared animation timings and SVG transition shape                                           |
| `src/components/world/BotanicalMotifs.tsx`  | Original SVG flowers, mango, foliage, and bird                                              |
| `src/components/world/BrandLogo.tsx`        | Supplied Farm Natura logo, shared by header, intro, menu, and footer                        |
| `src/components/world/SunlightCanvas.tsx`   | Lazy-loaded Three.js shader: moving sunlight, field contours, and pollen                    |
| `src/components/world/MenuPanel.tsx`        | Layered paper menu                                                                          |
| `src/components/world/Gallery.tsx`          | Gallery controls and full-size image viewer                                                 |
| `src/components/ContactDialog.tsx`          | Visit enquiry form                                                                          |
| `src/hooks/useChapterAnimations.ts`         | Chapter-page scroll reveals and parallax                                                    |
| `src/hooks/useAmbientSound.ts`              | Optional synthesised ambience                                                               |
| `src/styles.css`                            | Fonts, layout, colors, breakpoints, and reduced-motion styling                              |

## Artwork

Three newly generated folk-art illustrations live in `public/illustrations/` as optimized transparent WebP files. Original PNGs are preserved in `artwork/jfa/`. Their complete prompts are in `docs/jfa-illustration-prompts.json`. Run `npm run artwork:optimize` after replacing PNG originals. Four hand-drawn botanical cutouts replace the hero’s flat ornaments. Their PNG originals are in `artwork/hero/`, optimized assets in `public/illustrations/hero/`, and exact generation prompts in `docs/hero-illustration-prompts.json`. Smaller SVG motifs remain in other sections.

The earlier illustration draft is preserved in `artwork/illustrations/` and `artwork/previous-draft/`; it is not used by the current website. Farm Natura’s own photographs are in `public/images/`. Generated scenes are conceptual illustrations, not photographs or architectural plans of the estate.

## Navigation and interactions

The home scene changes with the wheel, touch swipes, arrows, or keyboard arrow keys. Click its artwork or title to open a chapter. Chapters use URL hashes (`#story`, `#farming`, `#living`) so links work with static hosting and refresh correctly. Browser Back returns through visited chapters. The entry sequence is skipped after the first entry in a tab; clear the `farm-entered` sessionStorage value to see it again.

The introduction uses original estate photographs with motion, rather than unrelated reference-site footage. Sound is optional and begins only when the visitor enables it. Reduced-motion preferences turn off parallax and animation. The enquiry form opens a WhatsApp draft; the visitor chooses whether to send it. No form data is stored and no booking is automatically confirmed.

## Verification

`npm test` runs desktop and mobile browser checks for the carousel, chapter routing, menu, gallery, FAQ, WhatsApp enquiry, intro, audio controls, practice keyboard navigation, card reading order, WebGL fallbacks and reduced motion. The config uses the local macOS Chrome executable; change `executablePath` in `playwright.config.ts` on another machine. Set `FARM_PREVIEW_URL` to test another Vite port.

## Reference notes

See `docs/design-analysis.md` for the JFA reference analysis, section mapping, motion behavior and font substitution. The project uses freely licensed, locally hosted Italiana and Lato; proprietary reference-site fonts and artwork are not included.

## Logo and animation layers

The uploaded logo is preserved unchanged in `public/branding/farmnatura-logo.png`. Its green (`#3C7A3A`) and yellow (`#FDD504`) drive the palette. Dark green (`#244D26`) is the reading color; chapter backgrounds use pale green and yellow tints. Change CSS brand variables in `src/styles.css` and chapter surface colors in `src/data/chapters.ts` together.

Framer Motion handles intro and caption entrances, logo button feedback, and expanding FAQ answers. GSAP controls the three illustrated scenes, pointer parallax, paper menu, curtain transitions, editorial scroll reveals, and the WebGL chapter-color tween. Three.js renders an original full-screen shader atmosphere in the carousel; it imports only when the carousel mounts. Its canvas does not intercept gestures, caps pixel density, pauses behind dialogs and in hidden tabs, respects reduced motion, and disposes GPU resources on exit. Browsers without WebGL retain the illustrated site and all navigation. Lenis smooths editorial-page scrolling.

See [the section-by-section motion map](docs/section-motion-map.md) for the latest reference audit, distinct chapter sequences, timing choices and animation responsibilities.

See [Our Story layout notes](docs/our-story-layout.md) for the Victoria Wharf analysis and implementation mapping.

Natural Farming now follows the Centre Court section sequence. Edit its editorial structure in `src/components/world/NaturalFarmingLayout.tsx` and its interactive cards in `FarmingExplorer.tsx`. See [Natural Farming layout notes](docs/natural-farming-layout.md) for measurements and motion mapping.

Natural Farming’s measured text timing and reversible card overlap live in `src/hooks/useNaturalFarmingMotion.ts`, with shared values in `src/animation/naturalFarmingMotion.ts`. `LivingSurface.tsx` provides its pointer-responsive Three.js backgrounds, visibility-based rendering, GPU cleanup and CSS fallback. See the motion audit in `docs/natural-farming-layout.md` before changing these timings.
