# Explore cursor

The uploaded 9.08-second recording shows a small white circular `EXPLORE` badge with a thin outline. It enters over the active illustration, follows the pointer with slight easing and sits just above/left of the native hand cursor. It contracts and fades when the pointer leaves. The new badge uses Farm Natura's green outline and text.

`src/hooks/useExploreCursor.tsx` owns the shared interaction. `ChapterCarousel.tsx` attaches its handlers only to the active illustration. `NextChapter.tsx` uses the same hook for its illustration preview. The badge is rendered in a portal using viewport coordinates, so GSAP's parent scaling, rotation and parallax do not distort its position.

Motion values update directly on pointer movement. Spring values supply a small following delay, and the badge scales/fades on enter and leave. Reduced-motion users get immediate position updates. The badge never intercepts pointer events; clicking still reaches the existing chapter button.

The badge hides on illustration exit, click, pointer cancellation, chapter change, menu opening, page scrolling, resize and window blur. Touch devices retain their normal tap controls. Keyboard navigation retains the centered focus indicator and existing text links. The old hover indicator has `pointer-events: none` so it cannot interrupt tracking over the center of the image.

Edit the `.explore-cursor` block in `src/styles.css` for appearance, and the spring settings and pointer offset in `useExploreCursor.tsx` for following behavior. Tests cover following positions, exit boundaries, overlays, chapter changes and chapter-preview hover with normal and reduced motion on desktop and mobile viewports.
