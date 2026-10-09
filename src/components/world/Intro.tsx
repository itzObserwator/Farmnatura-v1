import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";
import { chapters } from "../../data/chapters";
import HeroBotanicals from "./HeroBotanicals";
import FarmEntrance from "./FarmEntrance";
export default function Intro({
  onEnter,
  onComplete,
}: {
  onEnter: () => void;
  onComplete: () => void;
}) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [entering, setEntering] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const update = () => setPaused(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    let alive = true,
      loaded = 0;
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(".intro-poster img"),
    );
    const done = () => {
      if (alive)
        setProgress(Math.round((++loaded / Math.max(images.length, 1)) * 100));
    };
    if (!images.length) setProgress(100);
    images.forEach((image) => {
      if (image.complete) done();
      else {
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      }
    });
    return () => {
      alive = false;
    };
  }, []);
  if (entering)
    return (
      <section
        className="intro-screen is-sequence"
        aria-label="Welcome to Farm Natura"
      >
        <FarmEntrance onComplete={onComplete} />
      </section>
    );
  return (
    <section
      className="intro-screen is-poster"
      aria-label="Welcome to Farm Natura"
    >
      {progress < 100 && (
        <span className="intro-loading-status" role="status">
          Loading {progress}%
        </span>
      )}
      <motion.div
        className={`intro-poster ${paused ? "is-paused" : ""}`}
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduced ? 0 : 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <HeroBotanicals />
        {[chapters[0], chapters[2]].map((chapter, index) => (
          <div
            key={chapter.id}
            className={`intro-art intro-art-${index === 0 ? "left" : "right"}`}
          >
            <ResponsiveImage
              className="intro-tree-canopy"
              src={chapter.art}
              alt=""
              aria-hidden="true"
              sizes="(max-width: 767px) 52vw, 32vw"
            />
            <ResponsiveImage
              className="intro-tree-ground"
              src={chapter.art}
              alt={chapter.alt}
              sizes="(max-width: 767px) 52vw, 32vw"
            />
          </div>
        ))}
        <div className="intro-sky" aria-hidden="true">
          <svg
            className="intro-wind-trails"
            viewBox="0 0 1200 500"
            preserveAspectRatio="none"
          >
            <path d="M-180 165Q70 105 270 150T610 140" />
            <path d="M310 90Q510 45 710 100T1060 80" />
            <path d="M650 275Q810 230 1000 270T1400 250" />
          </svg>
          <div className="intro-flying-bird">
            <img
              className="intro-bird-art"
              src="/illustrations/hero/flying-oriole.webp"
              alt=""
              width={480}
              height={320}
            />
          </div>
        </div>
        <div className="intro-brand">
          <span className="mini-label">PLANET GREEN PRESENTS</span>
          <motion.h1
            initial={false}
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
          onClick={() => {
            onEnter();
            setEntering(true);
          }}
          disabled={progress < 100}
        >
          {progress < 100 ? `LOADING ${progress}%` : "ENTER THE FARM"}
        </button>
      </motion.div>
    </section>
  );
}
