# JFA Awards → Farm Natura

Reference: https://jfa-awards.snp.agency/. Analysed October 7, 2026 in Chrome at 1440 × 1000 and 390 × 844. Farm Natura content source: https://www.farmnatura.in/.

## Reference structure

JFA opens with a framed illustrated poster and entry button, followed by a skippable introduction film. Its index is a full-viewport circular three-scene carousel. An organic pastel disk anchors the active composition; smaller adjacent scenes appear at the edges. Wheel, swipe and arrow controls change scenes. A small seal sits at upper left, circular menu button upper right, optional sound control lower left, navigation arrows below the central title, and a numbered pager lower right.

The three chapter pages open with full-screen pastel heroes, large uppercase serif titles and scattered botanical ornaments. Inside, large centered editorial statements lead into paired illustration/copy, photography, themed information and a next-chapter link. The menu arrives as three overlapping paper sheets, and navigation uses a pastel full-screen curtain.

## Farm Natura mapping

| JFA reference | Farm Natura |
| --- | --- |
| Poster and introduction | Original farm artwork and a short introduction using Farm Natura photos |
| Our Story | Our Story: returning to the land, family roots and managed farming |
| Our Installations | Natural Farming: native seeds, vegetables, soil health and managed care |
| Centre Court | Farm Life: farmhouse living, family time, location, visits and FAQs |
| Botanical illustrated scene disks | Original mango grove, crop garden and farmhouse/cow folk-art scenes |
| Campaign impact statistics | Farm Natura’s published acreage, soil revitalisation period and maintenance term |
| Festival installation gallery | Photographs from Farm Natura’s existing website |
| Social closing sections | Site-visit invitation and Farm Natura’s contact links |

## Visual measurements

Core navy: #003056. Paper: #fbfbf7. Sky: #d4ecf0. Mint: #c1e3d2. Sand: #ffedbf. Desktop chapter compositions are approximately 430–460px wide; neighboring scenes show at about two-thirds scale. Reference chapter index titles are about 60–70px; inner hero titles reach about 110px. Mobile hero titles are roughly 40–48px. Controls use small uppercase sans-serif text, thin outlines and slightly irregular circular/paper shapes.

The reference uses proprietary Voyage, Gill Sans and Baysoir alongside other typefaces. This project uses freely licensed Italiana for the display role and Lato for body/UI text. This is a close visual and behavioral adaptation, not an identical font or artwork reproduction.

## Motion implementation

- GSAP animates carousel translation, scaling, rotating illustrations, looping decorative elements and pointer parallax.
- GSAP Observer handles wheel and touch input. A transition lock prevents a single gesture from skipping several chapters. Adjacent scenes wrap outside the center path.
- Chapter titles reveal line by line; ScrollTrigger reveals editorial content and shifts illustrations with scroll.
- Lenis runs only on chapter pages, leaving carousel gestures under its own controls.
- The menu uses three staggered paper layers. Navigation covers the page with a pastel curtain, switches the route, and reveals the next page.
- Intro progress reflects loaded illustration files. The photographic intro lasts about 7.6 seconds and is always skippable.
- Optional local synthesised ambience replaces reference-site audio. It never starts automatically.
- Reduced motion disables continuous movement and simplifies page transitions. Native dialogs provide focus trapping for menu, photographs and enquiries.

## Original artwork and content

Three detailed patterned Indian folk-art compositions were created using the built-in image generation tool. PNG originals and exact prompts are preserved in the project; the deployed page uses WebP files with transparency. Decorative flowers, mangoes, foliage, bird and seal are newly authored SVG.

No JFA illustrations, intro footage, proprietary fonts, testimonials or source implementation were copied. Estate facts and the contact number come from Farm Natura’s current site. Travel times are marked approximate; visitors request current pricing, availability and agreements directly from the team. The visit form creates a WhatsApp draft without sending it automatically.
