import ResponsiveImage from "./ResponsiveImage";
import { ArrowUpRight } from "lucide-react";
import { chapters } from "../../data/chapters";
import { lifeFacts } from "../../data/life";
import RevealText from "./RevealText";
import LivingSurface from "./LivingSurface";
import Gallery from "./Gallery";
import HandDrawnMotif from "./HandDrawnMotif";
const life = chapters[2];

/** About's editorial sequence: statement, botanical split, photo split, media and facts. */
export default function FarmLifeLayout({
  onVisit,
  onGallery,
}: {
  onVisit: () => void;
  onGallery: () => void;
}) {
  return (
    <div className="farm-life-layout">
      <section
        className="life-opening"
        id="chapter-intro"
        data-motion-section="life-introduction"
      >
        <span className="chapter-tag" data-reveal>
          ABOUT FARM LIFE
        </span>
        <h2 data-text-reveal>
          <RevealText text="A little more space for the things that matter. For family, for nature, and for a life that grows with you." />
        </h2>
        <HandDrawnMotif
          kind="sprig"
          className="life-opening-sprig"
          loading="lazy"
        />
      </section>
      <section
        className="life-first-split"
        data-motion-section="life-botanical"
      >
        <div className="life-flower-scene">
          <LivingSurface className="life-flower-surface" color="#fff3b5" />
          <ResponsiveImage
            className="life-marigold"
            src="/illustrations/hero/marigold-stem.webp"
            alt="Hand-drawn marigolds, leaves and buds"
            loading="lazy"
          />
          <ResponsiveImage
            className="life-flower-bird"
            src="/illustrations/hero/orchard-bird.webp"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="life-first-copy" data-reveal>
          <p>{life.body}</p>
          <p>{life.secondary}</p>
          <button className="paper-button" onClick={onVisit}>
            COME, WALK THE LAND <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
      <section
        className="life-second-split"
        data-motion-section="life-weekends"
      >
        <div className="life-weekend-copy" data-reveal>
          <span className="chapter-tag">TIME TOGETHER</span>
          <h3>A weekend with room to breathe.</h3>
          <p>
            Return to the farmhouse, share a meal, and enjoy a slower day with
            the people you love.
          </p>
          <p>
            Orchard walks, seasonal harvests and conversations around the table.
            A different rhythm, close enough to return to.
          </p>
        </div>
        <div className="life-photo-scene">
          <LivingSurface className="life-photo-surface" color="#dce8cc" />
          <ResponsiveImage
            className="life-weekend-photo"
            src="/images/farmhouse.webp"
            alt="A farmhouse at Farm Natura"
            loading="lazy"
          />
          <ResponsiveImage
            className="life-table-photo"
            src="/images/garden-planter.webp"
            alt="A wooden garden planter among greenery at Farm Natura"
            loading="lazy"
          />
          <ResponsiveImage
            className="life-photo-foliage"
            src="/illustrations/hero/native-foliage.webp"
            alt=""
            loading="lazy"
          />
        </div>
      </section>
      <Gallery variant="story" onOpenGallery={onGallery} />
      <section className="life-impact" data-motion-section="life-impact">
        <div className="life-impact-label">
          <span className="chapter-tag" data-reveal>
            GROWING A FULLER LIFE
          </span>
          <ResponsiveImage
            src="/illustrations/hero/mango-branch.webp"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="life-impact-copy">
          <h2 data-text-reveal>
            <RevealText text="A little closer to the land. A little closer to each other." />
          </h2>
          <p data-reveal>
            You own the land while a dedicated team cares for everyday farming.
            Make space for time outdoors, shared harvests and the people you
            love.
          </p>
          <p data-reveal>
            Farm Natura brings managed natural farming and farmhouse living
            together in Kandukur, near Hyderabad. Meet the team to understand
            current availability, ownership details and the maintenance
            programme.
          </p>
        </div>
      </section>
      <section
        className="life-statistics"
        aria-label="Farm Natura in numbers"
        data-motion-section="life-statistics"
      >
        {lifeFacts.map((fact) => (
          <div className="life-statistic" key={fact.label}>
            <div className="life-statistic-value">
              <strong data-count={fact.value}>{fact.value}</strong>
              <span>{fact.suffix}</span>
            </div>
            <svg viewBox="0 0 300 10" aria-hidden="true">
              <path
                d="M1 3Q130 10 299 3"
                fill="none"
                stroke="currentColor"
                strokeWidth=".7"
              />
            </svg>
            <p>{fact.label}</p>
          </div>
        ))}
        <p className="life-statistics-note">
          Figures and travel times are as described by Farm Natura; journeys
          vary with route and traffic. The three values are Indulge, Involve and
          Impact nature. Confirm current maintenance terms with our team.
        </p>
        <a
          className="paper-button"
          href="https://www.google.com/maps/search/?api=1&query=Farm+Natura+Kandukur"
          target="_blank"
          rel="noreferrer"
        >
          FIND YOUR WAY <ArrowUpRight size={16} />
        </a>
      </section>
    </div>
  );
}
