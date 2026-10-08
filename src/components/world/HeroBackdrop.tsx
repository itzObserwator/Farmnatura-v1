import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { heroCurveMotion, heroCurvePath } from "../../animation/heroCurve";

/** Curves only the background and ornaments; the hero headline remains readable above it. */
export default function HeroBackdrop({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  const id = `hero-curve-${useId().replace(/:/g, "")}`;
  const backdrop = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  useLayoutEffect(() => {
    const hero = backdrop.current?.closest<HTMLElement>(".page-hero");
    if (!hero || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let started = false;
    let cleanup = () => {};
    const start = () => {
      if (started) return;
      started = true;
      window.removeEventListener("scroll", start);
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        .then(([{ default: gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;
          gsap.registerPlugin(ScrollTrigger);
          const progress = { value: 0 };
          const context = gsap.context(() => {
            gsap.to(progress, {
              value: 1,
              ease: "none",
              onUpdate: () =>
                path.current?.setAttribute("d", heroCurvePath(progress.value)),
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: () =>
                  `+=${hero.offsetHeight * heroCurveMotion.scrollRange}`,
                scrub: heroCurveMotion.scrub,
                invalidateOnRefresh: true,
              },
            });
          });
          cleanup = () => context.revert();
        })
        .catch(() => {});
    };
    window.addEventListener("scroll", start, { passive: true });
    if (scrollY > 0) start();
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", start);
      cleanup();
    };
  }, []);
  return (
    <>
      <svg
        className="hero-curve-definition"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path ref={path} d={heroCurvePath(0)} />
          </clipPath>
        </defs>
      </svg>
      <div
        ref={backdrop}
        className="hero-backdrop"
        aria-hidden="true"
        style={{ backgroundColor: color, clipPath: `url(#${id})` }}
      >
        {children}
      </div>
    </>
  );
}
