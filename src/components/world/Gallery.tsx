import { useRef, useState, useEffect } from "react";
import PhotoTransition from "./PhotoTransition";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
const images = [
  { src: "/images/farm.jpg", label: "The land we return to" },
  { src: "/images/farmhouse.jpg", label: "A little room to breathe" },
  { src: "/images/goshala.jpg", label: "Life on the farm" },
  { src: "/images/dining.jpg", label: "Together around the table" },
];
export default function Gallery({
  variant = "default",
  onOpenGallery,
}: {
  variant?: "default" | "story";
  onOpenGallery?: () => void;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0),
    [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
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
        <span className="chapter-tag" data-reveal>
          {variant === "story" ? "A LITTLE LOOK AROUND" : "FROM THE FARM"}
        </span>
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
              onClick={() => setActive((a) => (a + 3) % 4)}
            >
              <ArrowLeft strokeWidth={1} />
            </button>
            <button
              className="paper-button arrow-button"
              aria-label="Next photograph"
              onClick={() => setActive((a) => (a + 1) % 4)}
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
          <img
            src={images[active].src}
            alt={images[active].label}
            loading="lazy"
          />
          <PhotoTransition src={images[active].src} />
          <span className="photo-plus">+</span>
        </button>
        <div className="gallery-meta">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.4 }}
          >
            {images[active].label}
          </motion.span>
          <span>0{active + 1} / 04</span>
        </div>
        <div className="gallery-dots">
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
        <img src={images[active].src} alt={images[active].label} />
        <p>{images[active].label}</p>
        <div className="gallery-arrows">
          <button
            className="paper-button arrow-button"
            aria-label="Previous full-size photograph"
            onClick={() => setActive((a) => (a + 3) % 4)}
          >
            <ArrowLeft />
          </button>
          <button
            className="paper-button arrow-button"
            aria-label="Next full-size photograph"
            onClick={() => setActive((a) => (a + 1) % 4)}
          >
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </section>
  );
}
