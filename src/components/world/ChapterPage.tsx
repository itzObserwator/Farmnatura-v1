import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";
import { ArrowDown, ArrowUpRight, Plus, Minus } from "lucide-react";
import { chapters, type Chapter, type ChapterId } from "../../data/chapters";
import { faqs, contact } from "../../data/content";
import { BotanicalMotif } from "./BotanicalMotifs";
import { useChapterAnimations } from "../../hooks/useChapterAnimations";
import FarmLifeLayout from "./FarmLifeLayout";
import RevealText from "./RevealText";
import NaturalFarmingLayout from "./NaturalFarmingLayout";
import NextChapter from "./NextChapter";
import HeroBotanicals from "./HeroBotanicals";
import OurStoryLayout from "./OurStoryLayout";
export default function ChapterPage({
  chapter,
  onVisit,
  onNavigate,
  onGallery,
}: {
  chapter: Chapter;
  onVisit: () => void;
  onNavigate: (id: ChapterId) => void;
  onGallery: () => void;
}) {
  const reduced = useReducedMotion();
  const [faq, setFaq] = useState<number | null>(null);
  useChapterAnimations();
  const next =
    chapters[(chapters.findIndex((c) => c.id === chapter.id) + 1) % 3];
  return (
    <article className={`chapter-page page-${chapter.id}`}>
      <section
        className="page-hero"
        data-motion-section="hero"
        style={{ backgroundColor: chapter.color }}
      >
        <div className="hero-decor">
          <HeroBotanicals variant={Number(chapter.number) - 1} />
        </div>
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
            <img
              className="hero-scroll-art"
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
      {chapter.id === "living" && (
        <section className="faq-section" id="questions">
          <div className="section-container">
            <span className="chapter-tag" data-reveal>
              A LITTLE MORE TO KNOW
            </span>
            <h2 data-reveal>
              Before you put
              <br />
              down roots.
            </h2>
            <div className="faq-list">
              {faqs.map(([q, a], i) => (
                <div key={q}>
                  <button
                    aria-expanded={faq === i}
                    aria-controls={`answer-${i}`}
                    onClick={() => setFaq(faq === i ? null : i)}
                  >
                    {q}
                    {faq === i ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                  <AnimatePresence initial={false}>
                    {faq === i && (
                      <motion.div
                        id={`answer-${i}`}
                        initial={{ height: reduced ? "auto" : 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: reduced ? "auto" : 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <p>{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
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
      <footer className="chapter-footer">
        <div>
          <BrandLogo className="footer-logo" />
          <span>BY PLANET GREEN</span>
          <a href={`tel:${contact.tel}`}>{contact.phone} ↗</a>
        </div>
        <div>
          <a
            href="https://www.instagram.com/farmnatura.in/"
            target="_blank"
            rel="noreferrer"
          >
            INSTAGRAM ↗
          </a>
          <span>© {new Date().getFullYear()} FARM NATURA</span>
        </div>
      </footer>
      <NextChapter chapter={next} onNavigate={onNavigate} />
    </article>
  );
}
