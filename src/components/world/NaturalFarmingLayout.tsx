import { ArrowUpRight } from "lucide-react";
import { chapters } from "../../data/chapters";
import RevealText from "./RevealText";
import FarmingExplorer from "./FarmingExplorer";
const farming = chapters[1];
/** Centre Court's introduction, panoramic image, discovery split, and feature cards. */
export default function NaturalFarmingLayout({
  onVisit,
}: {
  onVisit: () => void;
}) {
  return (
    <div className="natural-farming-layout">
      <section
        className="farming-about"
        id="chapter-intro"
        data-motion-section="farming-about"
      >
        <span className="chapter-tag" data-reveal>
          ABOUT NATURAL FARMING
        </span>
        <h2 data-text-reveal>
          <RevealText text="Care for the soil, and the soil cares for us." />
        </h2>
        <div className="farming-about-split">
          <div className="farming-about-art">
            <img
              className="farming-about-photo"
              src="/images/goshala.jpg"
              alt="Farm Natura’s goshala and farm grounds"
              loading="lazy"
            />
            <div className="farming-organic-surface" />
            <img
              className="farming-crop-art farming-drift"
              src={farming.art}
              alt={farming.alt}
              loading="lazy"
            />
            <img
              className="farming-about-flower farming-drift"
              src="/illustrations/hero/marigold-stem.webp"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="farming-about-copy" data-reveal>
            <p>{farming.body}</p>
            <p>{farming.secondary}</p>
            <button className="paper-button" onClick={onVisit}>
              MEET THE FARMING TEAM <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>
      <section
        className="farming-discover"
        data-motion-section="farming-discover"
      >
        <figure className="farming-panorama">
          <div className="farming-photo-mask" data-farming-image>
            <img
              src="/images/farm.jpg"
              alt="Aerial view of Farm Natura’s planted fields and estate"
              loading="lazy"
            />
          </div>
          <img
            className="farming-panorama-leaf farming-drift"
            src="/illustrations/hero/native-foliage.webp"
            alt=""
            loading="lazy"
          />
          <figcaption>
            A living landscape. A season of possibilities.
          </figcaption>
        </figure>
        <div className="farming-discover-split">
          <div className="farming-discover-copy" data-reveal>
            <span className="chapter-tag">LIFE BETWEEN THE ROWS</span>
            <h3>Good things grow together.</h3>
            <p>
              Fruit-bearing trees, seasonal vegetables, birds and pollinators.
              Every part of the farm has a place in the story of the land.
            </p>
            <p>
              Walk through the estate, discover what is growing this season, and
              see how a living ecosystem supports natural farming.
            </p>
          </div>
          <div className="farming-discover-art">
            <img
              className="farming-detail-photo farming-detail-first"
              src="/images/farm.jpg"
              alt="Planted plots and paths at Farm Natura"
              loading="lazy"
            />
            <img
              className="farming-detail-photo farming-detail-second"
              src="/images/goshala.jpg"
              alt="Farm Natura’s goshala in the managed farming estate"
              loading="lazy"
            />
            <div className="farming-bird-surface" />
            <img
              className="farming-discover-bird farming-drift"
              src="/illustrations/hero/orchard-bird.webp"
              alt="Hand-drawn golden orchard bird perched on a leafy branch"
              loading="lazy"
            />
            <img
              className="farming-discover-mango farming-drift"
              src="/illustrations/hero/mango-branch.webp"
              alt="Hand-drawn mango branch with fruit and blossoms"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <FarmingExplorer />
    </div>
  );
}
