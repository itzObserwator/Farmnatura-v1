# Enter the farm

The entrance is a continuous 6.6-second natural farming vignette, rather than a chapter-art slideshow. An original Indian folk illustration shows two yoked zebu cattle pulling a wooden plough with a farmer. The team travels slowly across a textured field; furrow highlights draw into place, the soil warms to green, and 32 seedlings emerge in a staggered wave. The scene is centered and enlarged, with no right-side heading, body copy or journey labels.

`src/components/world/FarmEntrance.tsx` owns the 6.6-second animation and the Framer Motion timeline. The foreground artwork is one transparent layer, so the cattle and farmer move together; it does not animate individual legs. The field, organic grain pattern, furrows and seedlings are SVG layers. `App.tsx` mounts the preloader immediately when the homepage opens. Completion replaces the root URL with `/about-us`, where `StoryHero.tsx` presents the former animated welcome scene with Our Story’s heading and subtitle. The hero has no entry button; visitors scroll naturally, and sound starts with the preloader when autoplay is permitted. If autoplay is blocked, the first click, tap or key press starts it; the sound toggle remains available to control playback. The footer says “Life from the land” and displays a 0%–100% counter synchronized with the progress line. Both reach 100% before the exit fade. This represents the welcome sequence, not network download progress.

Reduced motion shows the fully planted field without motion for 2.2 seconds. The preloader completes automatically without a skip or entry gate. Unmounting clears the sequence timers; automatic entry preserves the existing session preference. Desktop and mobile browser checks cover reduced motion, percentage progression, automatic entry, sound and reload behavior.

## Artwork

Generated with the built-in imagegen tool. Style reference: `public/illustrations/story-grove.webp`. Original: `artwork/entrance/oxen-plough.png`. Optimized transparent WebP: `public/illustrations/entrance/oxen-plough.webp` (1500 px wide). The exact prompt is in `artwork/entrance/prompt.txt`.
