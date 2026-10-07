# Gallery journal

The dedicated `#gallery` page reinterprets [Farm Natura’s gallery](https://www.farmnatura.in/gallery/) in the site's green, yellow and paper palette. It contains the source gallery's 29 photographs and six YouTube videos, an editorial hero, hand-drawn botanical ornaments and an original editable camera illustration.

## Edit content

- `src/data/gallery.ts`: photo order, captions, categories and film titles/IDs. The local photographs live in `public/images/gallery/`.
- `src/components/world/GalleryPage.tsx`: hero, collection filters, load-more control, viewer, films and visit invitation.
- `src/components/world/GallerySketch.tsx`: original ink-style botanical camera drawing; edit the SVG paths and colors directly.
- `src/hooks/useGalleryAnimations.ts`: scoped GSAP reveals, ornament drift, line drawing and Lenis scrolling.
- The `Gallery journal` block at the end of `src/styles.css` controls desktop and mobile layouts.

Photos are optimized WebP files, limited to 1600 pixels without upscaling. They retain the original gallery's imagery; descriptive captions are new. Film titles were checked against YouTube's metadata. Posters use the actual video thumbnails, and YouTube embeds mount only when a visitor opens a film. Closing a film removes the player.

## Navigation and interaction

The main menu and Farm Life's `VIEW THE GALLERY` button open the dedicated page with the existing curved transition. Photos initially show nine entries. Filters select a category; `MORE MOMENTS` adds nine at a time until the collection is complete. The viewer supports previous/next controls, arrow keys, Escape, native dialog focus management and the existing Three.js image wipe with an HTML fallback. Full-size photographs retain their natural aspect ratio.

The Photographs/Films tabs support arrow keys, Home and End. Reduced-motion preferences disable gallery drift and animated rearrangement. Film playback depends on YouTube availability; each viewer also offers a direct YouTube link. Visit enquiries reuse the existing WhatsApp flow.

The gallery has its own route and does not add a fourth chapter to the home carousel. Its menu entry is separate from the three numbered chapters.

## Verification

`npm run build` checks TypeScript and builds production assets. `npm test` runs desktop and mobile coverage for all chapters and the dedicated gallery, including filters, collection expansion, viewer navigation, on-demand film embeds, enquiries and route history. Tests stub the external film response while checking the exact embed URL; external streaming isn't guaranteed by the local test suite.
