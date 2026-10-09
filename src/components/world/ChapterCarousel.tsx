import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/m";
import SunlightCanvas from "./SunlightCanvas";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  carouselDestinations,
  type CarouselDestinationId,
} from "../../data/carousel";
import HandDrawnMotif from "./HandDrawnMotif";
import { motionTokens } from "../../animation/motionTokens";
import { useExploreCursor } from "../../hooks/useExploreCursor";
gsap.registerPlugin(Observer);
const ignoreActive = (_index: number) => {};
const modulo = (value: number, length: number) =>
  ((value % length) + length) % length;
// Repeated sets keep a wrapping scene beyond either visible edge.
const count = carouselDestinations.length;
const deckLength = count * 3;
const deck = Array.from({ length: deckLength }, (_, i) => ({
  slot: i - count,
  chapter: carouselDestinations[modulo(i - count, count)],
}));
export default function ChapterCarousel({
  onExplore,
  onActive = ignoreActive,
  blocked,
  initialIndex = 0,
  embedded = false,
}: {
  onExplore: (id: CarouselDestinationId) => void;
  onActive?: (index: number) => void;
  blocked: boolean;
  initialIndex?: number;
  embedded?: boolean;
}) {
  const reduced = useReducedMotion();
  const Heading = embedded ? motion.h2 : motion.h1;
  const [step, setStep] = useState(initialIndex);
  const [visible, setVisible] = useState(!embedded);
  const root = useRef<HTMLDivElement>(null),
    position = useRef({ value: initialIndex }),
    lock = useRef(false);
  const changeRef = useRef<(direction: number) => void>(() => {});
  const active = modulo(step, count);
  const activeRef = useRef(active);
  activeRef.current = active;
  const exploreCursor = useExploreCursor(!blocked && visible);
  useEffect(() => {
    if (!embedded || !root.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [embedded]);
  useEffect(() => {
    exploreCursor.hide();
  }, [step, exploreCursor.hide]);
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
            -deckLength / 2,
            deckLength / 2,
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
    const isFullyVisible = () => {
      const bounds = root.current?.getBoundingClientRect();
      return (
        !!bounds &&
        bounds.height <= innerHeight + 1 &&
        bounds.top >= -1 &&
        bounds.bottom <= innerHeight + 1
      );
    };
    const leaveCarousel = (direction: number) => {
      const bounds = root.current?.getBoundingClientRect();
      if (bounds)
        window.scrollTo({
          top: scrollY + bounds.top + direction * innerHeight * 0.75,
          behavior: reduced ? "instant" : "smooth",
        });
    };
    const atBoundary = (direction: number) =>
      embedded &&
      ((direction < 0 && activeRef.current === initialIndex) ||
        (direction > 0 &&
          activeRef.current === modulo(initialIndex + count - 1, count)));
    const observer = Observer.create({
      target: root.current,
      type: "wheel",
      preventDefault: true,
      tolerance: 45,
      wheelSpeed: 1,
      ignoreCheck: (event) =>
        !isFullyVisible() ||
        atBoundary((event as WheelEvent).deltaY > 0 ? 1 : -1),
      onDown: () => changeRef.current(1),
      onUp: () => changeRef.current(-1),
    });
    // Track one complete touch gesture without rebuilding listeners when
    // the selected chapter changes. Leave boundary swipes to native scrolling.
    let gesture: { x: number; y: number; dx: number; dy: number } | null = null;
    const touchStart = (event: TouchEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.touches.length !== 1 ||
        !isFullyVisible() ||
        target.closest(".carousel-controls, .chapter-caption a")
      )
        return;
      const touch = event.touches[0];
      gesture = { x: touch.clientX, y: touch.clientY, dx: 0, dy: 0 };
    };
    const touchMove = (event: TouchEvent) => {
      if (!gesture || event.touches.length !== 1) return;
      gesture.dx = event.touches[0].clientX - gesture.x;
      gesture.dy = event.touches[0].clientY - gesture.y;
      const vertical = Math.abs(gesture.dy) > Math.abs(gesture.dx);
      if (vertical && atBoundary(gesture.dy < 0 ? 1 : -1)) {
        gesture = null;
        return;
      }
      if (event.cancelable) event.preventDefault();
    };
    const touchEnd = () => {
      if (!gesture) return;
      const { dx, dy } = gesture;
      gesture = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;
      const direction = (Math.abs(dx) > Math.abs(dy) ? dx : dy) < 0 ? 1 : -1;
      changeRef.current(direction);
    };
    const touchCancel = () => {
      gesture = null;
    };
    const node = root.current;
    node?.addEventListener("touchstart", touchStart, { passive: true });
    node?.addEventListener("touchmove", touchMove, { passive: false });
    node?.addEventListener("touchend", touchEnd);
    node?.addEventListener("touchcancel", touchCancel);
    const keyboard = (event: KeyboardEvent) => {
      if (!isFullyVisible()) return;
      if ((event.target as HTMLElement).closest("button,a,input,dialog"))
        return;
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        if (
          embedded &&
          activeRef.current === modulo(initialIndex + count - 1, count) &&
          event.key !== "ArrowRight"
        )
          leaveCarousel(1);
        else changeRef.current(1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        if (
          embedded &&
          activeRef.current === initialIndex &&
          event.key !== "ArrowLeft"
        )
          leaveCarousel(-1);
        else changeRef.current(-1);
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      observer.kill();
      node?.removeEventListener("touchstart", touchStart);
      node?.removeEventListener("touchmove", touchMove);
      node?.removeEventListener("touchend", touchEnd);
      node?.removeEventListener("touchcancel", touchCancel);
      window.removeEventListener("keydown", keyboard);
    };
  }, [blocked, embedded, initialIndex, reduced]);
  useEffect(() => {
    if (reduced || blocked || !visible) return;
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
    const node = root.current;
    node?.addEventListener("pointermove", move);
    return () => {
      node?.removeEventListener("pointermove", move);
      ctx.revert();
    };
  }, [reduced, blocked, visible]);
  return (
    <div
      ref={root}
      className="chapter-carousel"
      aria-label="Explore Farm Natura’s pages"
    >
      <SunlightCanvas active={active} paused={blocked || !visible} />
      <div className="scenes-stage">
        {deck.map(({ slot, chapter }) => {
          const relative = gsap.utils.wrap(
              -deckLength / 2,
              deckLength / 2,
              slot - step,
            ),
            current = relative === 0;
          return (
            <button
              key={slot}
              data-slot={slot}
              className={`chapter-scene scene-${modulo(slot, count)} ${current ? "is-current" : ""}`}
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
                <ResponsiveImage
                  className="scene-illustration"
                  src={chapter.art}
                  alt={chapter.alt}
                  draggable="false"
                  {...(current && !blocked ? exploreCursor.handlers : {})}
                />
                <HandDrawnMotif
                  kind={
                    chapter.id === "living" || chapter.id === "gallery"
                      ? "bird"
                      : "flower"
                  }
                  className="scene-orbit orbit-one"
                />
                <HandDrawnMotif
                  kind={
                    chapter.id === "story"
                      ? "mango"
                      : chapter.id === "gallery"
                        ? "sprig"
                        : "chilli"
                  }
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
          <span className="chapter-tag">
            {carouselDestinations[active].tag}
          </span>
          <Heading>
            <button
              onClick={() => onExplore(carouselDestinations[active].id)}
              aria-label={carouselDestinations[active].title}
            >
              {[...carouselDestinations[active].title].map((char, i) => (
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
          </Heading>
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
        <span>/{String(count).padStart(2, "0")}</span>
      </div>
      {exploreCursor.cursor}
    </div>
  );
}
