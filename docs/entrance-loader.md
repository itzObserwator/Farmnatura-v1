# Enter the farm

The entrance is a continuous 6.6-second natural farming vignette, rather than a chapter-art slideshow. An original Indian folk illustration shows two yoked zebu cattle pulling a wooden plough with a farmer. The team travels slowly across a textured field; furrow highlights draw into place, the soil warms to green, and 32 seedlings emerge in a staggered wave. The copy follows soil, seed and life, ending with “Welcome to the farm.”

`src/components/world/FarmEntrance.tsx` owns the three 2.2-second copy stages and the Framer Motion timeline. The foreground artwork is one transparent layer, so the cattle and farmer move together; it does not animate individual legs. The field, organic grain pattern, furrows and seedlings are SVG layers. `Intro.tsx` preloads the new artwork alongside the chapter illustrations before enabling Enter the Farm. The progress line represents the welcome sequence, not download progress.

Reduced motion shows the fully planted field and final welcome without motion for 2.2 seconds. Skip remains available. Unmounting clears the sequence timers; automatic entry preserves the existing session preference. Desktop and mobile browser checks cover skipping, reduced motion, all copy stages, automatic entry and session persistence.

## Artwork

Generated with the built-in imagegen tool. Style reference: `public/illustrations/story-grove.webp`. Original: `artwork/entrance/oxen-plough.png`. Optimized transparent WebP: `public/illustrations/entrance/oxen-plough.webp` (1500 px wide). The exact prompt is in `artwork/entrance/prompt.txt`.
