import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";
import { ArrowDown, ArrowUpRight, Plus, Minus } from "lucide-react";
import { chapters, type Chapter, type ChapterId } from "../../data/chapters";
import { faqs, contact } from "../../data/content";
import { BotanicalMotif, FloatingDecor } from "./BotanicalMotifs";
import { useChapterAnimations } from "../../hooks/useChapterAnimations";
import Gallery from "./Gallery";
import RevealText from "./RevealText";
import LandscapeChapter from "./LandscapeChapter";
import FarmingExplorer from "./FarmingExplorer";
import LifeMoments from "./LifeMoments";
import NextChapter from "./NextChapter";
export default function ChapterPage({
  chapter,
  onVisit,
  onNavigate,
}: {
  chapter: Chapter;
  onVisit: () => void;
  onNavigate: (id: ChapterId) => void;
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
          <FloatingDecor variant={Number(chapter.number) - 1} />
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
              document
                .getElementById("chapter-intro")
                ?.scrollIntoView({
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                })
            }
            aria-label="Read this chapter"
          >
            <BotanicalMotif
              kind={chapter.id === "living" ? "bird" : "flower"}
            />
            <ArrowDown size={16} />
          </button>
        </div>
      </section>
      <section
        className="chapter-introduction"
        id="chapter-intro"
        data-motion-section="introduction"
      >
        <div className="section-container">
          <span className="chapter-tag" data-reveal>
            {chapter.section}
          </span>
          <h2 className="editorial-statement" data-text-reveal>
            <RevealText text={chapter.intro} />
          </h2>
          <svg
            className="scribble-arrow"
            viewBox="0 0 210 170"
            aria-hidden="true"
          >
            <path
              d="M185 4c-165 2-131 67-72 66 134-4 90 80-97 83m0 0 15-14m-15 14 20 9"
              stroke="currentColor"
              strokeWidth=".8"
              fill="none"
            />
          </svg>
          <div className="editorial-split">
            <div
              className="art-panel"
              style={{
                backgroundColor: chapters[Number(chapter.number) % 3].color,
              }}
              data-reveal
            >
              <img src={chapter.art} alt={chapter.alt} loading="lazy" />
            </div>
            <div className="editorial-body" data-reveal>
              <p>{chapter.body}</p>
              <p>{chapter.secondary}</p>
              <button className="paper-button" onClick={onVisit}>
                COME, WALK THE LAND <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <LandscapeChapter chapter={chapter} />
      {chapter.id === "living" && <LifeMoments />}
      {chapter.id === "story" ? (
        <section
          className="impact-section"
          id="our-roots"
          data-motion-section="impact"
        >
          <div className="section-container">
            <span className="chapter-tag" data-reveal>
              ROOTED IN SOMETHING REAL
            </span>
            <h2 data-text-reveal>
              <RevealText text={chapter.statement} />
            </h2>
            <p className="impact-description" data-reveal>
              A managed farm that gives families time to reconnect, while
              dedicated agronomy staff care for the land.
            </p>
            <div className="impact-grid">
              {[
                ["110+", "Acres of managed farmland"],
                ["6+", "Years of soil revitalisation"],
                ["4", "Years of managed maintenance"],
              ].map(([number, label]) => (
                <div key={number} data-reveal>
                  <strong
                    data-count={number.replace("+", "")}
                    data-suffix={number.includes("+") ? "+" : ""}
                  >
                    {number}
                  </strong>
                  <p>{label}</p>
                </div>
              ))}
            </div>
            <p className="impact-note">
              Estate and maintenance details as described by Farm Natura. Ask
              our team for current agreements and availability.
            </p>
          </div>
        </section>
      ) : chapter.id === "farming" ? (
        <FarmingExplorer />
      ) : (
        <section className="location-section" id="location">
          <div className="section-container">
            <span className="chapter-tag" data-reveal>
              KANDUKUR · HYDERABAD
            </span>
            <h2 data-text-reveal>
              <RevealText text={chapter.statement} />
            </h2>
            <p className="location-intro" data-reveal>
              Along the Srisailam Highway corridor.
              <br />A different world, just outside the city.
            </p>
            <div className="location-grid" data-reveal>
              {[
                ["25", "minutes from the airport"],
                ["20", "minutes from Tukkuguda ORR"],
              ].map(([n, label]) => (
                <div key={n}>
                  <strong>
                    {n}
                    <span>MIN</span>
                  </strong>
                  <p>{label}</p>
                </div>
              ))}
            </div>
            <p className="impact-note">
              Approximate travel times published by Farm Natura; your route and
              traffic may vary.
            </p>
            <a
              className="paper-button"
              href="https://www.google.com/maps/search/?api=1&query=Farm+Natura+Kandukur"
              target="_blank"
              rel="noreferrer"
            >
              FIND YOUR WAY <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      )}
      {chapter.id === "living" && <Gallery />}
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
