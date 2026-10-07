import RevealText from "./RevealText";
const moments = [
  {
    number: "01",
    label: "TIME TOGETHER",
    title: "A weekend with room to breathe.",
    text: "Return to the farmhouse, share a meal, and enjoy a slower day with the people you love.",
    image: "/images/farmhouse.jpg",
  },
  {
    number: "02",
    label: "A LITTLE CLOSER TO NATURE",
    title: "Take the long way through the orchard.",
    text: "Spend time outdoors, discover what is growing this season, and enjoy the simple pleasures of farm life.",
    image: "/images/farm.jpg",
  },
];
export default function LifeMoments() {
  return (
    <section className="life-moments" data-motion-section="moments">
      <div className="section-container">
        <span className="chapter-tag" data-reveal>
          FOR THE YOUNG AT HEART
        </span>
        <h2 data-text-reveal>
          <RevealText text="More memories. Less hurry." />
        </h2>
        <p className="moments-intro" data-reveal>
          A different rhythm for the whole family.
        </p>
        <div className="moments-stack">
          {moments.map((m) => (
            <article className="moment-card" key={m.number}>
              <div className="moment-photo">
                <img src={m.image} alt={m.title} loading="lazy" />
              </div>
              <div className="moment-copy">
                <span className="mini-label">{m.label}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <span className="moment-number">{m.number}/02</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
