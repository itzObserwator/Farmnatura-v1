import ResponsiveImage from "./ResponsiveImage";
import HandDrawnMotif from "./HandDrawnMotif";
import RevealText from "./RevealText";

export default function StoryGoldenYears() {
  return (
    <section
      className="story-golden-years"
      aria-labelledby="golden-years-title"
    >
      <header>
        <h2 id="golden-years-title" data-text-reveal>
          <RevealText text="An ideal way to spend your golden years." />
        </h2>
      </header>
      <div className="story-golden-layout">
        <div className="story-golden-portrait">
          <ResponsiveImage
            src="/images/golden-years.webp"
            srcSet="/images/golden-years-320.webp 320w, /images/golden-years.webp 570w"
            sizes="(max-width: 600px) calc(100vw - 64px), (max-width: 900px) 420px, 470px"
            alt="An elderly couple smiling and leaning together"
            width={570}
            height={765}
            loading="lazy"
          />
          <HandDrawnMotif
            kind="flower"
            className="story-golden-flower"
            loading="lazy"
          />
        </div>
        <div className="story-golden-copy">
          <p data-reveal>
            Every person should have a genuine opportunity to make the senior
            years of life happy, comfortable, and meaningful. Fostering a happy
            lifestyle, loving attitude, and a safe environment is fundamental to
            all we do.
          </p>
          <p data-reveal>
            Farm Natura is an ideal place to spend the golden years — off-grid
            in spirit, world-class in comfort, among like-minded neighbours and
            a swathe of enriching greens. Come weekends, children and
            grandchildren can visit with ease.
          </p>
          <aside
            className="story-golden-advantage"
            data-reveal
            aria-label="Airport proximity"
          >
            <p data-reveal>
              Its nearness to the International Airport makes it a natural
              choice for NRI families and elders who want their years healthy,
              connected and close to nature.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
