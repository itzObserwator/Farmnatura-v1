import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/m";
import { chapters } from "../../data/chapters";
import HeroBotanicals from "./HeroBotanicals";
import heroImages from "../../data/storyHeroImages.json";
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

export default function StoryHero() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    let onscreen = true;
    const update = () => setPaused(document.hidden || !onscreen);
    const observer = new IntersectionObserver(([entry]) => {
      onscreen = entry.isIntersecting;
      update();
    });
    if (hero.current) observer.observe(hero.current);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <section
      ref={hero}
      className="intro-screen is-poster story-scene page-hero"
      data-motion-section="hero"
      aria-labelledby="story-scene-heading"
    >
      <motion.div
        className={`intro-poster ${paused ? "is-paused" : ""}`}
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduced ? 0 : 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <HeroBotanicals scene />
        {[chapters[0], chapters[2]].map((chapter, index) => (
          <div
            key={chapter.id}
            className={`intro-art intro-art-${index === 0 ? "left" : "right"}`}
          >
            <TreeBreeze index={index} active={!reduced && !paused} />
            <picture className="story-scene-picture">
              <source
                type="image/avif"
                srcSet={heroImages.widths
                  .map(
                    (width) =>
                      `/illustrations/hero-scenes/${heroImages.scenes[index]}-${width}.avif ${width}w`,
                  )
                  .join(", ")}
                sizes={heroImages.sizes}
              />
              <ResponsiveImage
                style={{ filter: `url(#tree-breeze-${index})` }}
                className="intro-tree-art"
                fetchPriority="high"
                src={chapter.art}
                srcSet={heroImages.widths
                  .map(
                    (width) =>
                      `/illustrations/hero-scenes/${heroImages.scenes[index]}-${width}.webp ${width}w`,
                  )
                  .join(", ")}
                alt={chapter.alt}
                sizes={heroImages.sizes}
                width={index === 0 ? 1254 : 1280}
                height={index === 0 ? 1254 : 1280}
              />
            </picture>
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
            <picture className="story-scene-picture">
              <source
                type="image/avif"
                srcSet={heroImages.birdWidths
                  .map(
                    (width) =>
                      `/illustrations/hero/flying-oriole-${width}.avif ${width}w`,
                  )
                  .join(", ")}
                sizes={heroImages.birdSizes}
              />
              <img
                className="intro-bird-art"
                src="/illustrations/hero/flying-oriole.webp"
                srcSet={heroImages.birdWidths
                  .map(
                    (width) =>
                      `/illustrations/hero/flying-oriole-${width}.webp ${width}w`,
                  )
                  .join(", ")}
                sizes={heroImages.birdSizes}
                alt=""
                width={480}
                height={320}
              />
            </picture>
          </div>
        </div>
        <div className="story-hero-copy hero-title">
          <span className="chapter-tag">{chapters[0].tag}</span>
          <motion.h1
            id="story-scene-heading"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.7 }}
          >
            {chapters[0].hero.map((line) => (
              <span className="title-line" key={line}>
                <span className="line-inner">{line}</span>
              </span>
            ))}
          </motion.h1>
          <p className="hero-subtitle">{chapters[0].subtitle}</p>
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
      </motion.div>
    </section>
  );
}
