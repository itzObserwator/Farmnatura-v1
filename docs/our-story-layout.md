# Our Story: Victoria Wharf layout

Reference: https://jfa-awards.snp.agency/victoria-wharf

The live reference was inspected section by section, including its DOM, responsive CSS, illustration proportions, and sticky list. Its composition informs this page; copy, photographs, and illustration subjects belong to Farm Natura.

| Reference sequence                               | Farm Natura implementation                                                                    |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Full-height illustrated title                    | Three-line headline framed by original hand-drawn botanical cutouts                           |
| Centered editorial lead with generous whitespace | “Find a little more life between the soil and the sky”                                        |
| Text left, contained organic illustration right  | Origin story beside the original grove scene                                                  |
| Curved serif text ribbon                         | “Rooted in the land. Growing together.” with scroll-driven movement                           |
| Large organic photograph left, statement right   | Estate aerial beside a statement about putting down roots                                     |
| Oversized list with sticky image and description | Six themes with hover, focus, and click selection; description and photograph update together |
| Illustrated closing scene                        | Visit invitation and illustrated next chapter                                                 |

Desktop keeps the asymmetry, broad spacing, a centered 1280px content width matching Farm Life, a 49/51 first split, reversed 53/47 photo split, and sticky right-hand selector. Desktop sections use equal side gutters of at least 48px; mobile uses 22px. Mobile stacks the editorial splits and preserves a narrow two-column story list with the photograph beside it. Farm facts follow the list on mobile to remain readable.

## Animation responsibilities

- GSAP ScrollTrigger controls text reveals, botanical parallax, image entrance, and curved ribbon offset. Existing hero scroll choreography is retained.
- Framer Motion animates description changes and existing page interactions.
- Three.js/WebGL renders the selected photograph’s curved wipe using the shared photo transition. An HTML photograph remains underneath for loading and unavailable WebGL.
- Reduced motion keeps content visible, removes decorative travel, and preserves button functionality.

## Hand-drawn artwork

Four transparent colored-pencil, ink, and watercolor illustrations were generated with built-in `image_gen`: mango branch, marigold stem, orchard bird, and native foliage. Green and yellow follow the uploaded logo. These replace the flat hero ornaments across all three chapters.

Exact prompts: `docs/hero-illustration-prompts.json`. Original PNGs: `artwork/hero/`. Optimized WebP assets: `public/illustrations/hero/`. Run `npm run artwork:optimize` to rebuild WebP files after changing the PNGs.

Edit structure in `src/components/world/OurStoryLayout.tsx`, list copy and photographs in `src/data/story.ts`, artwork placement in `HeroBotanicals.tsx` and `src/styles.css`, and scroll motion in `src/hooks/useChapterAnimations.ts`.
