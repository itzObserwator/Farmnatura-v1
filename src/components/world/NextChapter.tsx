import { ArrowUpRight } from "lucide-react";
import type { Chapter, ChapterId } from "../../data/chapters";
import { BotanicalMotif } from "./BotanicalMotifs";
export default function NextChapter({
  chapter,
  onNavigate,
}: {
  chapter: Chapter;
  onNavigate: (id: ChapterId) => void;
}) {
  return (
    <section className="next-chapter-stage" data-motion-section="next-chapter">
      <button
        className="next-chapter"
        aria-label={`Explore next chapter: ${chapter.title}`}
        onClick={() => onNavigate(chapter.id)}
      >
        <div className="next-scene">
          <div
            className="scene-blob"
            style={{ backgroundColor: chapter.color }}
          />
          <img src={chapter.art} alt={chapter.alt} loading="lazy" />
          <BotanicalMotif kind="flower" className="next-flower" />
        </div>
        <span className="chapter-tag">THE NEXT CHAPTER</span>
        <span className="next-title">{chapter.title}</span>
        <span className="next-explore">
          explore <ArrowUpRight size={18} />
        </span>
        <span className="next-number">{chapter.number}/03</span>
      </button>
    </section>
  );
}
