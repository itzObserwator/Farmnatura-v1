import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motionTokens } from "../animation/motionTokens";
gsap.registerPlugin(ScrollTrigger);
/** Scene-specific scroll choreography, scoped to the currently mounted chapter. */
export function useChapterAnimations() {
  useLayoutEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      anchors: { offset: -90 },
      prevent: (node) => node.closest("dialog") !== null,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    const media = gsap.matchMedia();
    let mounted = true;
    const ctx = gsap.context(() => {
      gsap.from(".page-hero .reveal-char", {
        yPercent: 115,
        duration: motionTokens.text.duration,
        stagger: motionTokens.text.stagger,
        ease: motionTokens.text.ease,
        delay: 0.35,
      });
      gsap.from(".page-hero .chapter-tag, .hero-subtitle", {
        opacity: 0,
        y: 15,
        duration: 1,
        delay: 0.7,
      });
      gsap.to(".page-hero .decor-piece", {
        y: -14,
        rotation: "+=3",
        duration: 4,
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
        ease: "sine.inOut",
      });
      gsap.utils.toArray<HTMLElement>("[data-text-reveal]").forEach((element) =>
        gsap.from(element.querySelectorAll(".reveal-char"), {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.007,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        }),
      );
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) =>
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
          ".art-panel img, .landscape-ornament, .story-grove-art, .story-drift, .farming-drift",
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
      gsap.utils
        .toArray<HTMLElement>("[data-farming-image]")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { borderRadius: "43% 57% 44% 56% / 49% 38% 62% 51%", scale: 0.92 },
            {
              borderRadius: "2% 3% 2% 3% / 3% 2% 3% 2%",
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "top 15%",
                scrub: 0.8,
              },
            },
          );
          gsap.fromTo(
            element.querySelector("img"),
            { scale: 1.12, yPercent: -4 },
            {
              scale: 1,
              yPercent: 4,
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
      media.add("(min-width: 900px)", () => {
        const cards = document.querySelector<HTMLElement>(".farming-cards");
        if (!cards) return;
        const first = cards.querySelector(".practice-window");
        const second = cards.querySelector(".farming-managed-card");
        gsap.set(second, { yPercent: 135, rotation: 3, opacity: 0 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: cards,
              start: "top 130px",
              end: () => `+=${innerHeight * 1.2}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          .to(
            first,
            { scale: 0.96, rotation: -2, opacity: 0.6, duration: 1 },
            0,
          )
          .to(
            second,
            {
              yPercent: 0,
              rotation: -1,
              opacity: 1,
              duration: 1,
              ease: "none",
            },
            0,
          );
      });
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
      media.add("(min-width: 900px)", () => {
        const stack = document.querySelector<HTMLElement>(".moments-stack");
        if (!stack) return;
        const cards = stack.querySelectorAll<HTMLElement>(".moment-card");
        gsap.set(cards[1], { yPercent: 115, rotation: 3 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: stack,
              start: "top 110px",
              end: () => `+=${innerHeight * 1.1}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          .to(
            cards[0],
            { scale: 0.96, rotation: -2, opacity: 0.6, duration: 1 },
            0,
          )
          .to(
            cards[1],
            { yPercent: 0, rotation: -1, duration: 1, ease: "none" },
            0,
          );
      });
      gsap.fromTo(
        ".next-scene",
        { scale: 0.78, y: 70 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".next-chapter-stage",
            start: "top bottom",
            end: "top 12%",
            scrub: 1,
          },
        },
      );
      gsap.from(
        ".next-chapter-stage .next-title, .next-chapter-stage .chapter-tag",
        {
          y: 35,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          scrollTrigger: {
            trigger: ".next-chapter-stage",
            start: "top 55%",
            once: true,
          },
        },
      );
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
      media.revert();
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
