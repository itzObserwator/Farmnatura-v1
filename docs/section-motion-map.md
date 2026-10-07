# JFA section and motion audit

Reference reviewed again on October 7, 2026: [JFA index](https://jfa-awards.snp.agency/), [Our Story](https://jfa-awards.snp.agency/about), [Victoria Wharf](https://jfa-awards.snp.agency/victoria-wharf), and [Centre Court](https://jfa-awards.snp.agency/centre-court).

This is an independently implemented Farm Natura adaptation. It retains the supplied logo, its green/yellow palette, Farm Natura copy and photography, and the original Indian botanical artwork. JFA's proprietary font, campaign film and illustration assets are not part of this project. The reference's slow image loader obstructed several new screenshot samples; section order, runtime element geometry, motion settings and earlier fully loaded observations were also used. Durations below describe this implementation, not a guarantee of frame-identical reference playback.

## Section-by-section mapping

| Reference section                     | Farm Natura content and placement                                                | Motion and implementation                                                                                                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Loading screen                        | Actual original-artwork loading progress                                         | Large lower-left percentage, organic clipped illustration, fade to the poster; Framer Motion in `Intro.tsx`                                                                  |
| Framed introduction                   | Farm Natura logo, “Life from the land”, grove and farmhouse artwork              | Poster scale/opacity entrance, masked illustration framing, enter button, optional skippable 7.6-second photographic sequence                                                |
| Three-scene index                     | Our Story → Natural Farming → Farm Life                                          | Nine repeated scene instances create a seamless cyclic deck; GSAP animates its continuous position over 1 second with `power4.inOut`                                         |
| Index title and pager                 | One short chapter name and tag, numbered position                                | Outgoing title exits before incoming character masks rise; Framer Motion staggers letters by .007 seconds and rolls the page number                                          |
| Pointer movement                      | Original art, fruit and floral ornaments                                         | Two-second eased pointer parallax and independent decorative floating; touch remains available for navigation                                                                |
| Layered menu                          | Three chapter links, supplied logo, visit and contact links                      | Staggered paper layers and content entrance; reverse .6-second close before the native dialog releases focus                                                                 |
| Page navigation                       | Selected chapter's brand-tinted surface                                          | GSAP animates an independently drawn SVG curved edge, covers the page, changes route, then uncovers it; browser Back cancels a pending wipe                                  |
| Full-height chapter hero              | Short, three-line Farm Natura headline with a supporting sentence                | Character masks reveal over 1.3 seconds; ornaments and title move at different rates with scroll                                                                             |
| Editorial lead and illustrated split  | A concise statement, original illustration, then the managed-farming explanation | Wrapping character reveals for statements, paragraph entrance and independent illustration parallax                                                                          |
| Story campaign imagery                | Farm Natura estate photograph and “The land is only the beginning”               | Rounded image mask expands with scroll; photograph zoom/parallax and botanical ornament move independently                                                                   |
| Story impact                          | Published 110+ acres, 6+ years of soil revitalisation, 4 years of maintenance    | Separate editorial explanation, then viewport-triggered numerical count-up; reduced motion renders final values immediately                                                  |
| Installations overview and selector   | Farming landscape followed by four natural-farming practices                     | Named keyboard-accessible practice index, original crop illustration and changing motif/copy; Framer Motion animates selection                                               |
| Centre Court illustrated introduction | Farm Life story, farmhouse landscape and short family-oriented caption           | The large photograph opens through the scroll mask, with surrounding independent ornaments                                                                                   |
| Centre Court stacked stories          | Farmhouse time and orchard walks                                                 | Desktop GSAP pinned overlapping paper cards; mobile and reduced-motion views keep both cards in normal reading order                                                         |
| Social/photo section                  | Real Farm Natura photographs, labelled gallery and Instagram footer link         | Three.js uses a curved WebGL image wipe with slight edge distortion; GSAP animates the shader uniform, Framer Motion updates captions; HTML image/lightbox remain accessible |
| Additional Farm Natura details        | Farm Life location, practical FAQ and visit invitation                           | Placed after the experience story; FAQ uses Framer Motion height/opacity expansion; visit enquiry retains its explicit WhatsApp draft flow                                   |
| Returning illustrated index           | Full-height scene for the next Farm Natura chapter                               | The next illustration grows into view with scroll; chapter label and title reveal separately; overlapping page controls hide when this scene becomes visible                 |

## Different chapter sequences

- **Our Story:** hero → editorial introduction and illustrated split → estate landscape → impact statement and figures → visit invitation → footer → illustrated Natural Farming chapter.
- **Natural Farming:** hero → editorial introduction and illustrated split → farming landscape → interactive practice index → visit invitation → footer → illustrated Farm Life chapter.
- **Farm Life:** hero → editorial introduction and illustrated split → farmhouse landscape → overlapping family-experience stories → location → photographic gallery → FAQ → visit invitation → footer → illustrated Our Story chapter.

## Editing the choreography

`src/animation/motionTokens.ts` contains the shared scene, title, menu and curved-wipe timing. `src/hooks/useChapterAnimations.ts` owns editorial scroll sequences, count-ups, photograph masks and desktop card pinning. React-only state changes live in their section components. Avoid animating the same element's transform in both Framer Motion and GSAP.

The home WebGL layer is a quiet original sun/pollen atmosphere. The gallery's `PhotoTransition.tsx` supplies the image wipe with Three.js. Both modules import Three.js lazily and dispose their GPU resources when unmounted. Unsupported contexts retain the HTML experience; reduced motion removes continuous movement, long transitions and card pinning. No JFA application source was copied into the project.

## Verification

Desktop and mobile browser coverage includes scene navigation, WebGL animation/fallback, practice keyboard controls, chapter transition/Back behavior, card reading order with reduced motion, impact figures, gallery/lightbox, visit enquiries and audio/intro controls. Visual reviews also inspect the expanded masks, chapter headlines, practice layout and full-height ending scenes.
