# Enter the farm

The uploaded recording showed a 7.6-second estate-photo slideshow after pressing “Enter the farm.” It is now a 5.4-second illustrated welcome with three scenes: living soil, a shared harvest, and farm life. The existing original Farm Natura artwork appears against warm paper and a yellow sun, with a hand-drawn orbit, botanical accents, serif headings and a simple journey line.

`src/components/world/FarmEntrance.tsx` owns the scenes, 1.8-second scene timing, crossfades, closing fade and automatic handoff. `Intro.tsx` retains the original entry poster, actual asset-loading progress and skip controls. The journey line represents the welcome sequence; it does not simulate download progress. All chapter illustrations are already preloaded before the entry CTA becomes available.

Reduced motion shows a static final welcome for 1.8 seconds. Skipping unmounts the sequence and clears its timers. Automatic completion uses the existing session preference, so reloading does not replay the entrance. Styles are grouped under `.farm-entrance` in `src/styles.css`, including small-phone and landscape layouts. Browser checks cover all scenes, automatic entry, session persistence, skipping and reduced motion.
