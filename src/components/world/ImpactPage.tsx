import { ArrowDown, ArrowUpRight, MapPin } from "../../icons";
import type { PageId } from "../../data/routes";
import {
  impactAwards,
  impactBenefits,
  impactGrounds,
  impactInspirations,
  impactPlots,
  impactResearch,
  legalDocuments,
} from "../../data/impact";
import { useChapterAnimations } from "../../hooks/useChapterAnimations";
import HeroBackdrop from "./HeroBackdrop";
import HeroBotanicals from "./HeroBotanicals";
import RevealText from "./RevealText";
import ResponsiveImage from "./ResponsiveImage";
import HandDrawnMotif from "./HandDrawnMotif";
import NextChapter from "./NextChapter";
import FarmFooter from "./FarmFooter";

function SectionHeading({
  tag,
  title,
  intro,
}: {
  tag: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="impact-section-heading">
      <span className="chapter-tag" data-reveal>
        {tag}
      </span>
      <h2 data-text-reveal>
        <RevealText text={title} />
      </h2>
      {intro && <p data-reveal>{intro}</p>}
    </header>
  );
}

export default function ImpactPage({
  onVisit,
  onLegalRequest = onVisit,
  onNavigate,
  blocked,
}: {
  onVisit: () => void;
  onLegalRequest?: () => void;
  onNavigate: (id: PageId) => void;
  blocked: boolean;
}) {
  useChapterAnimations();
  return (
    <article className="impact-page">
      <section className="page-hero impact-hero" data-motion-section="hero">
        <HeroBackdrop color="#f4efd9">
          <div className="hero-decor">
            <HeroBotanicals variant={1} />
          </div>
        </HeroBackdrop>
        <div className="hero-title">
          <span className="chapter-tag">A VISION ROOTED IN NATURE</span>
          <h1 aria-label="Involve.Indulge.Impact">
            {["INVOLVE.", "INDULGE.", "IMPACT"].map((line) => (
              <span className="title-line" key={line}>
                <span className="line-inner">
                  <RevealText text={line} />
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">
            The people, purpose and practices behind a life closer to the land.
          </p>
          <button
            className="hero-scroll"
            aria-label="Discover Involve.Indulge.Impact"
            onClick={() =>
              document.getElementById("impact-intro")?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              })
            }
          >
            <ResponsiveImage
              className="hero-scroll-art"
              src="/illustrations/hero/marigold-stem.webp"
              sizes="45px"
              width={45}
              height={60}
              alt=""
            />
            <ArrowDown size={16} />
          </button>
        </div>
      </section>
      <div className="impact-editorial">
        <section
          className="impact-founder section-container"
          id="impact-intro"
          aria-labelledby="founder-vision-heading"
        >
          <div className="impact-founder-copy">
            <span className="chapter-tag" data-reveal>
              FOUNDER’S VISION
            </span>
            <h2 id="founder-vision-heading" data-text-reveal>
              <RevealText text="A farm with a purpose. A life with deeper roots" />
            </h2>
            <p className="impact-lead" data-reveal>
              Reconnect families with nature through natural farming and
              self-sustaining communities.
            </p>
            <p data-reveal>
              Farm Natura brings traditional wisdom and ecological care
              together, making the land a place to nourish daily life as well as
              future generations.
            </p>
            <button className="paper-button" onClick={onVisit}>
              MEET THE FARM <ArrowUpRight size={16} />
            </button>
          </div>
          <figure className="impact-founder-photo">
            <div className="impact-photo-frame" data-image-reveal>
              <ResponsiveImage
                src="/images/gallery/farmnatura-collection-13.webp"
                alt="An aerial view of the cultivated land and community at Farm Natura"
                loading="lazy"
                sizes="(max-width: 767px) calc(100vw - 44px), 48vw"
              />
            </div>
            <HandDrawnMotif
              kind="mango"
              className="impact-founder-mango"
              loading="lazy"
              sizes="150px"
            />
          </figure>
        </section>
        <section
          className="impact-pillars section-container"
          aria-label="Our three guiding values"
        >
          {[
            [
              "Involve",
              "A hand in the harvest",
              "Take part in the rhythms of the farm and the life of its community.",
            ],
            [
              "Indulge",
              "A little room to breathe",
              "Enjoy slow mornings, open skies and time with the people you love.",
            ],
            [
              "Impact",
              "A legacy that lives",
              "Care for the land today and make space for what grows tomorrow.",
            ],
          ].map(([name, title, text], index) => (
            <article key={name} data-reveal>
              <span className="impact-number">0{index + 1}</span>
              <h2>{name}</h2>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
        <section
          className="impact-research"
          aria-labelledby="impact-research-heading"
        >
          <div className="section-container impact-research-layout">
            <header className="impact-research-intro">
              <span className="chapter-tag" data-reveal>
                RESEARCH & DEVELOPMENT
              </span>
              <h2 id="impact-research-heading" data-text-reveal>
                <RevealText text="Listen to the land. Keep learning" />
              </h2>
              <p data-reveal>
                The farm's research begins with respect for nature: restore
                fertility, support biodiversity and grow an ecologically
                balanced way of life.
              </p>
              <HandDrawnMotif
                kind="sprig"
                className="impact-research-sprig"
                loading="lazy"
                sizes="150px"
              />
            </header>
            <div className="impact-research-notes">
              {impactResearch.map((research, index) => (
                <article key={research.title} data-reveal>
                  <span className="impact-number">0{index + 1}</span>
                  <h3>{research.title}</h3>
                  <p>{research.text}</p>
                </article>
              ))}
              <ResponsiveImage
                className="impact-research-art"
                src="/illustrations/living-ecosystem-folk.webp"
                alt="Folk art illustration of living roots, crops, birds and pollinators"
                loading="lazy"
                sizes="(max-width: 767px) 250px, 350px"
                width={800}
                height={800}
              />
            </div>
          </div>
        </section>
        <section
          className="impact-inspirations section-container"
          aria-labelledby="impact-inspirations-heading"
        >
          <header className="impact-section-heading">
            <span className="chapter-tag" data-reveal>
              INSPIRED BY
            </span>
            <h2 id="impact-inspirations-heading" data-text-reveal>
              <RevealText text="Wisdom that keeps us growing" />
            </h2>
            <p data-reveal>
              Farm Natura draws inspiration from Vinay Ram and Subhash Palekar
              in its approach to natural living and farming.
            </p>
          </header>
          <div className="impact-profiles">
            {impactInspirations.map((person) => (
              <figure className="impact-profile" key={person.name} data-reveal>
                <div className="impact-profile-portrait">
                  <img
                    src={`/images/impact/${person.image}-320.webp`}
                    srcSet={`/images/impact/${person.image}-160.webp 160w, /images/impact/${person.image}-320.webp 320w`}
                    sizes="(max-width: 767px) 240px, 320px"
                    width={320}
                    height={320}
                    alt={person.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <h3>{person.name}</h3>
                  <p>{person.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section
          className="impact-direction"
          aria-label="Our vision and mission"
        >
          <div className="section-container impact-direction-grid">
            <article data-reveal>
              <span className="chapter-tag">OUR VISION</span>
              <h2>A more natural way to live</h2>
              <p>
                Bring urban families closer to nature, conscious living and a
                lasting connection with the land.
              </p>
            </article>
            <article data-reveal>
              <span className="chapter-tag">OUR MISSION</span>
              <h2>Grow well. Live well. Together</h2>
              <p>
                Build self-sustaining farming communities through natural
                practices, collective well-being and care for local ecosystems.
              </p>
            </article>
          </div>
          <HandDrawnMotif
            kind="flower"
            className="impact-direction-flower"
            loading="lazy"
            sizes="120px"
          />
        </section>
        <section
          className="impact-experiences section-container"
          aria-label="Why Farm Natura"
        >
          <SectionHeading
            tag="PURPOSE, IN EVERYDAY LIFE"
            title="The good life, grounded in nature"
            intro="A vision becomes meaningful in the way you spend your days."
          />
          <div className="impact-benefits">
            {impactBenefits.map((benefit, index) => (
              <article className="impact-benefit" key={benefit.title}>
                <div className="impact-benefit-photo" data-image-reveal>
                  <ResponsiveImage
                    src={`/images/gallery/farmnatura-collection-${benefit.image}.webp`}
                    alt={benefit.alt}
                    loading="lazy"
                    sizes="(max-width: 767px) calc(100vw - 44px), 42vw"
                  />
                </div>
                <div className="impact-benefit-copy" data-reveal>
                  <span className="impact-number">0{index + 1}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="impact-plot-section">
          <div className="section-container impact-plot-layout">
            <SectionHeading
              tag="YOUR FARMLAND. YOUR WAY."
              title="Make room for your own rhythm"
              intro="Choose the space for your family's farm life, with connections to the airport, Srisailam Highway and Maheshwaram."
            />
            <div className="impact-plots">
              {impactPlots.map((plot) => (
                <article className="impact-plot" key={plot.acres} data-reveal>
                  <div className="impact-plot-size">
                    <strong>{plot.acres}</strong>
                    <span>
                      acre
                      <br />
                      {plot.yards}
                    </span>
                  </div>
                  <div>
                    <h3>{plot.title}</h3>
                    <p>{plot.text}</p>
                  </div>
                </article>
              ))}
              <button className="paper-button" onClick={onVisit}>
                EXPLORE PLOT AVAILABILITY <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </section>
        <section
          className="impact-hmda section-container"
          aria-labelledby="impact-hmda-heading"
        >
          <div>
            <span className="chapter-tag" data-reveal>
              CONNECTED TO HYDERABAD
            </span>
            <h2 id="impact-hmda-heading" data-text-reveal>
              <RevealText text="Farm Land Within HMDA Limits" />
            </h2>
          </div>
          <div className="impact-hmda-location" data-reveal>
            <MapPin size={28} strokeWidth={1.3} aria-hidden="true" />
            <p>
              Kandukur, near Hyderabad, with connections to the Srisailam
              Highway, airport and Maheshwaram.
            </p>
          </div>
        </section>
        <section className="impact-farmhouse section-container">
          <div className="impact-farmhouse-art">
            <ResponsiveImage
              src="/images/gallery/farmnatura-collection-03.webp"
              alt="Farmhouses and gardens at Farm Natura"
              loading="lazy"
              sizes="(max-width: 767px) calc(100vw - 44px), 45vw"
            />
            <HandDrawnMotif
              kind="flower"
              className="impact-farmhouse-flower"
              sizes="130px"
              loading="lazy"
            />
          </div>
          <div className="impact-farmhouse-copy">
            <span className="chapter-tag" data-reveal>
              THE FARM LIFE EXPERIENCE
            </span>
            <h2 data-text-reveal>
              <RevealText text="A sanctuary that grows with you" />
            </h2>
            <p data-reveal>
              Birdsong in the morning. Chai in a green courtyard. Vegetables a
              few steps from your kitchen. A professionally maintained plot,
              ready for your next return.
            </p>
            <div className="impact-grounds">
              {impactGrounds.map((ground) => (
                <article key={ground.title} data-reveal>
                  <h3>{ground.title}</h3>
                  <p>{ground.text}</p>
                </article>
              ))}
            </div>
            <button
              className="paper-button"
              onClick={() => onNavigate("living")}
            >
              DISCOVER FARM LIFE <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
        <section
          className="impact-awards"
          aria-labelledby="impact-awards-heading"
        >
          <div className="section-container">
            <header className="impact-section-heading">
              <span className="chapter-tag" data-reveal>
                AWARDS & RECOGNITION
              </span>
              <h2 id="impact-awards-heading" data-text-reveal>
                <RevealText text="Growing a vision worth celebrating" />
              </h2>
              <p data-reveal>
                Recognition shared by Farm Natura and Planet Green, celebrating
                entrepreneurship, agriculture and sustainable communities.
              </p>
            </header>
            <div className="impact-awards-grid">
              {impactAwards.map((award) => (
                <article className="impact-award" key={award.id} data-reveal>
                  <a
                    className="impact-award-photo"
                    href={`/images/impact/award-${award.id}-1280.webp`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View photograph: ${award.title}`}
                  >
                    <img
                      src={`/images/impact/award-${award.id}-800.webp`}
                      srcSet={`/images/impact/award-${award.id}-400.webp 400w, /images/impact/award-${award.id}-800.webp 800w`}
                      sizes="(max-width: 767px) calc(100vw - 44px), (max-width: 1100px) 42vw, 28vw"
                      width={800}
                      height={533}
                      alt={`${award.recipient} — ${award.title}, ${award.year}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <div className="impact-award-copy">
                    <span className="impact-award-year">{award.year}</span>
                    <h3>{award.title}</h3>
                    <p>{award.recipient}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className="impact-legal"
          id="legal-documentation"
          aria-labelledby="impact-legal-heading"
        >
          <div className="section-container impact-legal-layout">
            <header className="impact-legal-heading">
              <span className="chapter-tag" data-reveal>
                LEGAL DOCUMENTATION
              </span>
              <h2 id="impact-legal-heading" data-text-reveal>
                <RevealText text="Clarity before commitment" />
              </h2>
              <p data-reveal>
                Know your land before you make it your own. Explore the
                documents, survey details and managed-farming agreement with the
                team.
              </p>
              <button className="paper-button" onClick={onLegalRequest}>
                REQUEST LEGAL KIT <ArrowUpRight size={16} />
              </button>
              <HandDrawnMotif
                kind="sprig"
                className="impact-legal-sprig"
                sizes="100px"
                loading="lazy"
              />
            </header>
            <ol className="impact-legal-list">
              {legalDocuments.map((document, index) => (
                <li key={document.title} data-reveal>
                  <span className="impact-number">0{index + 1}</span>
                  <div>
                    <h3>{document.title}</h3>
                    <p>{document.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section
          className="impact-testimonial section-container"
          aria-label="A community that feels like home"
        >
          <div className="impact-testimonial-photo" data-image-reveal>
            <ResponsiveImage
              src="/images/gallery/farmnatura-collection-12.webp"
              alt="The welcoming community spaces and gardens at Farm Natura"
              loading="lazy"
              sizes="(max-width: 767px) calc(100vw - 44px), 40vw"
            />
          </div>
          <div className="impact-testimonial-copy">
            <span className="chapter-tag" data-reveal>
              A COMMUNITY THAT FEELS LIKE HOME
            </span>
            <blockquote data-text-reveal>
              <RevealText text="What truly sets Farm Natura apart is the sense of belonging it provides." />
            </blockquote>
            <p className="impact-testimonial-author" data-reveal>
              <strong>Ridhira Sheik</strong>
              <span>Product Manager</span>
            </p>
          </div>
        </section>
        <section
          className="impact-visit-panel section-container"
          aria-labelledby="impact-visit-heading"
        >
          <div className="impact-visit-copy">
            <span className="chapter-tag" data-reveal>
              COME, EXPERIENCE THE FARM
            </span>
            <h2 id="impact-visit-heading" data-text-reveal>
              <RevealText text="Let a little more life in" />
            </h2>
            <p data-reveal>
              Walk the land. Meet the team. Discover your own way to grow.
            </p>
          </div>
          <div className="impact-visit-actions" data-reveal>
            <HandDrawnMotif
              kind="flower"
              className="impact-visit-flower"
              loading="lazy"
              sizes="75px"
            />
            <button className="paper-button" onClick={onVisit}>
              PLAN YOUR VISIT <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
      </div>
      <NextChapter pageId="farming" blocked={blocked} onNavigate={onNavigate} />
      <FarmFooter onVisit={onVisit} onNavigate={onNavigate} />
    </article>
  );
}
