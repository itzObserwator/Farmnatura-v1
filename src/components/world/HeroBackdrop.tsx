import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroCurveMotion, heroCurvePath } from "../../animation/heroCurve";
gsap.registerPlugin(ScrollTrigger);

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
          end: () => `+=${hero.offsetHeight * heroCurveMotion.scrollRange}`,
          scrub: heroCurveMotion.scrub,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => {
      context.revert();
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
