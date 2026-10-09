import ResponsiveImage from "./ResponsiveImage";
import { ArrowUpRight } from "lucide-react";
import { chapters } from "../../data/chapters";
import RevealText from "./RevealText";
import LivingSurface from "./LivingSurface";
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
        <span className="chapter-tag" data-farming-reveal>
          ABOUT NATURAL FARMING
        </span>
        <h2 data-farming-reveal>
          <RevealText text="Care for the soil, and the soil cares for us." />
        </h2>
        <div className="farming-about-split">
          <div className="farming-about-art">
            <ResponsiveImage
              className="farming-about-photo"
              src="/images/farm-estate.webp"
              alt="Farmhouses and flowering crops at Farm Natura"
              loading="lazy"
            />
            <LivingSurface
              className="farming-organic-surface"
              color="#fff3b5"
            />
            <ResponsiveImage
              className="farming-crop-art farming-drift"
              src={farming.art}
              alt={farming.alt}
              loading="lazy"
            />
            <ResponsiveImage
              className="farming-about-flower farming-drift"
              src="/illustrations/hero/marigold-stem.webp"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="farming-about-copy">
            <p data-farming-reveal>
              We've spent 6+ years revitalising this soil to be 100%
              chemical-free through authentic <strong>natural farming</strong>.
            </p>
            <p data-farming-reveal>
              <RevealText text={farming.body} />
            </p>
            <p data-farming-reveal>
              <RevealText text={farming.secondary} />
            </p>
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
            <ResponsiveImage
              src="/images/story-farmland.webp"
              alt="Aerial view of Farm Natura’s planted fields and estate"
              loading="lazy"
            />
          </div>
          <ResponsiveImage
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
          <div className="farming-discover-copy">
            <span className="chapter-tag" data-farming-reveal>
              LIFE BETWEEN THE ROWS
            </span>
            <h3 data-farming-reveal>
              <RevealText text="Good things grow together." />
            </h3>
            <p data-farming-reveal>
              <RevealText text="Fruit-bearing trees, seasonal vegetables, birds and pollinators. Every part of the farm has a place in the story of the land." />
            </p>
            <p data-farming-reveal>
              <RevealText text="Walk through the estate, discover what is growing this season, and see how a living ecosystem supports natural farming." />
            </p>
          </div>
          <div className="farming-discover-art">
            <ResponsiveImage
              className="farming-detail-photo farming-detail-first"
              src="/images/living-fields.webp"
              alt="Overhead view of green crop beds and banana trees at Farm Natura"
              loading="lazy"
            />
            <ResponsiveImage
              className="farming-detail-photo farming-detail-second"
              src="/images/sunflowers.webp"
              alt="Sunflowers and banana trees growing together at Farm Natura"
              loading="lazy"
            />
            <LivingSurface className="farming-bird-surface" color="#dce8cc" />
            <ResponsiveImage
              className="farming-discover-bird farming-drift"
              src="/illustrations/hero/orchard-bird.webp"
              alt="Hand-drawn golden orchard bird perched on a leafy branch"
              loading="lazy"
            />
            <ResponsiveImage
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
