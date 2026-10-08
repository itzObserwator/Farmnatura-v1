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
  const media = gsap.matchMedia();
  media.add("(min-width: 900px)", () => {
    const stage = root.querySelector<HTMLElement>(".farming-feature-stage");
    const cards = root.querySelector<HTMLElement>(".farming-cards");
    const first = cards?.querySelector<HTMLElement>(".practice-window");
    const second = cards?.querySelector<HTMLElement>(".farming-managed-card");
    if (!stage || !cards || !first || !second) return;
    const gap = parseFloat(getComputedStyle(second).marginTop) || 0;
    // Reserve only the final stack's height. Pin spacing supplies the scroll runway.
    // The moving card keeps its original starting position without a vacant flow slot.
    gsap.set(cards, {
      height: () =>
        Math.max(first.offsetHeight, second.offsetHeight) +
        motion.cards.overlap,
    });
    gsap.set(second, {
      position: "absolute",
      marginTop: 0,
      left: 0,
      width: "100%",
      top: () => first.offsetTop + first.offsetHeight + gap,
    });
    const cardTravel = () =>
      Math.max(0, second.offsetTop - first.offsetTop - motion.cards.overlap);
    // Only the second moves; the first stays opaque and maintains the stack's layout.
    gsap.fromTo(
      second,
      { y: 0, rotation: -1.4 },
      {
        y: () => -cardTravel(),
        rotation: motion.cards.rotation,
        ease: "none",
        scrollTrigger: {
          id: "farming-card-handover",
          trigger: stage,
          pin: true,
          start: () =>
            `top ${motion.cards.top - (first.getBoundingClientRect().top - stage.getBoundingClientRect().top)}px`,
          end: () =>
            `+=${Math.max(
              window.innerHeight * motion.cards.viewportDistance,
              cardTravel() * motion.cards.travelDistance,
            )}`,
          scrub: motion.cards.scrub,
          onRefreshInit: () => {
            // Update measurements without recapturing GSAP's original styles,
            // so breakpoint changes can restore the ordinary stacked layout.
            cards.style.height = `${Math.max(first.offsetHeight, second.offsetHeight) + motion.cards.overlap}px`;
            second.style.top = `${first.offsetTop + first.offsetHeight + gap}px`;
          },
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
