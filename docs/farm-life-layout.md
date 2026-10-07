# Farm Life: About layout

Reference: https://jfa-awards.snp.agency/about

The live About page was inspected in Chrome at desktop and mobile widths, including its custom scrolling container, section dimensions, text hierarchy, illustrations, photo angles, media feature and statistics grid.

| About sequence                                         | Farm Life adaptation                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Illustrated full-height hero                           | Existing Farm Life headline with original hand-drawn botanical frame                              |
| Centered editorial statement                           | A statement about family, nature and a life that grows with you                                   |
| Tall botanical illustration left, two paragraphs right | Marigold scene with Farm Natura’s farmhouse and managed-living introduction                       |
| Narrow copy left, staggered tilted photographs right   | Weekend copy with farmhouse and dining photographs                                                |
| Oversized campaign-story heading and media             | Farm life in pictures: wide interactive photo tour and full-size viewer                           |
| Small impact tag left, large statement and copy right  | Growing a fuller life through land ownership, family and managed farming                          |
| Six large statistics in three columns                  | Farm Natura acreage, soil-care years, maintenance period, travel times and three published values |
| Illustrated chapter ending                             | Shared visit invitation, contact footer and Our Story link                                        |

At 1440px, the reference uses an approximately 900px centered statement, 1130px media width, asymmetrical editorial splits and a three-column, two-row statistics grid. This page follows those proportions. Mobile hides the large opening botanical scene, places the tilted photographs before their caption, and stacks the statistics in one column, as in the reference.

GSAP handles masked heading entrances, section reveals, the drawn editorial arrow and number counts. The shared Three.js organic surfaces respond to pointer movement with a CSS fallback. The photo tour uses Framer Motion caption changes and the Three.js/WebGL photo wipe. Reduced motion retains normal reading order and visible content.

The reference media is a campaign film. Farm Life uses estate photographs with working gallery navigation and an image viewer, since the project has no corresponding Farm Natura film. No reference media or illustrations are imported. FAQ, visit enquiry, map and contact interactions remain available.

The six figures retain their meanings: 110+ acres, 6+ years of soil revitalisation, a four-year managed maintenance programme, approximate journeys of 25 minutes from the airport and 20 minutes from Tukkuguda ORR, and the three values Indulge, Involve and Impact nature. Confirm current agreements and availability with the team; travel varies with traffic and route.

Files: `FarmLifeLayout.tsx` for structure and prose; `src/data/life.ts` for figures; `Gallery.tsx` for the media feature; `src/styles.css` for responsive layout; `useChapterAnimations.ts` for editorial motion.
