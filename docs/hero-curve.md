# Hero scroll curve

The 6.53-second reference recording shows a mint hero gradually bowing upward as the page scrolls. Its background and decorative artwork retreat together, while the heading, description and scroll cue remain visible over the paper background. Scrolling back restores the hero.

`HeroBackdrop.tsx` provides this shared layer for Our Story, Natural Farming, Farm Life and Gallery. A normalized SVG clipping path scales to any hero size. GSAP ScrollTrigger scrubs the path with the existing Lenis scroll updates, without pinning the hero or changing its layout height. Only background and ornaments are inside the clipping layer; hero text stays outside it.

Change `src/animation/heroCurve.ts` to tune scroll distance, edge retreat, curve depth and following delay. The quadratic progression starts gently and retreats faster as scrolling continues. Each page owns its trigger and removes it when unmounted. Reduced-motion users retain a flat backdrop.

The landing chapter carousel retains its existing wheel-driven chapter navigation. Browser tests cover the four scrolling heroes on desktop and mobile, scroll reversal, stable layout and reduced motion.
