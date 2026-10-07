# Farm Natura — a life rooted in nature

An illustrated, three-chapter website inspired by JFA Awards. Built with React, TypeScript and Vite, using GSAP for animation and Lenis for smooth editorial-page scrolling. All illustrations are original Farm Natura artwork.

## Start the website

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. `npm run build` produces the production website in `dist/`. `npm run preview` serves that build.

## Where to edit

| File | What it controls |
| --- | --- |
| `src/data/chapters.ts` | Titles, colors, illustration paths, and copy for Our Story, Natural Farming, and Farm Life |
| `src/data/content.ts` | FAQ answers and Farm Natura’s contact details |
| `src/App.tsx` | Routing, page transitions, menu, and visit enquiries |
| `src/components/world/Intro.tsx` | Illustrated entry screen and optional photographic introduction |
| `src/components/world/ChapterCarousel.tsx` | Three-scene carousel, wheel/touch gestures, arrows, keyboard controls, and pointer parallax |
| `src/components/world/ChapterPage.tsx` | Editorial chapter page sections |
| `src/components/world/BotanicalMotifs.tsx` | Original SVG flowers, mango, foliage, bird, and brand seal |
| `src/components/world/MenuPanel.tsx` | Layered paper menu |
| `src/components/world/Gallery.tsx` | Gallery controls and full-size image viewer |
| `src/components/ContactDialog.tsx` | Visit enquiry form |
| `src/hooks/useChapterAnimations.ts` | Chapter-page scroll reveals and parallax |
| `src/hooks/useAmbientSound.ts` | Optional synthesised ambience |
| `src/styles.css` | Fonts, layout, colors, breakpoints, and reduced-motion styling |

## Artwork

Three newly generated folk-art illustrations live in `public/illustrations/` as optimized transparent WebP files. Original PNGs are preserved in `artwork/jfa/`. Their complete prompts are in `docs/jfa-illustration-prompts.json`. Run `npm run artwork:optimize` after replacing PNG originals. Decorative botanical elements are SVG and can be edited directly.

The earlier illustration draft is preserved in `artwork/illustrations/` and `artwork/previous-draft/`; it is not used by the current website. Farm Natura’s own photographs are in `public/images/`. Generated scenes are conceptual illustrations, not photographs or architectural plans of the estate.

## Navigation and interactions

The home scene changes with the wheel, touch swipes, arrows, or keyboard arrow keys. Click its artwork or title to open a chapter. Chapters use URL hashes (`#story`, `#farming`, `#living`) so links work with static hosting and refresh correctly. Browser Back returns through visited chapters. The entry sequence is skipped after the first entry in a tab; clear the `farm-entered` sessionStorage value to see it again.

The introduction uses original estate photographs with motion, rather than unrelated reference-site footage. Sound is optional and begins only when the visitor enables it. Reduced-motion preferences turn off parallax and animation. The enquiry form opens a WhatsApp draft; the visitor chooses whether to send it. No form data is stored and no booking is automatically confirmed.

## Verification

`npm test` runs desktop and mobile browser checks for the carousel, chapter routing, menu, gallery, FAQ, WhatsApp enquiry, intro, audio controls and reduced motion. The config uses the local macOS Chrome executable; change `executablePath` in `playwright.config.ts` on another machine. Set `FARM_PREVIEW_URL` to test another Vite port.

## Reference notes

See `docs/design-analysis.md` for the JFA reference analysis, section mapping, motion behavior and font substitution. The project uses freely licensed, locally hosted Italiana and Lato; proprietary reference-site fonts and artwork are not included.
