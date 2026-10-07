/** Shared timings from the JFA motion audit; keep choreography changes in one place. */
export const motionTokens = {
  carousel: { duration: 1, ease: "power4.inOut" },
  text: { duration: 1.3, stagger: 0.007, ease: "power3.out" },
  menu: { open: 0.9, close: 0.6, stagger: 0.07 },
  curtain: { cover: 1, uncover: 0.85, ease: "power1.inOut" },
} as const;

/** A curved paper edge, expressed in a fixed SVG viewBox so it scales to any screen. */
export function curtainPath(progress: number, uncover = false) {
  const edge = (1 - progress) * 1100;
  const bow = Math.sin(progress * Math.PI) * 220;
  return uncover
    ? `M0 0H1000V${edge}Q500 ${edge + bow} 0 ${edge}Z`
    : `M0 ${edge}Q500 ${edge - bow} 1000 ${edge}V1100H0Z`;
}
