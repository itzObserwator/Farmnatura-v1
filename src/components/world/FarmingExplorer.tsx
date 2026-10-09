import ResponsiveImage from "./ResponsiveImage";
import RevealText from "./RevealText";

const practices = [
  {
    title: "Indigenous seeds",
    headline: "Indigenous seeds",
    tag: "A HEALTHIER START",
    text: "Locally adapted native and heirloom seeds, chosen for the land and the season.",
    art: "farming-peppers",
    alt: "Hand-drawn tomatoes, aubergines, bell peppers, okra and living roots",
  },
  {
    title: "Chemical-free care",
    headline: "Chemical-free care",
    tag: "WORKING WITH NATURE",
    text: "Natural farming practices that focus on the health of the land and its crops.",
    art: "chemical-free-care-folk",
    alt: "Hand-drawn farmer caring for vegetable plants with natural plant-based preparations",
  },
  {
    title: "A living ecosystem",
    headline: "A living ecosystem",
    tag: "GOOD THINGS GROW TOGETHER",
    text: "Room for fruit-bearing trees, seasonal vegetables, birds and pollinators.",
    art: "living-ecosystem-folk",
    alt: "Hand-drawn thriving garden with birds, bees, butterflies and living roots",
  },
  {
    title: "Managed with care",
    headline: "Your land. A team that cares.",
    tag: "MANAGED WITH CARE",
    text: "Dedicated agronomy staff manage everyday farming, so you can spend more time enjoying the land. Meet the team to explore the programme and current maintenance terms.",
    art: "managed-with-care-folk",
    alt: "Hand-drawn agronomy team tending vegetable beds and checking young plants",
  },
] as const;

export default function FarmingExplorer() {
  return (
    <section
      className="farming-explorer"
      id="our-practice"
      data-motion-section="practices"
    >
      <ResponsiveImage
        className="farming-feature-flower farming-drift"
        src="/illustrations/hero/marigold-stem.webp"
        alt=""
        loading="lazy"
      />
      <ResponsiveImage
        className="farming-feature-foliage farming-drift"
        src="/illustrations/hero/native-foliage.webp"
        alt=""
        loading="lazy"
      />
      <div className="section-container">
        <div className="farming-feature-stage">
          <div className="farming-feature-heading">
            <h2 data-farming-reveal>
              <RevealText text="For the land. For the life it grows." />
            </h2>
            <p className="farming-features-intro" data-farming-reveal>
              Discover the practices that care for your land, season after
              season.
            </p>
          </div>
          <div className="explorer-layout">
            <div className="farming-cards farming-practice-stack">
              {practices.map((practice, index) => (
                <div className="practice-step" key={practice.title}>
                  <div
                    className="practice-marker"
                    id={`practice-marker-${index}`}
                    aria-hidden="true"
                  />
                  <article
                    className={`farming-feature-card practice-window${index === 3 ? " farming-managed-card" : ""}`}
                    id={`practice-card-${index}`}
                    aria-labelledby={`practice-heading-${index}`}
                  >
                    <div className="practice-art">
                      <ResponsiveImage
                        src={`/illustrations/${practice.art}.webp`}
                        alt={practice.alt}
                        loading="lazy"
                        width={1254}
                        height={1254}
                        sizes="(max-width: 767px) 220px, 280px"
                      />
                    </div>
                    <h3 id={`practice-heading-${index}`}>
                      {practice.headline}
                    </h3>
                    <p>{practice.text}</p>
                    <span className="farming-card-number">
                      0{index + 1} / 04
                    </span>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
