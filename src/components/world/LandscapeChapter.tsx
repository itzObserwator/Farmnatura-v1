import { BotanicalMotif } from "./BotanicalMotifs";
import RevealText from "./RevealText";
import type { Chapter } from "../../data/chapters";
const captions = {
  story: [
    "A PLACE TO PUT DOWN ROOTS",
    "The land is only the beginning.",
    "A living estate in Kandukur, where natural farming and family life grow together.",
  ],
  farming: [
    "LET THE LAND LEAD",
    "Every season has a story.",
    "Indigenous seeds, seasonal crops and a dedicated team caring for the farm.",
  ],
  living: [
    "LIFE, AT A DIFFERENT PACE",
    "Make room for the little things.",
    "Orchard walks, farmhouse weekends and time together under open skies.",
  ],
} as const;
export default function LandscapeChapter({ chapter }: { chapter: Chapter }) {
  const [label, title, description] = captions[chapter.id];
  return (
    <section className="landscape-chapter" data-motion-section="landscape">
      <BotanicalMotif
        kind={chapter.id === "living" ? "bird" : "sprig"}
        className="landscape-ornament"
      />
      <div className="landscape-frame" data-image-reveal>
        <img
          src={chapter.photo}
          alt={
            chapter.id === "living"
              ? "A farmhouse at Farm Natura"
              : "The natural farming estate at Farm Natura"
          }
          loading="lazy"
        />
      </div>
      <div className="landscape-caption">
        <span className="chapter-tag" data-reveal>
          {label}
        </span>
        <h2 data-text-reveal>
          <RevealText text={title} />
        </h2>
        <p data-reveal>{description}</p>
      </div>
    </section>
  );
}
