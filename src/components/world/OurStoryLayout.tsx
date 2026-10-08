import ResponsiveImage from "./ResponsiveImage";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { chapters } from "../../data/chapters";
import { storyChapters } from "../../data/story";
import RevealText from "./RevealText";
import PhotoTransition from "./PhotoTransition";
const story = chapters[0];

/** Victoria Wharf's editorial structure, with Farm Natura's story and original artwork. */
export default function OurStoryLayout({ onVisit }: { onVisit: () => void }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const selected = storyChapters[active];
  return (
    <div className="our-story-layout">
      <section
        className="story-opening"
        id="chapter-intro"
        data-motion-section="introduction"
      >
        <span className="chapter-tag" data-reveal>
          THE JOY OF FARM NATURA
        </span>
        <h2 data-text-reveal>
          <RevealText text="Find a little more life between the soil and the sky." />
        </h2>
      </section>
      <section className="story-first-split" data-motion-section="story-roots">
        <div className="story-first-copy" data-reveal>
          <p>{story.body}</p>
          <p>{story.secondary}</p>
          <button className="paper-button" onClick={onVisit}>
            COME, WALK THE LAND <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="story-grove">
          <div className="story-grove-surface" />
          <ResponsiveImage
            className="story-grove-art"
            src={story.art}
            alt={story.alt}
            loading="lazy"
          />
          <ResponsiveImage
            className="story-grove-flower story-drift"
            src="/illustrations/hero/marigold-stem.webp"
            alt=""
            loading="lazy"
          />
          <ResponsiveImage
            className="story-grove-bird story-drift"
            src="/illustrations/hero/orchard-bird.webp"
            alt=""
            loading="lazy"
          />
        </div>
      </section>
      <div
        className="story-curved-line"
        role="img"
        aria-label="Rooted in the land. Growing together."
      >
        <svg viewBox="0 0 1440 150" aria-hidden="true">
          <defs>
            <path id="story-line-curve" d="M-20 127 Q700 20 1460 135" />
          </defs>
          <text>
            <textPath
              href="#story-line-curve"
              startOffset="50%"
              textAnchor="middle"
            >
              Rooted in the land. Growing together.
            </textPath>
          </text>
        </svg>
      </div>
      <section
        className="story-second-split"
        data-motion-section="story-landscape"
      >
        <div className="story-farm-frame" data-image-reveal>
          <ResponsiveImage
            src="/images/story-farmland.webp"
            alt="Aerial view of green crop beds and banana trees at Farm Natura"
            loading="lazy"
          />
        </div>
        <div className="story-second-copy">
          <span className="chapter-tag" data-reveal>
            A LIFE THAT GROWS WITH YOU
          </span>
          <h2 data-text-reveal>
            <RevealText text="A place to put down roots. A little space to simply breathe." />
          </h2>
          <p data-reveal>{story.intro}</p>
          <ResponsiveImage
            className="story-quote-foliage story-drift"
            src="/illustrations/hero/native-foliage.webp"
            alt=""
            loading="lazy"
          />
        </div>
      </section>
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
        <ol className="story-index-list">
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
        <aside className="story-index-panel" id="story-index-panel">
          <span className="chapter-tag">OUR STORY, CHAPTER BY CHAPTER</span>
          <p className="story-index-about">
            Good living starts with the land. Discover the people, practices and
            everyday pleasures that make Farm Natura.
          </p>
          <StoryFacts />
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
              <ResponsiveImage src={selected.image} alt={selected.caption} loading="lazy" />
              <PhotoTransition src={selected.image} />
            </div>
            <span className="story-selection-caption">{selected.caption}</span>
          </div>
        </aside>
        <div className="story-index-mobile-facts">
          <StoryFacts />
        </div>
      </section>
    </div>
  );
}

function StoryFacts() {
  return (
    <>
      <div className="story-facts" aria-label="Farm Natura in numbers">
        {[
          ["110", "+", "Acres of managed farmland"],
          ["6", "+", "Years of soil revitalisation"],
          ["4", "", "Years of managed maintenance"],
        ].map(([number, suffix, label]) => (
          <div key={number}>
            <strong data-count={number} data-suffix={suffix}>
              {number}
              {suffix}
            </strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="story-facts-note">
        As described by Farm Natura. Ask our team for current agreements and
        availability.
      </p>
    </>
  );
}
