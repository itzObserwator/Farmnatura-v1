import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BotanicalMotif } from "./BotanicalMotifs";
import RevealText from "./RevealText";
const practices = [
  {
    title: "Indigenous seeds",
    text: "Locally adapted native and heirloom seeds, chosen for the land and the season.",
    kind: "mango",
  },
  {
    title: "Chemical-free care",
    text: "Natural farming practices that focus on the health of the land and its crops.",
    kind: "flower",
  },
  {
    title: "A living ecosystem",
    text: "Room for fruit-bearing trees, seasonal vegetables, birds and pollinators.",
    kind: "bird",
  },
  {
    title: "Managed with care",
    text: "Dedicated agronomy staff handle the everyday work so you can enjoy your farm.",
    kind: "sprig",
  },
] as const;
export default function FarmingExplorer() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const practice = practices[active];
  return (
    <section
      className="farming-explorer"
      id="our-practice"
      data-motion-section="practices"
    >
      <div className="section-container">
        <span className="chapter-tag" data-reveal>
          WORKING WITH NATURE
        </span>
        <h2 data-text-reveal>
          <RevealText text="Rooted in living soil. Grown with care." />
        </h2>
        <div className="explorer-layout">
          <div
            className="practice-index"
            role="tablist"
            aria-label="Natural farming practices"
          >
            {practices.map((p, i) => (
              <button
                key={p.title}
                role="tab"
                id={`practice-tab-${i}`}
                aria-selected={active === i}
                aria-controls="practice-panel"
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    e.preventDefault();
                    const next = (i + 1) % 4;
                    setActive(next);
                    document.getElementById(`practice-tab-${next}`)?.focus();
                  }
                  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next = (i + 3) % 4;
                    setActive(next);
                    document.getElementById(`practice-tab-${next}`)?.focus();
                  }
                }}
                tabIndex={active === i ? 0 : -1}
              >
                <span>0{i + 1}</span>
                <span>{p.title}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div
            className="practice-window"
            role="tabpanel"
            id="practice-panel"
            aria-labelledby={`practice-tab-${active}`}
          >
            <div className="practice-art">
              <img
                src="/illustrations/farming-bloom.webp"
                alt="Original illustration of Farm Natura’s vegetables, native fruit and living roots"
                loading="lazy"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={practice.kind}
                  className="practice-symbol"
                  initial={{
                    opacity: 0,
                    scale: reduced ? 1 : 0.8,
                    rotate: reduced ? 0 : -10,
                  }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: reduced ? 1 : 0.9 }}
                  transition={{ duration: reduced ? 0 : 0.5 }}
                >
                  <BotanicalMotif kind={practice.kind} />
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={practice.title}
                initial={{ opacity: 0, y: reduced ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -10 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
              >
                {practice.text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
