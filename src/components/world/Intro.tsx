import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";
import { chapters } from "../../data/chapters";
import HeroBotanicals from "./HeroBotanicals";
export default function Intro({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"poster" | "sequence">("poster");
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let alive = true,
      loaded = 0;
    chapters.forEach((c) => {
      const img = new Image();
      const done = () => {
        if (alive) setProgress(Math.round((++loaded / chapters.length) * 100));
      };
      img.onload = done;
      img.onerror = done;
      img.src = c.art;
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (stage !== "sequence") return;
    const interval = window.setInterval(
      () => setFrame((f) => (f + 1) % 3),
      2400,
    );
    const timeout = window.setTimeout(onComplete, 7600);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [stage, onComplete]);
  return (
    <section
      className={`intro-screen is-${stage}`}
      aria-label="Welcome to Farm Natura"
    >
      <AnimatePresence>
        {progress < 100 && (
          <motion.div
            className="asset-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
          >
            <motion.div
              className="loader-grove"
              animate={
                reduced
                  ? {}
                  : {
                      rotate: [-12, 16, -12],
                      borderRadius: [
                        "43% 57% 61% 39% / 51% 40% 60% 49%",
                        "63% 37% 38% 62% / 42% 58% 42% 58%",
                        "43% 57% 61% 39% / 51% 40% 60% 49%",
                      ],
                    }
              }
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={chapters[0].art} alt="" />
            </motion.div>
            <span className="loader-percentage" role="status">
              {progress}%
            </span>
            <span className="loader-label">LOADING</span>
          </motion.div>
        )}
      </AnimatePresence>
      {stage === "poster" ? (
        <>
          <motion.div
            className="intro-poster"
            initial={{ opacity: 0, scale: reduced ? 1 : 0.975 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduced ? 0 : 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <HeroBotanicals />
            <img
              className="intro-art intro-art-left"
              src={chapters[0].art}
              alt="Original illustrated mango grove"
            />
            <img
              className="intro-art intro-art-right"
              src={chapters[2].art}
              alt={chapters[2].alt}
            />
            <div className="intro-brand">
              <span className="mini-label">PLANET GREEN PRESENTS</span>
              <motion.h1
                initial={{ opacity: 0, y: reduced ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Life from
                <br />
                <em>the land.</em>
              </motion.h1>
              <BrandLogo className="intro-logo" />
              <p>ROOTED IN NATURE. GROWN TOGETHER.</p>
            </div>
            <svg
              className="intro-land"
              viewBox="0 0 1400 220"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 94q160-112 360-35t400-15 340 6 300-12v182H0"
                fill="#a9c79a"
              />
              <path
                d="M0 136q220-89 410 4t390-3 400-25 200 9v99H0"
                fill="#3c7a3a"
              />
              {Array.from({ length: 16 }, (_, i) => (
                <path
                  key={i}
                  d={`M${i * 90 - 500} 220q360-150 1000-58`}
                  stroke="#b5cf83"
                  strokeWidth="2"
                  fill="none"
                />
              ))}
            </svg>
            <button
              className="paper-button enter-button"
              onClick={() => setStage("sequence")}
              disabled={progress < 100}
            >
              {progress < 100 ? `LOADING ${progress}%` : "ENTER THE FARM"}
            </button>
          </motion.div>
          <button
            className="intro-direct"
            aria-label="Skip intro"
            onClick={onComplete}
          >
            Skip intro ↗
          </button>
        </>
      ) : (
        <>
          <div className="intro-film">
            <img
              key={frame}
              src={
                [
                  "/images/farm.jpg",
                  "/images/farmhouse.jpg",
                  "/images/goshala.jpg",
                ][frame]
              }
              alt={
                [
                  "Farm Natura’s green estate",
                  "A farmhouse at Farm Natura",
                  "Farm Natura goshala",
                ][frame]
              }
            />
            <div className="intro-film-copy">
              <span className="mini-label">FARM NATURA · KANDUKUR</span>
              <h2>
                {
                  [
                    "A little closer to nature.",
                    "A place to put down roots.",
                    "A life that grows with you.",
                  ][frame]
                }
              </h2>
            </div>
            <span className="film-progress" />
          </div>
          <button
            className="paper-button intro-skip"
            aria-label="Skip intro"
            onClick={onComplete}
          >
            SKIP INTRO
          </button>
        </>
      )}
    </section>
  );
}
