import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SunlightCanvas from "./SunlightCanvas";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { chapters, type ChapterId } from "../../data/chapters";
import { BotanicalMotif } from "./BotanicalMotifs";
import { motionTokens } from "../../animation/motionTokens";
gsap.registerPlugin(Observer);
const modulo = (value: number, length: number) =>
  ((value % length) + length) % length;
// Three repeated sets keep a wrapping scene beyond either visible edge.
const deck = Array.from({ length: 9 }, (_, i) => ({
  slot: i - 3,
  chapter: chapters[modulo(i - 3, 3)],
}));
export default function ChapterCarousel({
  onExplore,
  onActive,
  blocked,
}: {
  onExplore: (id: ChapterId) => void;
  onActive: (index: number) => void;
  blocked: boolean;
}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const root = useRef<HTMLDivElement>(null),
    position = useRef({ value: 0 }),
    lock = useRef(false);
  const changeRef = useRef<(direction: number) => void>(() => {});
  const active = modulo(step, 3);
  changeRef.current = (direction) => {
    if (lock.current || blocked) return;
    lock.current = true;
    setStep((s) => s + direction);
  };
  useLayoutEffect(() => {
    const draw = () => {
      const gap = innerWidth * (innerWidth < 768 ? 0.69 : 0.47);
      root.current
        ?.querySelectorAll<HTMLElement>(".chapter-scene")
        .forEach((el) => {
          const relative = gsap.utils.wrap(
            -4.5,
            4.5,
            Number(el.dataset.slot) - position.current.value,
          );
          const distance = Math.min(Math.abs(relative), 1);
          gsap.set(el, {
            x: relative * gap,
            y: distance * 55,
            scale: 1 - distance * 0.32,
            zIndex: Math.abs(relative) < 0.5 ? 2 : 1,
            visibility: Math.abs(relative) > 1.6 ? "hidden" : "visible",
          });
          gsap.set(el.querySelector(".scene-illustration"), {
            rotation: Math.max(-1, Math.min(1, relative)) * -5,
          });
        });
    };
    onActive(active);
    draw();
    const tween = gsap.to(position.current, {
      value: step,
      duration: reduced ? 0 : motionTokens.carousel.duration,
      ease: motionTokens.carousel.ease,
      onUpdate: draw,
      onComplete: () => {
        lock.current = false;
      },
    });
    window.addEventListener("resize", draw);
    return () => {
      tween.kill();
      window.removeEventListener("resize", draw);
    };
  }, [step, active, onActive, reduced]);
  useEffect(() => {
    if (blocked) return;
    const observer = Observer.create({
      target: root.current,
      type: "wheel,touch",
      preventDefault: true,
      tolerance: 45,
      wheelSpeed: 1,
      onDown: () => changeRef.current(1),
      onUp: () => changeRef.current(-1),
      onLeft: () => changeRef.current(1),
      onRight: () => changeRef.current(-1),
    });
    const keyboard = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("button,a,input,dialog"))
        return;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        changeRef.current(1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        changeRef.current(-1);
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      observer.kill();
      window.removeEventListener("keydown", keyboard);
    };
  }, [blocked]);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(
      () =>
        gsap.to(".scene-orbit", {
          y: -9,
          rotation: 7,
          duration: 3.8,
          stagger: 0.3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        }),
      root,
    );
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || blocked) return;
      gsap.to(root.current?.querySelectorAll(".scene-parallax") ?? [], {
        x: (event.clientX / innerWidth - 0.5) * 22,
        y: (event.clientY / innerHeight - 0.5) * 15,
        duration: 2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      ctx.revert();
    };
  }, [reduced, blocked]);
  return (
    <div
      ref={root}
      className="chapter-carousel"
      aria-label="Explore Farm Natura’s three chapters"
    >
      <SunlightCanvas active={active} paused={blocked} />
      <div className="scenes-stage">
        {deck.map(({ slot, chapter }) => {
          const relative = gsap.utils.wrap(-4.5, 4.5, slot - step),
            current = relative === 0;
          return (
            <button
              key={slot}
              data-slot={slot}
              className={`chapter-scene scene-${modulo(slot, 3)} ${current ? "is-current" : ""}`}
              aria-label={
                current ? `Explore ${chapter.title}` : `Show ${chapter.title}`
              }
              aria-hidden={Math.abs(relative) > 1.5}
              onClick={() =>
                current
                  ? onExplore(chapter.id)
                  : changeRef.current(relative > 0 ? 1 : -1)
              }
              tabIndex={current ? 0 : -1}
            >
              <div className="scene-parallax">
                <div
                  className="scene-blob"
                  style={{ backgroundColor: chapter.color }}
                />
                <img
                  className="scene-illustration"
                  src={chapter.art}
                  alt={chapter.alt}
                  draggable="false"
                />
                <BotanicalMotif
                  kind={chapter.id === "living" ? "bird" : "flower"}
                  className="scene-orbit orbit-one"
                />
                <BotanicalMotif
                  kind="mango"
                  className="scene-orbit orbit-two"
                />
                <span className="scene-explore">
                  EXPLORE
                  <br />↗
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          className="chapter-caption"
          key={active}
          initial={{ opacity: 0, y: reduced ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -18 }}
          transition={{ duration: reduced ? 0 : 0.3 }}
        >
          <span className="chapter-tag">{chapters[active].tag}</span>
          <h1>
            <button
              onClick={() => onExplore(chapters[active].id)}
              aria-label={chapters[active].title}
            >
              {[...chapters[active].title].map((char, i) => (
                <span className="caption-character-mask" key={i}>
                  <motion.span
                    aria-hidden="true"
                    initial={{ y: reduced ? 0 : "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: reduced ? 0 : 1.1,
                      delay: reduced ? 0 : i * 0.007,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {char === " " ? "\u00a0" : char}
                  </motion.span>
                </span>
              ))}
            </button>
          </h1>
          <button
            className="caption-explore"
            onClick={() => onExplore(chapters[active].id)}
          >
            explore ↗
          </button>
        </motion.div>
      </AnimatePresence>
      <div className="carousel-controls">
        <button
          className="paper-button arrow-button"
          aria-label="Previous chapter"
          onClick={() => changeRef.current(-1)}
        >
          <ArrowLeft size={23} strokeWidth={1} />
        </button>
        <button
          className="paper-button arrow-button"
          aria-label="Next chapter"
          onClick={() => changeRef.current(1)}
        >
          <ArrowRight size={23} strokeWidth={1} />
        </button>
      </div>
      <span className="scroll-instruction">SCROLL TO DISCOVER</span>
      <div className="chapter-pagination" aria-live="polite">
        <span className="pagination-orbit" />
        <span className="pagination-mask">
          <motion.span
            key={active}
            initial={{ y: reduced ? 0 : "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.65,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            0{active + 1}
          </motion.span>
        </span>
        <span>/03</span>
      </div>
    </div>
  );
}
