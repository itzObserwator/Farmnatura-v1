import ResponsiveImage from "./ResponsiveImage";
import { useRef, useState, useEffect } from "react";
import PhotoTransition from "./PhotoTransition";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { galleryPhotos } from "../../data/gallery";
export default function Gallery({
  variant = "default",
  onOpenGallery,
}: {
  variant?: "default" | "story";
  onOpenGallery?: () => void;
}) {
  const images = (
    variant === "story" ? galleryPhotos.slice(9) : galleryPhotos
  ).map((photo) => ({
    src: photo.src,
    label: photo.title,
  }));
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0),
    [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = dots.current;
    const selected = strip?.children[active] as HTMLElement | undefined;
    if (strip && selected && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left:
          selected.offsetLeft -
          strip.clientWidth / 2 +
          selected.clientWidth / 2,
        behavior: reduced ? "instant" : "smooth",
      });
    }
  }, [active, reduced]);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <section
      className={`photo-gallery ${variant === "story" ? "life-story-media" : ""}`}
      id="gallery"
      data-motion-section="gallery"
    >
      <div className="section-container">
        <div className="gallery-heading" data-reveal>
          <h2>
            {variant === "story" ? (
              "Farm life, in pictures."
            ) : (
              <>
                Little moments.
                <br />A fuller life.
              </>
            )}
          </h2>
          <div className="gallery-arrows">
            <button
              className="paper-button arrow-button"
              aria-label="Previous photograph"
              onClick={() =>
                setActive((a) => (a + images.length - 1) % images.length)
              }
            >
              <ArrowLeft strokeWidth={1} />
            </button>
            <button
              className="paper-button arrow-button"
              aria-label="Next photograph"
              onClick={() => setActive((a) => (a + 1) % images.length)}
            >
              <ArrowRight strokeWidth={1} />
            </button>
          </div>
        </div>
        <button
          className="gallery-photo"
          onClick={() => setOpen(true)}
          aria-label="Open photograph"
        >
          <ResponsiveImage
            src={images[active].src}
            alt={images[active].label}
            loading="lazy"
          />
          <PhotoTransition src={images[active].src} />
          {variant !== "story" && <span className="photo-plus">+</span>}
        </button>
        <div className="gallery-meta">
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
        </div>
        <div ref={dots} className="gallery-dots">
          {images.map((img, i) => (
            <button
              key={img.src}
              aria-label={`Show photograph ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        {onOpenGallery && (
          <div className="gallery-page-link">
            <button className="paper-button" onClick={onOpenGallery}>
              VIEW THE GALLERY <ArrowRight size={17} strokeWidth={1} />
            </button>
          </div>
        )}
      </div>
      <dialog
        ref={dialog}
        className="photo-dialog"
        data-lenis-prevent
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(false);
        }}
      >
        <button
          className="round-button lightbox-close"
          aria-label="Close photograph"
          onClick={() => setOpen(false)}
        >
          <X size={19} />
        </button>
        <ResponsiveImage src={images[active].src} alt={images[active].label} />
        <div className="gallery-arrows">
          <button
            className="paper-button arrow-button"
            aria-label="Previous full-size photograph"
            onClick={() =>
              setActive((a) => (a + images.length - 1) % images.length)
            }
          >
            <ArrowLeft />
          </button>
          <button
            className="paper-button arrow-button"
            aria-label="Next full-size photograph"
            onClick={() => setActive((a) => (a + 1) % images.length)}
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </section>
  );
}
