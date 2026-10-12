import {
  carouselDestinations,
  type CarouselDestinationId,
} from "../../data/carousel";
import { lazy, Suspense, useRef } from "react";
import { useNearViewport } from "../../hooks/useNearViewport";

// This section loads only near the viewport, including on prerendered pages.
const ChapterCarousel = lazy(() => import("./ChapterCarousel"));

export default function NextChapter({
  pageId,
  onNavigate,
  blocked,
}: {
  pageId: CarouselDestinationId;
  onNavigate: (id: CarouselDestinationId) => void;
  blocked: boolean;
}) {
  const stage = useRef<HTMLElement>(null);
  const near = useNearViewport(stage);
  return (
    <section
      ref={stage}
      className="next-chapter-stage"
      data-motion-section="next-chapter"
    >
      {near && (
        <Suspense fallback={null}>
          <ChapterCarousel
            initialIndex={carouselDestinations.findIndex(
              (page) => page.id === pageId,
            )}
            embedded
            blocked={blocked}
            onExplore={onNavigate}
          />
        </Suspense>
      )}
    </section>
  );
}
