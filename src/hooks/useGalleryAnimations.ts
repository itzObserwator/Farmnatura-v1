import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);
/** Scoped gallery choreography; React handles collection changes independently. */
export function useGalleryAnimations(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      prevent: (node) => node.closest("dialog") !== null,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    const context = gsap.context(() => {
      gsap.from(".gallery-journal-hero .reveal-char", {
        yPercent: 115,
        stagger: 0.018,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(
        ".gallery-journal-hero .chapter-tag, .gallery-journal-hero p, .gallery-journal-scroll",
        { y: 18, opacity: 0, stagger: 0.12, duration: 1, delay: 0.7 },
      );
      gsap.to(".gallery-hero-art", {
        y: -24,
        rotation: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });
      gsap.to(".gallery-journal-hero .hero-title", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ".gallery-journal-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.utils
        .toArray<HTMLElement>("[data-gallery-reveal]")
        .forEach((element) => {
          gsap.from(element, {
            y: 35,
            opacity: 0,
            duration: 1,
            scrollTrigger: { trigger: element, start: "top 90%", once: true },
          });
        });
      gsap.fromTo(
        ".gallery-drawn-trail path",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: ".gallery-collection-intro",
            start: "top 80%",
            once: true,
          },
        },
      );
    }, root);
    let mounted = true;
    const refresh = () => {
      if (mounted) ScrollTrigger.refresh();
    };
    void document.fonts.ready.then(refresh);
    return () => {
      mounted = false;
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [root]);
}
