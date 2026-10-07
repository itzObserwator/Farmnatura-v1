/** Centre Court motion measurements. Geometry adapts to Farm Natura copy and viewport. */
export const naturalFarmingMotion = {
  reveal: { duration: 1.1, stagger: 0.007, threshold: 0.2, offset: 105 },
  cards: {
    rotation: 1,
    overlap: 2,
    top: 95,
    // Keep the handover gradual even when the viewport is taller than the cards.
    viewportDistance: 1.35,
    travelDistance: 1.8,
    scrub: 0.65,
  },
  surfaces: { spring: 0.085, pointerStrength: 0.055, idleStrength: 0.012 },
} as const;
