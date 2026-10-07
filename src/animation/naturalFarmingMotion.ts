/** Centre Court motion measurements. Geometry adapts to Farm Natura copy and viewport. */
export const naturalFarmingMotion = {
  reveal: { duration: 1.1, stagger: 0.007, threshold: 0.2, offset: 105 },
  cards: { rotation: 1, overlap: 2, top: 95 },
  surfaces: { spring: 0.085, pointerStrength: 0.055, idleStrength: 0.012 },
} as const;
