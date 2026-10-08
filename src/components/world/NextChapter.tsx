import type { Chapter, ChapterId } from "../../data/chapters";
import { CarouselView as ChapterCarousel } from "./DeferredViews";
import { Suspense, useRef } from "react";
import { useNearViewport } from "../../hooks/useNearViewport";

export default function NextChapter({
  chapter,
  onNavigate,
  blocked,
}: {
  chapter: Chapter;
  onNavigate: (id: ChapterId) => void;
  blocked: boolean;
}) {
  const stage = useRef<HTMLElement>(null);
  const near = useNearViewport(stage);
  return (
    <section ref={stage} className="next-chapter-stage" data-motion-section="next-chapter">
      {near && (
      <Suspense fallback={null}><ChapterCarousel
        initialIndex={Number(chapter.number) - 1}
        embedded
        blocked={blocked}
        onExplore={onNavigate}
      /></Suspense>
      )}
    </section>
  );
}
