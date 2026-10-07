import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { chapters } from "../../data/chapters";
import BrandLogo from "./BrandLogo";

const scenes = [
  {
    label: "THE LIVING LAND",
    title: "It begins\nwith the earth.",
    copy: "Living soil. Native seeds. Good things taking root.",
    chapter: chapters[1],
  },
  {
    label: "THE SHARED HARVEST",
    title: "Grown with care.\nShared with joy.",
    copy: "From the shade of a mango grove to the people you love.",
    chapter: chapters[0],
  },
  {
    label: "A LIFE IN NATURE",
    title: "Welcome\nto the farm.",
    copy: "A slower rhythm. A shared harvest. A little closer to nature.",
    chapter: chapters[2],
  },
];
const sceneDuration = 1800;
const entranceDuration = sceneDuration * scenes.length;

/** A short illustrated welcome, separate from actual image-loading progress. */
export default function FarmEntrance({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(reduced ? 2 : 0);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const duration = reduced ? sceneDuration : entranceDuration;
    const interval = reduced
      ? undefined
      : window.setInterval(
          () => setScene((value) => Math.min(value + 1, scenes.length - 1)),
          sceneDuration,
        );
    const fade = window.setTimeout(
      () => setClosing(true),
      duration - (reduced ? 0 : 400),
    );
    const complete = window.setTimeout(onComplete, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(fade);
      clearTimeout(complete);
    };
  }, [onComplete, reduced]);
  const current = scenes[scene];
  return (
    <motion.div
      className="farm-entrance"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.4 }}
      aria-label="Entering Farm Natura"
    >
      <div className="entrance-header">
        <BrandLogo />
        <span>PLANET GREEN PRESENTS</span>
      </div>
      <div className="entrance-world">
        <div className="entrance-orchard" aria-hidden="true">
          <motion.div
            className="entrance-sun"
            initial={reduced ? false : { scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <svg className="entrance-orbit" viewBox="0 0 560 560">
            <motion.path
              d="M80 430C-15 210 90 35 283 28S593 233 491 424C444 510 236 571 117 472"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
          <AnimatePresence mode="sync">
            <motion.img
              key={current.chapter.id}
              className="entrance-scene-art"
              src={current.chapter.art}
              alt=""
              initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: reduced ? 0 : -8,
                scale: reduced ? 1 : 1.025,
              }}
              transition={{
                duration: reduced ? 0 : 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </AnimatePresence>
          <img
            className="entrance-bird"
            src="/illustrations/hero/orchard-bird.webp"
            alt=""
          />
          <img
            className="entrance-marigold"
            src="/illustrations/hero/marigold-stem.webp"
            alt=""
          />
          <span className="entrance-art-note">Soil. Seed. Season.</span>
        </div>
        <div className="entrance-copy">
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <span className="chapter-tag">{current.label}</span>
              <h2>
                {current.title.split("\n").map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </h2>
              <p>{current.copy}</p>
            </motion.div>
          </AnimatePresence>
          <div className="entrance-journey" aria-hidden="true">
            {scenes.map((step, index) => (
              <span
                className={index <= scene ? "is-grown" : ""}
                key={step.label}
              >
                <i />
                {["SOIL", "HARVEST", "LIFE"][index]}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="entrance-status">
        <span role="status" aria-live="polite">
          {reduced ? "WELCOME TO FARM NATURA" : "ENTERING THE FARM"}
        </span>
        <span aria-hidden="true">0{scene + 1} / 03</span>
      </div>
      <div className="entrance-progress" aria-hidden="true">
        <motion.span
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: reduced ? 0 : entranceDuration / 1000,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
}
