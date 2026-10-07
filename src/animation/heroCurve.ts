/** The backdrop recedes faster than the text, as in the uploaded hero-scroll recording. */
export const heroCurveMotion = {
  scrollRange: 0.72,
  edgeRetreat: 0.7,
  bow: 0.4,
  scrub: 0.55,
} as const;

/** Object-bounding-box coordinates scale the same smooth curve to every hero. */
export function heroCurvePath(progress: number) {
  const p = Math.max(0, Math.min(progress, 1));
  const edge = 1 - heroCurveMotion.edgeRetreat * p * p;
  const control = edge - 2 * heroCurveMotion.bow * p * p;
  return `M0 0H1V${edge.toFixed(5)}Q0.5 ${control.toFixed(5)} 0 ${edge.toFixed(5)}Z`;
}
