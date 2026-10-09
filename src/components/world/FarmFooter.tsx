import ResponsiveImage from "./ResponsiveImage";
import { useReducedMotion } from "framer-motion";
import * as motion from "framer-motion/m";
import { ArrowUpRight } from "lucide-react";
import { chapters, type ChapterId } from "../../data/chapters";
import { contact } from "../../data/content";
import BrandLogo from "./BrandLogo";
import { routePaths } from '../../data/routes';

/** Shared illustrated closing section for the chapters and gallery. */
export default function FarmFooter({
  onNavigate,
  onVisit,
}: {
  onNavigate: (id: ChapterId | "gallery") => void;
  onVisit: () => void;
}) {
  const reduced = useReducedMotion();
  return (
    <footer className="farm-footer">
      <svg
        className="footer-paper-edge"
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0H1440V8C1220 34 1080 2 860 18S510 34 310 13S100 30 0 16Z" />
      </svg>
      <div className="farm-footer-inner">
        <motion.div
          className="footer-opening"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="chapter-tag">A LIFE ROOTED IN NATURE</span>
            <h2>
              Rooted in nature.
              <br />
              Connected for life.
            </h2>
          </div>
          <div className="footer-orchard" aria-hidden="true">
            <ResponsiveImage
              className="footer-mango"
              src="/illustrations/hero/mango-branch.webp"
              alt=""
              loading="lazy"
            />
            <ResponsiveImage
              className="footer-bird"
              src="/illustrations/hero/orchard-bird.webp"
              alt=""
              loading="lazy"
            />
            <span className="footer-field-note">Good days begin outdoors.</span>
          </div>
        </motion.div>
        <svg
          className="footer-hand-rule"
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M1 5Q290 12 590 5T1199 6" />
        </svg>
        <div className="footer-columns">
          <div className="footer-brand">
            <BrandLogo className="footer-logo" />
            <span className="footer-label">BY PLANET GREEN</span>
            <p>
              Natural farming. Shared harvests.
              <br />A little closer to the land.
            </p>
          </div>
          <nav className="footer-chapters" aria-label="Footer chapters">
            <span className="footer-label">WANDER A LITTLE</span>
            {[
              ...chapters.map(({ id, title }) => ({ id, title })),
              { id: "gallery" as const, title: "Gallery" },
            ].map(({ id, title }, index) => (
              <a
                key={id}
                href={routePaths[id]}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(id);
                }}
              >
                <span className="footer-link-number">0{index + 1}</span>
                <span>{title}</span>
                <ArrowUpRight size={16} strokeWidth={1.2} />
              </a>
            ))}
          </nav>
          <div className="footer-contact">
            <span className="footer-label">LET’S KEEP IN TOUCH</span>
            <a className="footer-phone" href={`tel:${contact.tel}`}>
              {contact.phone}
              <ArrowUpRight size={18} strokeWidth={1.2} />
            </a>
            <p>
              Kandukur, near Hyderabad.
              <br />
              Come walk the land with us.
            </p>
            <button className="footer-visit-link" onClick={onVisit}>
              Arrange a farm visit <ArrowUpRight size={16} strokeWidth={1.2} />
            </button>
            <a
              className="footer-instagram"
              href="https://www.instagram.com/farmnatura.in/"
              target="_blank"
              rel="noreferrer"
            >
              Follow along on Instagram{" "}
              <ArrowUpRight size={15} strokeWidth={1.2} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} FARM NATURA</span>
          <span className="footer-bottom-note">
            <span aria-hidden="true">✳</span> GROW SLOW. LIVE WELL.
          </span>
        </div>
      </div>
    </footer>
  );
}
