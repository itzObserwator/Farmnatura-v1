import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";
import { chapters } from "../../data/chapters";
import HeroBotanicals from "./HeroBotanicals";
import FarmEntrance from "./FarmEntrance";
// A continuous displacement field bends only the crown. The neutral lower
// half keeps the people, baskets and ground at their original pixels.
const breezeMap = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8000"/><stop offset="0.36" stop-color="#b08000"/><stop offset="0.47" stop-color="#808000"/><stop offset="1" stop-color="#808000"/></linearGradient></defs><rect width="100" height="100" fill="url(#b)"/></svg>`)}`;

function TreeBreeze({ index, active }: { index: number; active: boolean }) {
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const filterSvg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!active) {
      displacement.current?.setAttribute("scale", "0");
      return;
    }
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let strength = 0;
    const art = filterSvg.current?.parentElement?.querySelector("img");
    const measure = () => {
      // Match the original broad sway, proportional to the artwork size.
      // Displacement peaks at half the scale: about 4% of the tree height.
      strength = (art?.clientHeight ?? 0) * 0.08;
    };
    const observer = new ResizeObserver(measure);
    if (art) observer.observe(art);
    measure();
    const tick = (time: number) => {
      if (time - last > 32) {
        const wave = Math.sin(time / (index ? 2200 : 1900) + index * 2.5);
        displacement.current?.setAttribute("scale", String(wave * strength));
        last = time;
      }
      frame = requestAnimationFrame(tick);
    };
    const updatePreference = () => {
      cancelAnimationFrame(frame);
      if (preference.matches) displacement.current?.setAttribute("scale", "0");
      else frame = requestAnimationFrame(tick);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", updatePreference);
      observer.disconnect();
    };
  }, [active, index]);
  return (
    <svg ref={filterSvg} className="intro-breeze-filter" aria-hidden="true">
      <defs>
        <filter
          id={`tree-breeze-${index}`}
          x="0"
          y="0"
          width="1"
          height="1"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={breezeMap}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="breeze"
          />
          <feComponentTransfer in="breeze" result="field">
            <feFuncR type="linear" slope="1" intercept={-1 / 510} />
            <feFuncG type="linear" slope="1" intercept={-1 / 510} />
          </feComponentTransfer>
          <feDisplacementMap
            ref={displacement}
            in="SourceGraphic"
            in2="field"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

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
            <TreeBreeze index={index} active={!reduced && !paused} />
            <ResponsiveImage
              style={{ filter: `url(#tree-breeze-${index})` }}
              className="intro-tree-art"
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
