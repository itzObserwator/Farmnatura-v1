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

GSAP controls masked text entrances, decorative parallax, the photograph’s organic-to-rounded mask, and the desktop card handover. Framer Motion changes practice descriptions and botanical accents. The four keyboard-accessible practice tabs remain available above the cards. Small screens and reduced-motion settings show both cards in normal reading order. Original Farm Natura artwork and photographs are reused; reference images and copy are not imported.

Edit sections in `src/components/world/NaturalFarmingLayout.tsx`, practice/card copy in `FarmingExplorer.tsx`, responsive sizing in `src/styles.css`, and scroll timing in `src/hooks/useChapterAnimations.ts`.
