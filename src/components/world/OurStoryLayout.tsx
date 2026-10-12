import type { CSSProperties } from "react";
import ResponsiveImage from "./ResponsiveImage";
import { ArrowUpRight } from "lucide-react";
import { chapters } from "../../data/chapters";
import { storyChapters } from "../../data/story";
import RevealText from "./RevealText";
import StoryChapterIndex from "./StoryChapterIndex";
const story = chapters[0];

/** Victoria Wharf's editorial structure, with Farm Natura's story and original artwork. */
export default function OurStoryLayout({ onVisit }: { onVisit: () => void }) {
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
          <RevealText text="Find a little more life between the soil and the sky" />
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
            src="/images/gallery/farmnatura-collection-14.webp"
            sizes="(max-width: 767px) calc(100vw - 44px), 50vw"
            alt="Aerial view of banana plots, farmhouses and paths at Farm Natura"
            loading="lazy"
          />
        </div>
        <div className="story-second-copy">
          <span className="chapter-tag" data-reveal>
            A LIFE THAT GROWS WITH YOU
          </span>
          <h2 data-text-reveal>
            <RevealText text="A place to put down roots. A little space to simply breathe" />
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
      <StoryChapterIndex />
      <section
        className="story-chapter-cards"
        data-motion-section="story-index"
        aria-labelledby="story-chapters-heading"
      >
        <header className="story-cards-heading">
          <span className="chapter-tag" data-reveal>
            OUR STORY, CHAPTER BY CHAPTER
          </span>
          <h2 id="story-chapters-heading" data-text-reveal>
            <RevealText text="Good living starts with the land" />
          </h2>
          <p data-reveal>
            Discover the people, practices and everyday pleasures that make Farm
            Natura.
          </p>
        </header>
        <div className="farming-cards farming-practice-stack story-card-stack">
          {storyChapters.map((item, index) => (
            <div className="practice-step" key={item.title}>
              <div className="practice-marker" aria-hidden="true" />
              <article
                className="farming-feature-card story-chapter-card"
                style={{ "--card-index": index } as CSSProperties}
                aria-labelledby={`story-card-heading-${index}`}
              >
                <div className="story-card-photo">
                  <ResponsiveImage
                    src={item.image}
                    sizes="(max-width: 767px) calc(100vw - 88px), 560px"
                    alt={item.caption}
                    loading="lazy"
                  />
                </div>
                <h3 id={`story-card-heading-${index}`}>{item.title}</h3>
                <p>{item.text}</p>
                <span className="farming-card-number">0{index + 1} / 06</span>
              </article>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
