import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";
import { chapters } from "../../data/chapters";
import HeroBotanicals from "./HeroBotanicals";
import FarmEntrance from "./FarmEntrance";
import { Sprout } from "lucide-react";
export default function Intro({
  onComplete,
  onEnter,
}: {
  onComplete: () => void;
  onEnter: () => void;
}) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"poster" | "sequence">("poster");
  useEffect(() => {
    let alive = true,
      loaded = 0;
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".intro-poster img"));
    const done = () => {
      if (alive) setProgress(Math.round((++loaded / Math.max(images.length, 1)) * 100));
    };
    if (!images.length) setProgress(100);
    images.forEach(image => {
      if (image.complete) done();
      else { image.addEventListener('load',done,{once:true}); image.addEventListener('error',done,{once:true}); }
    });
    return () => {
      alive = false;
    };
  }, []);
  return (
    <section
      className={`intro-screen is-${stage}`}
      aria-label="Welcome to Farm Natura"
    >
      {progress < 100 && <span className="intro-loading-status" role="status">Loading {progress}%</span>}
      {stage === "poster" ? (
        <>
          <motion.div
            className="intro-poster"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduced ? 0 : 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <HeroBotanicals />
            <ResponsiveImage
              className="intro-art intro-art-left"
              src={chapters[0].art}
              alt="Original illustrated mango grove"
            />
            <ResponsiveImage
              className="intro-art intro-art-right"
              src={chapters[2].art}
              alt={chapters[2].alt}
            />
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
                setStage("sequence");
              }}
              disabled={progress < 100}
            >
              {progress < 100 ? `LOADING ${progress}%` : "ENTER THE FARM"}
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <FarmEntrance onComplete={onComplete} />
        </>
      )}
      <button
        className={`intro-shortcut ${stage === "poster" ? "intro-direct" : "intro-skip"}`}
        aria-label="Skip intro"
        onClick={onComplete}
      >
        <Sprout size={20} strokeWidth={1.3} aria-hidden="true" />
        <span>Skip the welcome</span>
      </button>
    </section>
  );
}
