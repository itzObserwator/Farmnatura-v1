import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionConfig, motion } from "framer-motion";
import BrandLogo from "./components/world/BrandLogo";
import { Menu } from "lucide-react";
import { chapters, type ChapterId } from "./data/chapters";
import Intro from "./components/world/Intro";
import ChapterCarousel from "./components/world/ChapterCarousel";
import ChapterPage from "./components/world/ChapterPage";
import GalleryPage from "./components/world/GalleryPage";
import MenuPanel from "./components/world/MenuPanel";
import ContactDialog from "./components/ContactDialog";
import { curtainPath, motionTokens } from "./animation/motionTokens";
import { useAmbientSound } from "./hooks/useAmbientSound";
type RouteId = ChapterId | "gallery";
function readRoute(): RouteId | null {
  if (location.hash === "#gallery") return "gallery";
  return chapters.find((c) => `#${c.id}` === location.hash)?.id ?? null;
}
export default function App() {
  const [route, setRoute] = useState<RouteId | null>(readRoute),
    [intro, setIntro] = useState(
      () => !sessionStorage.getItem("farm-entered") && !readRoute(),
    ),
    [menu, setMenu] = useState(false),
    [visit, setVisit] = useState(false),
    [active, setActive] = useState(0),
    [footerVisible, setFooterVisible] = useState(false),
    [reading, setReading] = useState(false);
  const { enabled, toggle } = useAmbientSound();
  const curtain = useRef<HTMLDivElement>(null);
  const curtainShape = useRef<SVGPathElement>(null);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const busy = useRef(false);
  const enter = useCallback(() => {
    sessionStorage.setItem("farm-entered", "yes");
    setIntro(false);
  }, []);
  const onActive = useCallback((index: number) => setActive(index), []);
  const navigate = useCallback(
    (id: RouteId | null) => {
      setMenu(false);
      if (busy.current || id === route) return;
      const commit = () => {
        history.pushState(
          null,
          "",
          id ? `#${id}` : location.pathname + location.search,
        );
        setRoute(id);
        window.scrollTo(0, 0);
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        commit();
        return;
      }
      busy.current = true;
      const progress = { value: 0 };
      curtainShape.current?.setAttribute(
        "fill",
        chapters.find((c) => c.id === id)?.color ?? chapters[active].color,
      );
      curtainShape.current?.setAttribute("d", curtainPath(0));
      transition.current = gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
          },
        })
        .set(curtain.current, { visibility: "visible" })
        .to(progress, {
          value: 1,
          duration: motionTokens.curtain.cover,
          ease: motionTokens.curtain.ease,
          onUpdate: () =>
            curtainShape.current?.setAttribute(
              "d",
              curtainPath(progress.value),
            ),
        })
        .call(commit)
        .set(progress, { value: 0 })
        .to(progress, {
          value: 1,
          duration: motionTokens.curtain.uncover,
          ease: motionTokens.curtain.ease,
          onUpdate: () =>
            curtainShape.current?.setAttribute(
              "d",
              curtainPath(progress.value, true),
            ),
        })
        .set(curtain.current, { visibility: "hidden" });
    },
    [route, active],
  );
  useEffect(() => {
    const pop = () => {
      transition.current?.kill();
      busy.current = false;
      if (curtain.current) curtain.current.style.visibility = "hidden";
      setRoute(readRoute());
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("hashchange", pop);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("hashchange", pop);
      transition.current?.kill();
    };
  }, []);
  useEffect(() => {
    document.title =
      route === "gallery"
        ? "Gallery — Farm Natura"
        : route
          ? `${chapters.find((c) => c.id === route)?.title} — Farm Natura`
          : "Farm Natura — A Life Rooted in Nature";
    document.documentElement.style.overflow = !route || intro ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [route, intro]);
  useEffect(() => {
    setFooterVisible(false);
    setReading(false);
    if (!route) return;
    const update = () => setReading(scrollY > innerHeight * 0.65);
    window.addEventListener("scroll", update, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => setFooterVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.55 },
    );
    const next = document.querySelector(".next-chapter-stage");
    if (next) observer.observe(next);
    return () => {
      window.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [route]);
  const chapter = chapters.find((c) => c.id === route);
  return (
    <MotionConfig reducedMotion="user">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to content
      </a>
      {!intro && (
        <header className={`world-header ${reading ? "is-reading" : ""}`}>
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            className="brand-seal"
            aria-label="Farm Natura home"
            onClick={() => navigate(null)}
          >
            <BrandLogo />
          </motion.button>
          <button
            className="round-button header-menu"
            aria-label="Open menu"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <Menu size={21} strokeWidth={1} />
          </button>
        </header>
      )}
      <main id="main-content" tabIndex={-1}>
        {intro ? (
          <Intro onComplete={enter} />
        ) : route === "gallery" ? (
          <GalleryPage
            onVisit={() => setVisit(true)}
            onFarmLife={() => navigate("living")}
          />
        ) : chapter ? (
          <ChapterPage
            key={chapter.id}
            chapter={chapter}
            onVisit={() => setVisit(true)}
            onNavigate={navigate}
            onGallery={() => navigate("gallery")}
          />
        ) : (
          <ChapterCarousel
            onExplore={navigate}
            onActive={onActive}
            blocked={menu || visit}
          />
        )}
      </main>
      <div className="world-utilities">
        <button
          className={`round-button sound-toggle ${enabled ? "is-on" : ""}`}
          aria-label={enabled ? "Turn sound off" : "Turn sound on"}
          aria-pressed={enabled}
          onClick={toggle}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} />
          ))}
        </button>
        {!intro && (chapter || route === "gallery") && !footerVisible && (
          <>
            <button
              className="paper-button index-button"
              onClick={() => setMenu(true)}
            >
              INDEX <Menu size={18} strokeWidth={1} />
            </button>
            <span className="page-number">
              {chapter ? `${chapter.number}/03` : "GALLERY"}
            </span>
          </>
        )}
      </div>
      <MenuPanel
        open={menu}
        onClose={() => setMenu(false)}
        onNavigate={navigate}
        onHome={() => navigate(null)}
        onGallery={() => navigate("gallery")}
        onVisit={() => {
          setMenu(false);
          setVisit(true);
        }}
      />
      <ContactDialog open={visit} onClose={() => setVisit(false)} />
      <div ref={curtain} className="transition-curtain" aria-hidden="true">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path ref={curtainShape} />
        </svg>
      </div>
    </MotionConfig>
  );
}
