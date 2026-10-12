import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/m";
import { storyChapters } from "../../data/story";
import PhotoTransition from "./PhotoTransition";

/** Desktop chapter list with its scroll-synchronised sticky preview. */
export default function StoryChapterIndex() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const selected = storyChapters[active];
  useEffect(() => {
    let frame = 0;
    const panel = panelRef.current;
    const sizeObserver = new ResizeObserver(() => {
      if (panel)
        listRef.current?.style.setProperty(
          "--story-preview-height",
          `${panel.offsetHeight}px`,
        );
    });
    if (panel) sizeObserver.observe(panel);
    const updateChapter = () => {
      frame = 0;
      const rows = listRef.current?.children;
      if (!rows?.length) return;
      const readingLine = Math.min(
        240,
        Math.max(150, window.innerHeight * 0.3),
      );
      let chapter = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].getBoundingClientRect().top <= readingLine) chapter = i;
      }
      setActive(chapter);
    };
    const onScroll = () => {
      if (innerWidth < 768) return;
      if (!frame) frame = requestAnimationFrame(updateChapter);
    };
    updateChapter();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <section
      className="story-index"
      data-motion-section="story-index"
      aria-label="Discover our story"
    >
      <div className="story-index-introduction">
        <span className="chapter-tag">OUR STORY, CHAPTER BY CHAPTER</span>
        <p>
          Good living starts with the land. Discover the people, practices and
          everyday pleasures that make Farm Natura.
        </p>
      </div>
      <ol className="story-index-list" ref={listRef}>
        {storyChapters.map((item, i) => (
          <li key={item.title} data-reveal>
            <button
              aria-pressed={active === i}
              aria-controls="story-index-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="story-index-arrow" aria-hidden="true">
                ↗
              </span>
              <span className="story-index-number">0{i + 1}</span>
              <span>{item.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <aside
        className="story-index-panel"
        id="story-index-panel"
        ref={panelRef}
      >
        <span className="chapter-tag">OUR STORY, CHAPTER BY CHAPTER</span>
        <p className="story-index-about">
          Good living starts with the land. Discover the people, practices and
          everyday pleasures that make Farm Natura.
        </p>
        <div className="story-selection">
          <AnimatePresence mode="wait">
            <motion.p
              key={selected.title}
              initial={{ opacity: 0, y: reduced ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
            >
              {selected.text}
            </motion.p>
          </AnimatePresence>
          <div className="story-selection-photo">
            <ResponsiveImage
              src={selected.image}
              sizes="(max-width: 767px) calc(100vw - 44px), 40vw"
              alt={selected.caption}
              loading="lazy"
            />
            <PhotoTransition src={selected.image} />
          </div>
        </div>
      </aside>
    </section>
  );
}
