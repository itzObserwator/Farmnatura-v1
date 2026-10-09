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
  // Never hide the initial headline after the server has already painted it.
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
  return () => {
    observers.forEach((observer) => observer.disconnect());
    animations.revert();
  };
}
