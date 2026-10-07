import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { naturalFarmingMotion as motion } from "../animation/naturalFarmingMotion";
gsap.registerPlugin(CustomEase, ScrollTrigger);
CustomEase.create("farmingReveal", "0.165,0.84,0.44,1");

/** Called inside the chapter's GSAP context; returns observer cleanup. */
export function setupNaturalFarmingMotion() {
  const root = document.querySelector<HTMLElement>(".page-farming");
  if (!root) return () => {};
  const heroWords = root.querySelectorAll(".page-hero .reveal-word");
  gsap.from(heroWords, {
    yPercent: 105,
    duration: 1.1,
    stagger: 0.007,
    ease: "farmingReveal",
    delay: 0.35,
  });
  gsap.from(root.querySelectorAll(".page-hero .reveal-char"), {
    yPercent: 105,
    duration: 1.1,
    stagger: (_index, target) =>
      Array.from(heroWords).indexOf(target.parentElement) * 0.007,
    ease: "farmingReveal",
    delay: 0.35,
  });
  gsap.from(root.querySelectorAll(".page-hero .chapter-tag, .hero-subtitle"), {
    opacity: 0,
    duration: 1.1,
    delay: 0.7,
    ease: "farmingReveal",
  });
  const observers: IntersectionObserver[] = [];
  const animations = gsap.context(() => {});
  const reveal = (element: HTMLElement) => {
    const chars = element.querySelectorAll(".reveal-char");
    const words = element.querySelectorAll(".reveal-word");
    if (chars.length) {
      gsap.set([words, chars], { yPercent: motion.reveal.offset });
    } else gsap.set(element, { opacity: 0 });
    // Like the reference, trigger once after 20% of the block enters view.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        animations.add(() => {
          if (chars.length) {
            gsap.to(words, {
              yPercent: 0,
              duration: motion.reveal.duration,
              stagger: motion.reveal.stagger,
              ease: "farmingReveal",
            });
            gsap.to(chars, {
              yPercent: 0,
              duration: motion.reveal.duration,
              stagger: (_index, target) =>
                Array.from(words).indexOf(target.parentElement) *
                motion.reveal.stagger,
              ease: "farmingReveal",
            });
          } else
            gsap.to(element, {
              opacity: 1,
              duration: motion.reveal.duration,
              ease: "farmingReveal",
            });
        });
        observer.disconnect();
      },
      { threshold: motion.reveal.threshold },
    );
    observer.observe(element);
    observers.push(observer);
  };
  root
    .querySelectorAll<HTMLElement>(
      ".natural-farming-layout [data-farming-reveal]",
    )
    .forEach(reveal);
  const media = gsap.matchMedia();
  media.add("(min-width: 900px)", () => {
    const stage = root.querySelector<HTMLElement>(".farming-feature-stage");
    const cards = root.querySelector<HTMLElement>(".farming-cards");
    const first = cards?.querySelector<HTMLElement>(".practice-window");
    const second = cards?.querySelector<HTMLElement>(".farming-managed-card");
    if (!stage || !cards || !first || !second) return;
    // Both cards remain in document flow. Only the second moves; the first stays opaque.
    gsap.fromTo(
      second,
      { y: 0, rotation: -1.4 },
      {
        y: () => -(second.offsetTop - first.offsetTop) + motion.cards.overlap,
        rotation: motion.cards.rotation,
        ease: "power1.out",
        scrollTrigger: {
          id: "farming-card-handover",
          trigger: stage,
          pin: true,
          start: () =>
            `top ${motion.cards.top - (first.getBoundingClientRect().top - stage.getBoundingClientRect().top)}px`,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
  return () => {
    observers.forEach((observer) => observer.disconnect());
    animations.revert();
    media.revert();
  };
}
