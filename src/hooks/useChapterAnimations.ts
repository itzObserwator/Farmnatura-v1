import { useEffect } from "react";
import Lenis from "lenis";
/** Static HTML paints first; scroll enhancements load on the first navigation gesture. */
export function useChapterAnimations() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.15,
      anchors: { offset: -90 },
      prevent: (node) => node.closest("dialog") !== null,
      virtualScroll: ({ event }) => !event.defaultPrevented,
    });
    let cancelled = false;
    let cleanup = () => {};
    let loading = false;
    const events = [
      "wheel",
      "touchstart",
      "pointermove",
      "pointerdown",
      "keydown",
      "scroll",
    ] as const;
    const remove = () =>
      events.forEach((event) => window.removeEventListener(event, start));
    const start = () => {
      if (loading) return;
      loading = true;
      remove();
      void import("./setupChapterAnimations")
        .then(({ setupChapterAnimations }) => {
          if (!cancelled) cleanup = setupChapterAnimations(lenis);
        })
        .catch(() => {
          /* Native scrolling remains available if an enhancement fails. */
        });
    };
    events.forEach((event) =>
      window.addEventListener(event, start, { passive: true }),
    );
    if (scrollY > 0) start();
    return () => {
      cancelled = true;
      remove();
      cleanup();
      lenis.destroy();
    };
  }, []);
}
