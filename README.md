# Farm Natura

A React + TypeScript website inspired by the visual structure and motion of Vestre Habitats, with original Farm Natura artwork and content.

## Run locally

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. Build with `npm run build`; preview the production build with `npm run preview`.

## Where to make changes

- `src/App.tsx` — page sections, navigation, gallery and FAQ interactions.
- `src/data/content.ts` — experiences, FAQ answers and contact details.
- `src/components/Illustrations.tsx` — original editable SVG farm artwork.
- `src/components/ContactDialog.tsx` — accessible visit enquiry dialog.
- `src/hooks/useAnimations.ts` — GSAP reveals, pollinator motion, Lenis scrolling and pinned horizontal landscape.
- `src/styles.css` — colors, typography, layouts and mobile styles.
- `public/images/` — photographs from Farm Natura’s existing website.
- `public/fonts/` — locally hosted DM Sans with its license.

The visit form prepares a WhatsApp message. It does not send a message automatically or store visitor information. Update the phone number in `src/data/content.ts` when necessary. Current availability and prices are intentionally left for the Farm Natura team to confirm.

## Browser checks

`npm test` checks desktop and mobile layouts, gallery, navigation, FAQs, visit enquiries, and reduced motion. The test config uses Chrome installed on macOS; change `executablePath` in `playwright.config.ts` for another machine or use Playwright’s installed Chromium.

## Design and assets

See `docs/design-analysis.md` for reference analysis and the section mapping. The illustration source is SVG in React so a beginner can edit colors and move individual shapes. No Vestre images, proprietary font files or source implementation were reused.
