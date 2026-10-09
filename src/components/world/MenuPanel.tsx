import { useEffect, useRef } from "react";
import type gsap from "gsap";
import { X, ArrowUpRight, Phone } from "lucide-react";
import { chapters, type ChapterId } from "../../data/chapters";
import { contact } from "../../data/content";
import { motionTokens } from "../../animation/motionTokens";
import BrandLogo from "./BrandLogo";
import HandDrawnMotif from "./HandDrawnMotif";
export default function MenuPanel({
  open,
  onClose,
  onNavigate,
  onHome,
  onGallery,
  onVisit,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: ChapterId) => void;
  onHome: () => void;
  onGallery: () => void;
  onVisit: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const papers = dialog.querySelectorAll(".menu-paper");
    let animation: gsap.core.Timeline | undefined;
    let cancelled = false;
    if (!open && !dialog.open) return;
    if (open) dialog.showModal();
    if (reduced) {
      if (!open) dialog.close();
      return;
    }
    void import("gsap")
      .then(({ default: gsap }) => {
        if (cancelled) return;
        if (open) {
          if (!reduced) {
            animation = gsap
              .timeline()
              .fromTo(
                papers,
                { xPercent: 105, rotation: 2 },
                {
                  xPercent: 0,
                  rotation: 0,
                  duration: motionTokens.menu.open,
                  stagger: motionTokens.menu.stagger,
                  ease: "power3.out",
                },
              )
              .fromTo(
                dialog.querySelectorAll("nav button,.menu-footer"),
                { y: 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.07,
                  ease: "power3.out",
                },
                0.2,
              );
          }
        } else if (dialog.open && !reduced) {
          animation = gsap
            .timeline({ onComplete: () => dialog.close() })
            .to(dialog.querySelectorAll("nav button,.menu-footer"), {
              opacity: 0,
              duration: 0.2,
            })
            .to(
              papers,
              {
                xPercent: 105,
                rotation: 2,
                duration: motionTokens.menu.close,
                stagger: -0.05,
                ease: "power2.in",
              },
              0,
            );
        } else dialog.close();
      })
      .catch(() => {
        if (!open) dialog.close();
      });
    return () => {
      cancelled = true;
      animation?.kill();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="menu-dialog"
      data-lenis-prevent
      aria-label="Explore Farm Natura"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="menu-paper paper-back-one" />
      <div className="menu-paper paper-back-two" />
      <div className="menu-tools">
        <button
          className="round-button menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} strokeWidth={1} />
        </button>
      </div>
      <div className="menu-paper paper-front">
        <button
          className="menu-home"
          onClick={onHome}
          aria-label="Farm Natura home"
        >
          <BrandLogo /> <ArrowUpRight size={15} />
        </button>
        <nav aria-label="Chapter navigation">
          {chapters.map((c) => (
            <button key={c.id} onClick={() => onNavigate(c.id)}>
              <span>{c.number}</span>
              <span>{c.title}</span>
            </button>
          ))}
          <button onClick={onGallery}>
            <span>04</span>
            <span>Gallery</span>
          </button>
        </nav>
        <HandDrawnMotif kind="flower" className="menu-flower" loading="lazy" />
        <div className="menu-footer">
          <p>
            A life rooted in nature.
            <br />
            Kandukur, Hyderabad.
          </p>
          <button className="paper-button" onClick={onVisit}>
            PLAN A VISIT <ArrowUpRight size={16} />
          </button>
          <div className="menu-contact-links">
            <a href={`tel:${contact.tel}`}>
              <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
              {contact.phone}
            </a>
            <a
              href="https://www.instagram.com/farmnatura.in/"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              Instagram
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
