import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import { setupNaturalFarmingMotion } from "./useNaturalFarmingMotion";
gsap.registerPlugin(ScrollTrigger);
/** Scene-specific scroll choreography, scoped to the currently mounted chapter. */
export function setupChapterAnimations(lenis: Lenis) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis.on("scroll", ScrollTrigger.update);
  let mounted = true;
  let cleanupFarming = () => {};
  const ctx = gsap.context(() => {
    gsap.utils
      .toArray<HTMLElement>("[data-text-reveal]:not([data-farming-reveal])")
      .forEach((element) =>
        gsap.from(element.querySelectorAll(".reveal-char"), {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.007,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        }),
      );
    gsap.utils
      .toArray<HTMLElement>("[data-reveal]:not([data-farming-reveal])")
      .forEach((element) =>
        gsap.from(element, {
          y: 35,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        }),
      );
    gsap.utils
      .toArray<HTMLElement>("[data-image-reveal]")
      .forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: "inset(12% 8% 12% 8% round 38%)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 2%)",
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 95%",
              end: "top 12%",
              scrub: 0.7,
            },
          },
        );
        gsap.fromTo(
          element.querySelector("img"),
          { scale: 1.14, yPercent: -5 },
          {
            scale: 1,
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });
    gsap.utils
      .toArray<HTMLElement>(
        ".art-panel img, .landscape-ornament, .story-grove-art, .story-drift",
      )
      .forEach((element) =>
        gsap.fromTo(
          element,
          { y: 35, rotation: -4 },
          {
            y: -35,
            rotation: 4,
            ease: "none",
            scrollTrigger: {
              trigger: element.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        ),
      );
    cleanupFarming = setupNaturalFarmingMotion();
    const curvedLine = document.querySelector(".story-curved-line textPath");
    if (curvedLine)
      gsap.fromTo(
        curvedLine,
        { attr: { startOffset: "54%" } },
        {
          attr: { startOffset: "46%" },
          ease: "none",
          scrollTrigger: {
            trigger: ".story-curved-line",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    gsap.to(".hero-decor", {
      yPercent: 18,
      scale: 1.12,
      ease: "none",
      scrollTrigger: {
        trigger: ".page-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    gsap.to(".hero-title", {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: ".page-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count);
      const counter = { value: 0 };
      element.textContent = `0${element.dataset.suffix ?? ""}`;
      gsap.to(counter, {
        value: target,
        duration: 1.7,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 90%", once: true },
        onUpdate: () => {
          element.textContent = `${Math.round(counter.value)}${element.dataset.suffix ?? ""}`;
        },
      });
    });
  });
  const refresh = () => {
    if (mounted) ScrollTrigger.refresh();
  };
  void document.fonts.ready.then(refresh);
  const timeout = window.setTimeout(refresh, 1200);
  window.addEventListener("load", refresh);
  return () => {
    mounted = false;
    clearTimeout(timeout);
    window.removeEventListener("load", refresh);
    cleanupFarming();
    ctx.revert();
    lenis.off("scroll", ScrollTrigger.update);
  };
}
