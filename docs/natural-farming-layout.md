# Natural Farming: Centre Court

Reference: https://jfa-awards.snp.agency/centre-court

The live page’s section structure, dimensions, decorative placements and pinning were inspected in Chrome. It uses a custom `#scroll` container. At a 1440px viewport its centered introduction is about 867px wide with 60px type; the first split pairs a 703px illustration area on the left with a 437px copy column on the right. The next photo is about 1113 × 598px, followed by copy on the left and two staggered illustrations on the right. A centered feature heading leads into two roughly 683 × 545px paper cards with a pinned scroll transition.

| Centre Court section                         | Farm Natura adaptation                                                                       |
| -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Illustrated full-height title                | Existing Farm Natura headline and hand-drawn hero frame                                      |
| Centered lead, illustration left, copy right | Soil-care introduction, tilted goshala photograph, native crop artwork, natural-farming copy |
| Oversized organic photograph                 | Farm Natura estate aerial, widening organic mask and photo parallax                          |
| Left caption and staggered artwork right     | Living ecosystem copy, staggered estate photographs, hand-drawn bird and mango branch        |
| Centered feature title and paper cards       | Natural-farming practices and managed agronomy care                                          |
| Social invitation and next chapter           | Shared visit invitation, contact footer and illustrated Farm Life link                       |

GSAP controls the nested word/text masks and desktop card handover. Photographs retain their fixed tilt and rectangular edges, as measured on the reference. Three.js renders pointer-responsive organic background surfaces independently of the photographs. Framer Motion changes practice descriptions and botanical accents. The four keyboard-accessible practice tabs remain available above the cards. Small screens and reduced-motion settings show both cards in normal reading order. Original Farm Natura artwork and photographs are reused; reference images and copy are not imported.

Edit sections in `src/components/world/NaturalFarmingLayout.tsx`, practice/card copy in `FarmingExplorer.tsx`, responsive sizing in `src/styles.css`, and scroll timing in `src/hooks/useChapterAnimations.ts`.

## Centre Court motion audit

The animation was re-audited at sixteen positions through the custom scrolling container and against the publicly served behavior. At 1440 × 1000, the first card stayed near 94px from the top while the second moved upward approximately 736px and finished at a 1° tilt. The first card kept opacity 1 and its original size. Its former shrink/fade effect has been removed.

Text uses the reference’s 1.1-second cubic Bézier `(0.165, 0.84, 0.44, 1)`, a 0.007-second word stagger, and a 20% intersection threshold. Words and their inner glyphs lift together from 105%. Natural Farming uses its own motion setup so these measurements do not alter the other chapters.

The reference’s organic backgrounds use pointer-responsive paths. Farm Natura implements that behavior with original branded Three.js shader surfaces and spring-smoothed pointer deformation; the shape contours are adapted to its artwork. The extra photo zoom and growing rounded mask have been removed. WebGL absence retains the CSS shapes. Reduced motion disables the shader and pinning while keeping both cards readable.

Motion constants: `src/animation/naturalFarmingMotion.ts`. Scroll/text choreography: `src/hooks/useNaturalFarmingMotion.ts`. GPU surfaces and cleanup: `src/components/world/LivingSurface.tsx`.

The sticky handover now uses linear scroll progress with a 0.65-second scrub, without a spring or front-loaded ease. Its scroll distance is the greater of 1.35 viewport heights and 1.8 times the second card's travel. This prevents the old `bottom bottom` endpoint from compressing the entire transition into a short scroll on tall screens. Geometry recalculates on resize; scrolling back reverses the same motion. Mobile and reduced-motion layouts retain ordinary stacked cards.
