import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "../../icons";
import { lifeFacts } from "../../data/life";
import { faqs } from "../../data/content";
import HandDrawnMotif from "./HandDrawnMotif";
import RevealText from "./RevealText";
import StoryGoldenYears from "./StoryGoldenYears";

export default function StoryClosingSections({
  onVisit,
}: {
  onVisit: () => void;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();
  return (
    <div className="story-closing-sections">
      <StoryGoldenYears />
      <section className="story-estate" aria-labelledby="story-estate-title">
        <div className="story-estate-intro">
          <header>
            <h2 id="story-estate-title" data-text-reveal>
              <RevealText text="A little closer to the land. A little closer to each other." />
            </h2>
          </header>
          <div className="story-estate-copy" data-reveal>
            <p>
              You own the land while a dedicated team cares for everyday
              farming. Make space for time outdoors, shared harvests and the
              people you love.
            </p>
            <p>
              Farm Natura brings managed natural farming and farmhouse living
              together in Kandukur, near Hyderabad. Meet the team to understand
              current availability, ownership details and the maintenance
              programme.
            </p>
            <button
              className="paper-button story-brochure-cta"
              onClick={onVisit}
            >
              DOWNLOAD BROCHURE <Download size={16} />
            </button>
          </div>
        </div>
        <div className="story-estate-ledger">
          <div className="story-estate-art" aria-hidden="true">
            <HandDrawnMotif kind="mango" loading="lazy" />
          </div>
          <dl
            className="story-estate-facts"
            aria-label="Farm Natura in numbers"
          >
            {lifeFacts.map((fact) => (
              <div className="story-estate-fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  <span data-count={fact.value}>{fact.value}</span>
                  <small>{fact.suffix}</small>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="story-estate-footnote">
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
      <section
        className="story-questions"
        id="questions"
        aria-labelledby="story-questions-title"
      >
        <header className="story-questions-heading">
          <h2 id="story-questions-title" data-text-reveal>
            <RevealText text="Before you put down roots." />
          </h2>
          <HandDrawnMotif
            kind="sprig"
            className="story-questions-sprig"
            loading="lazy"
          />
        </header>
        <div className="story-question-list">
          {faqs.map(([question, answer], index) => (
            <div
              className="story-question"
              data-reveal
              data-open={open === index}
              key={question}
            >
              <button
                id={`question-${index}`}
                aria-label={question}
                aria-expanded={open === index}
                aria-controls={`answer-${index}`}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span className="story-question-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{question}</span>
                <span className="story-question-arrow" aria-hidden="true">
                  <ArrowDown size={18} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    id={`answer-${index}`}
                    role="region"
                    aria-labelledby={`question-${index}`}
                    initial={{ height: reduced ? "auto" : 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: reduced ? "auto" : 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p>{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
