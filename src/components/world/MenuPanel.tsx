import { useEffect, useRef } from "react";
import type gsap from "gsap";
import { X, ArrowUpRight } from "lucide-react";
import { chapters, type ChapterId } from "../../data/chapters";
import { contact } from "../../data/content";
import { motionTokens } from "../../animation/motionTokens";
import BrandLogo from "./BrandLogo";
import { BotanicalMotif } from "./BotanicalMotifs";
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
      <div className="menu-paper paper-front">
        <button
          className="round-button menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} strokeWidth={1} />
        </button>
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
            <span>↗</span>
            <span>Gallery</span>
          </button>
        </nav>
        <BotanicalMotif kind="flower" className="menu-flower" />
        <div className="menu-footer">
          <p>
            A life rooted in nature.
            <br />
            Kandukur, Hyderabad.
          </p>
          <button className="paper-button" onClick={onVisit}>
            PLAN A VISIT <ArrowUpRight size={16} />
          </button>
          <div>
            <a href={`tel:${contact.tel}`}>{contact.phone}</a>
            <a
              href="https://www.farmnatura.in/"
              target="_blank"
              rel="noreferrer"
            >
              farmnatura.in ↗
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
