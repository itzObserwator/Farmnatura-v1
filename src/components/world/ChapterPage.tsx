import ResponsiveImage from "./ResponsiveImage";
import FarmFooter from "./FarmFooter";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { chapters, type Chapter, type ChapterId } from "../../data/chapters";
import { BotanicalMotif } from "./BotanicalMotifs";
import { useChapterAnimations } from "../../hooks/useChapterAnimations";
import {
  FarmLifeLayoutView as FarmLifeLayout,
  FarmingLayoutView as NaturalFarmingLayout,
} from "./DeferredViews";
import RevealText from "./RevealText";
import NextChapter from "./NextChapter";
import HeroBotanicals from "./HeroBotanicals";
import OurStoryLayout from "./OurStoryLayout";
import HeroBackdrop from "./HeroBackdrop";
import StoryClosingSections from "./StoryClosingSections";
export default function ChapterPage({
  chapter,
  onVisit,
  onNavigate,
  onGallery,
  blocked,
}: {
  chapter: Chapter;
  onVisit: () => void;
  onNavigate: (id: ChapterId) => void;
  onGallery: () => void;
  blocked: boolean;
}) {
  useChapterAnimations();
  const next =
    chapters[(chapters.findIndex((c) => c.id === chapter.id) + 1) % 3];
  return (
    <article className={`chapter-page page-${chapter.id}`}>
      <section className="page-hero" data-motion-section="hero">
        <HeroBackdrop color={chapter.color}>
          <div className="hero-decor">
            <HeroBotanicals variant={Number(chapter.number) - 1} />
          </div>
        </HeroBackdrop>
        <div className="hero-title">
          <span className="chapter-tag">{chapter.tag}</span>
          <h1>
            {chapter.hero.map((line) => (
              <span className="title-line" key={line}>
                <span className="line-inner">
                  <RevealText text={line} />
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">{chapter.subtitle}</p>
          <button
            className="hero-scroll"
            onClick={() =>
              document.getElementById("chapter-intro")?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
            }
            aria-label="Read this chapter"
          >
            <ResponsiveImage
              className="hero-scroll-art"
              srcSet="/illustrations/hero/marigold-stem-120.avif 120w, /illustrations/hero/marigold-stem-240.avif 240w"
              sizes="45px"
              src="/illustrations/hero/marigold-stem.webp"
              alt=""
              width={45}
              height={60}
            />
            <ArrowDown size={16} />
          </button>
        </div>
      </section>
      {chapter.id === "story" ? (
        <OurStoryLayout onVisit={onVisit} />
      ) : chapter.id === "farming" ? (
        <NaturalFarmingLayout onVisit={onVisit} />
      ) : (
        <FarmLifeLayout onVisit={onVisit} onGallery={onGallery} />
      )}
      {chapter.id === "story" && <StoryClosingSections onVisit={onVisit} />}
      <section
        className="visit-invitation"
        style={{ backgroundColor: chapter.color }}
      >
        <BotanicalMotif kind="sprig" className="invitation-sprig" />
        <span className="chapter-tag" data-reveal>
          A NEW CHAPTER STARTS WITH A WALK
        </span>
        <h2 data-reveal>
          A little more land.
          <br />A little more life.
        </h2>
        <p data-reveal>Come and discover what could grow here.</p>
        <button className="paper-button" onClick={onVisit}>
          PLAN YOUR VISIT <ArrowUpRight size={16} />
        </button>
      </section>
      <NextChapter
        chapter={next}
        onNavigate={(id) => (id === "gallery" ? onGallery() : onNavigate(id))}
        blocked={blocked}
      />
      <FarmFooter
        onVisit={onVisit}
        onNavigate={(id) => (id === "gallery" ? onGallery() : onNavigate(id))}
      />
    </article>
  );
}
