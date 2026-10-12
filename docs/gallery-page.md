# Gallery journal

The dedicated `#gallery` page reinterprets [Farm Natura’s gallery](https://www.farmnatura.in/gallery/) in the site's green, yellow and paper palette. It contains the 15 photographs supplied in `public/images/Gallery FarmNatura` and six YouTube videos, an editorial hero, hand-drawn botanical ornaments and an original editable camera illustration.

## Edit content

- `src/data/galleryCollection.json`: supplied filenames, photo order, captions and categories. `src/data/gallery.ts` combines these with image dimensions and film titles/IDs. Optimized photographs live in `public/images/gallery/`.
- `src/components/world/GalleryPage.tsx`: hero, collection filters, load-more control, viewer, films and visit invitation.
- `src/components/world/GallerySketch.tsx`: original ink-style botanical camera drawing; edit the SVG paths and colors directly.
- `src/hooks/useGalleryAnimations.ts`: scoped GSAP reveals, ornament drift, line drawing and Lenis scrolling.
- The `Gallery journal` block at the end of `src/styles.css` controls desktop and mobile layouts.

Photos are optimized WebP files, limited to 1920 pixels without upscaling, with 480- and 800-pixel responsive versions. Story, farming and farm-life sections reuse this collection according to their subject: crops for seeds and harvests, tractor for soil care, farmhouses for stays, and aerial views for estate overviews. Film titles were checked against YouTube's metadata. Posters use the actual video thumbnails, and YouTube embeds mount only when a visitor opens a film. Closing a film removes the player.

## Navigation and interaction

The main menu and Farm Life's `VIEW THE GALLERY` button open the dedicated page with the existing curved transition. Photos initially show nine entries. Filters select a category; `MORE MOMENTS` adds nine at a time until the collection is complete. The viewer supports previous/next controls, arrow keys, Escape, native dialog focus management and the existing Three.js image wipe with an HTML fallback. Full-size photographs retain their natural aspect ratio.

The Photographs/Films tabs support arrow keys, Home and End. Reduced-motion preferences disable gallery drift and animated rearrangement. Film playback depends on YouTube availability; each viewer also offers a direct YouTube link. Visit enquiries reuse the existing WhatsApp flow.

The gallery has its own route, appears as the fourth carousel destination, and has the numbered `04` menu entry. The compact story gallery includes all 15 collection entries.

## Verification

`npm run build` checks TypeScript and builds production assets. `npm test` runs desktop and mobile coverage for all chapters and the dedicated gallery, including filters, collection expansion, viewer navigation, on-demand film embeds, enquiries and route history. Tests stub the external film response while checking the exact embed URL; external streaming isn't guaranteed by the local test suite.
