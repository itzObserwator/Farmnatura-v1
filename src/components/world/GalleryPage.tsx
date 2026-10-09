import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  useReducedMotion,
  LazyMotion,
  domMax,
} from "framer-motion";
import * as motion from "framer-motion/m";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Play,
  Plus,
  X,
} from "lucide-react";
import {
  galleryCategories,
  galleryPhotos,
  galleryVideos,
  type GalleryCategory,
} from "../../data/gallery";
import { type ChapterId } from "../../data/chapters";
import { useGalleryAnimations } from "../../hooks/useGalleryAnimations";
import FarmFooter from "./FarmFooter";
import RevealText from "./RevealText";
import GallerySketch from "./GallerySketch";
import PhotoTransition from "./PhotoTransition";
import HeroBackdrop from "./HeroBackdrop";

export default function GalleryPage({
  onVisit,
  onFarmLife,
  onNavigate,
}: {
  onVisit: () => void;
  onFarmLife: () => void;
  onNavigate: (id: ChapterId | "gallery") => void;
}) {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [category, setCategory] = useState<GalleryCategory>("All moments");
  const [limit, setLimit] = useState(9);
  const [selected, setSelected] = useState<number | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [ratio, setRatio] = useState(1.6);
  const photos = galleryPhotos.filter(
    (photo) => category === "All moments" || photo.category === category,
  );
  const selectedPhoto = selected === null ? null : photos[selected];
  const selectedVideo = galleryVideos.find((item) => item.id === video);
  const viewerOpen = selectedPhoto !== null || !!selectedVideo;
  useGalleryAnimations(root);
  useEffect(() => {
    const node = dialog.current;
    if (viewerOpen && node && !node.open) node.showModal();
    else if (!viewerOpen) node?.close();
  }, [viewerOpen]);
  const closeViewer = () => {
    setSelected(null);
    setVideo(null);
  };
  const step = (direction: number) =>
    setSelected((current) =>
      current === null
        ? null
        : (current + direction + photos.length) % photos.length,
    );
  const changeTab = (next: "photos" | "videos") => {
    setTab(next);
    setLimit(9);
  };
  return (
    <LazyMotion features={domMax} strict>
      <article ref={root} className="gallery-journal-page">
        <section className="page-hero gallery-journal-hero">
          <HeroBackdrop color="#f4efd9">
            <div className="gallery-hero-ornaments" aria-hidden="true">
              <ResponsiveImage
                className="gallery-hero-art gallery-hero-mango"
                src="/illustrations/hero/mango-branch.webp"
                alt=""
                width="600"
                height="800"
              />
              <ResponsiveImage
                className="gallery-hero-art gallery-hero-flower"
                src="/illustrations/hero/marigold-stem.webp"
                alt=""
                width="600"
                height="800"
              />
              <ResponsiveImage
                className="gallery-hero-art gallery-hero-leaves"
                src="/illustrations/hero/native-foliage.webp"
                alt=""
                width="600"
                height="800"
              />
              <GallerySketch className="gallery-hero-art gallery-hero-camera" />
            </div>
          </HeroBackdrop>
          <div className="hero-title">
            <span className="chapter-tag">THE FARM NATURA JOURNAL</span>
            <h1>
              <span className="title-line">
                <RevealText text="LIFE, AS" />
              </span>
              <span className="title-line">
                <RevealText text="IT GROWS." />
              </span>
            </h1>
            <p className="hero-subtitle">
              A collection of everyday wonders.
              <br />
              From the land, and the people who love it.
            </p>
            <button
              className="gallery-journal-scroll"
              onClick={() =>
                document
                  .getElementById("gallery-collection")
                  ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" })
              }
            >
              EXPLORE THE GALLERY <ArrowDown size={17} strokeWidth={1} />
            </button>
          </div>
          <span className="gallery-hero-footnote">
            KANDUKUR, HYDERABAD · FIELD NOTES
          </span>
        </section>
        <section id="gallery-collection" className="gallery-collection">
          <div className="gallery-collection-intro" data-gallery-reveal>
            <span className="chapter-tag">A LITTLE LOOK AROUND</span>
            <h2>
              Some moments deserve
              <br />a little longer.
            </h2>
            <p>
              Orchards taking root. Hands in the soil. Time spent together.
              <br /> Discover life at Farm Natura, one moment at a time.
            </p>
            <svg
              className="gallery-drawn-trail"
              viewBox="0 0 200 130"
              fill="none"
              aria-hidden="true"
            >
              <path
                pathLength="1"
                d="M10 16c68 2 118 17 103 49-11 23-61 0-46-15 17-19 64 9 83 51l-16-9m16 9 2-20"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="gallery-collection-toolbar">
            <div
              className="gallery-media-tabs"
              role="tablist"
              aria-label="Gallery collections"
            >
              {(["photos", "videos"] as const).map((item) => (
                <button
                  key={item}
                  id={`gallery-tab-${item}`}
                  role="tab"
                  aria-selected={tab === item}
                  aria-controls="gallery-collection-panel"
                  tabIndex={tab === item ? 0 : -1}
                  onClick={() => changeTab(item)}
                  onKeyDown={(event) => {
                    if (
                      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                        event.key,
                      )
                    ) {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? "photos"
                          : event.key === "End"
                            ? "videos"
                            : tab === "photos"
                              ? "videos"
                              : "photos";
                      changeTab(next);
                      document.getElementById(`gallery-tab-${next}`)?.focus();
                    }
                  }}
                >
                  {item === "photos" ? "Photographs" : "Films"}
                  <span>
                    {String(
                      item === "photos"
                        ? galleryPhotos.length
                        : galleryVideos.length,
                    ).padStart(2, "0")}
                  </span>
                  <motion.i
                    style={{ opacity: tab === item ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                  />
                </button>
              ))}
            </div>
            <span className="gallery-collection-note">
              COLLECTED FROM THE FARM
            </span>
          </div>
          <div
            id="gallery-collection-panel"
            role="tabpanel"
            aria-labelledby={`gallery-tab-${tab}`}
            tabIndex={0}
          >
            {tab === "photos" ? (
              <>
                <div
                  className="gallery-category-filters"
                  aria-label="Filter photographs"
                >
                  {galleryCategories.map((item) => (
                    <button
                      key={item}
                      aria-pressed={category === item}
                      onClick={() => {
                        setCategory(item);
                        setLimit(9);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <motion.div layout={!reduced} className="gallery-journal-grid">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {photos.slice(0, limit).map((photo, index) => (
                      <motion.figure
                        layout={!reduced}
                        key={photo.id}
                        className={`gallery-journal-card ${index === 0 ? "gallery-feature-photo" : ""}`}
                        initial={{ opacity: 0, y: reduced ? 0 : 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "80px" }}
                        exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                        transition={{ duration: reduced ? 0 : 0.45 }}
                      >
                        <motion.button
                          className="gallery-journal-photo"
                          whileHover={
                            reduced ? {} : { rotate: index % 2 ? -1 : 1 }
                          }
                          onClick={() => setSelected(index)}
                          aria-label={`View photograph: ${photo.title}`}
                        >
                          <ResponsiveImage
                            src={photo.src}
                            alt={photo.title}
                            width={photo.width}
                            height={photo.height}
                            sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
                            loading="lazy"
                          />
                          <span
                            className="gallery-journal-photo-plus"
                            aria-hidden="true"
                          >
                            <Plus size={22} strokeWidth={1} />
                          </span>
                        </motion.button>
                        <figcaption>
                          <span>
                            <small>{photo.category}</small>
                            {photo.title}
                          </span>
                          <span className="gallery-photo-number">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </figcaption>
                      </motion.figure>
                    ))}
                  </AnimatePresence>
                </motion.div>
                <div className="gallery-collection-more">
                  <p role="status">
                    Showing {Math.min(limit, photos.length)} of {photos.length}{" "}
                    photographs
                  </p>
                  {limit < photos.length && (
                    <button
                      className="paper-button"
                      onClick={() => setLimit((count) => count + 9)}
                    >
                      MORE MOMENTS <Plus size={17} strokeWidth={1} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="gallery-video-intro">
                  <h3>Conversations on a greener life.</h3>
                  <p>
                    Stories and perspectives from Farm Natura’s film collection.
                  </p>
                </div>
                <div className="gallery-films-grid">
                  {galleryVideos.map((film, index) => (
                    <motion.figure
                      key={film.id}
                      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: reduced ? 0 : 0.4 }}
                    >
                      <button
                        className="gallery-film-poster"
                        onClick={() => setVideo(film.id)}
                        aria-label={`Play film: ${film.title}`}
                      >
                        <ResponsiveImage
                          src={film.poster}
                          alt=""
                          width="480"
                          height="360"
                          loading="lazy"
                        />
                        <span>
                          <Play size={25} fill="currentColor" strokeWidth={1} />
                        </span>
                      </button>
                      <figcaption>
                        <small>FILM {String(index + 1).padStart(2, "0")}</small>
                        <h3>{film.title}</h3>
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </>
            )}
          </div>
          <ResponsiveImage
            className="gallery-collection-bird"
            src="/illustrations/hero/orchard-bird.webp"
            alt=""
            width="800"
            height="600"
            loading="lazy"
          />
        </section>
        <section className="gallery-visit-invitation" data-gallery-reveal>
          <ResponsiveImage
            className="gallery-visit-foliage"
            src="/illustrations/hero/native-foliage.webp"
            alt=""
            width="600"
            height="800"
            loading="lazy"
          />
          <span className="chapter-tag">THE BEST VIEW IS FROM HERE</span>
          <h2>
            Step out of the picture.
            <br />
            Into the farm.
          </h2>
          <p>
            There’s more to a place than a photograph can hold.
            <br /> Come walk the land and meet the Farm Natura team.
          </p>
          <button className="paper-button" onClick={onVisit}>
            PLAN YOUR VISIT <ArrowUpRight size={17} strokeWidth={1} />
          </button>
          <button className="gallery-back-link" onClick={onFarmLife}>
            EXPLORE FARM LIFE <ArrowRight size={17} strokeWidth={1} />
          </button>
        </section>
        <FarmFooter onVisit={onVisit} onNavigate={onNavigate} />
        <dialog
          ref={dialog}
          className="gallery-viewer"
          data-lenis-prevent
          aria-label={
            selectedVideo
              ? "Farm Natura film viewer"
              : "Farm Natura photograph viewer"
          }
          onCancel={closeViewer}
          onClick={(event) => {
            if (event.target === dialog.current) closeViewer();
          }}
          onKeyDown={(event) => {
            if (
              selectedPhoto &&
              ["ArrowLeft", "ArrowRight"].includes(event.key)
            ) {
              event.preventDefault();
              step(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          <button
            className="round-button gallery-viewer-close"
            aria-label="Close gallery viewer"
            onClick={closeViewer}
          >
            <X size={20} />
          </button>
          {selectedPhoto && (
            <>
              <div
                className="gallery-viewer-frame"
                style={{ "--photo-ratio": ratio } as CSSProperties}
              >
                <ResponsiveImage
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  onLoad={(event) =>
                    setRatio(
                      event.currentTarget.naturalWidth /
                        event.currentTarget.naturalHeight,
                    )
                  }
                />
                <PhotoTransition src={selectedPhoto.src} />
              </div>
              <div className="gallery-viewer-caption" aria-live="polite">
                <span>{selectedPhoto.title}</span>
                <span>
                  {String((selected ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(photos.length).padStart(2, "0")}
                </span>
              </div>
              <div className="gallery-viewer-arrows">
                <button
                  className="paper-button"
                  aria-label="Previous gallery photograph"
                  onClick={() => step(-1)}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  className="paper-button"
                  aria-label="Next gallery photograph"
                  onClick={() => step(1)}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </>
          )}
          {selectedVideo && (
            <>
              <iframe
                className="gallery-film-player"
                src={selectedVideo.src}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <div className="gallery-viewer-caption">
                <span>{selectedVideo.title}</span>
                <a href={selectedVideo.url} target="_blank" rel="noreferrer">
                  WATCH ON YOUTUBE ↗
                </a>
              </div>
            </>
          )}
        </dialog>
      </article>
    </LazyMotion>
  );
}
