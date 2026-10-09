import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import type gsap from "gsap";
import { MotionConfig, motion } from "framer-motion";
import BrandLogo from "./components/world/BrandLogo";
import CursorRing from "./components/world/CursorRing";
import { Menu } from "lucide-react";
import { chapters, type ChapterId } from "./data/chapters";
import {
  IntroView as Intro,
  GalleryView as GalleryPage,
} from "./components/world/DeferredViews";
import ChapterPage from "./components/world/ChapterPage";
import MenuPanel from "./components/world/MenuPanel";
import ContactDialog from "./components/ContactDialog";
import { curtainPath, motionTokens } from "./animation/motionTokens";
import { useAmbientSound } from "./hooks/useAmbientSound";
import { routePaths, pageMetadata } from "./data/routes";
type RouteId = ChapterId | "gallery";
function readRoute(): RouteId | null {
  if (typeof location === "undefined") return null;
  const paths: Record<string, RouteId> = {
    "/about-us": "story",
    "/natural-farming": "farming",
    "/farmhouses-for-sale-in-hyderabad": "living",
    "/gallery": "gallery",
  };
  if (location.hash === "#gallery") return "gallery";
  return (
    chapters.find((c) => `#${c.id}` === location.hash)?.id ??
    paths[location.pathname.replace(/\/$/, "")] ??
    null
  );
}
export default function App({
  initialRoute,
}: { initialRoute?: RouteId | null } = {}) {
  const [route, setRoute] = useState<RouteId | null>(() =>
      initialRoute !== undefined ? initialRoute : readRoute(),
    ),
    [intro, setIntro] = useState(
      () =>
        !(initialRoute ?? readRoute()) &&
        (typeof sessionStorage === "undefined" ||
          !sessionStorage.getItem("farm-entered")),
    ),
    [menu, setMenu] = useState(false),
    [visit, setVisit] = useState(false),
    [footerVisible, setFooterVisible] = useState(false),
    [reading, setReading] = useState(false);
  const { audioRef, enabled, start, toggle } = useAmbientSound();
  const [soundControlVisible, setSoundControlVisible] = useState(!intro);
  const enterWithSound = useCallback(() => {
    setSoundControlVisible(true);
    start();
  }, [start]);
  const finishEntry = useCallback(() => {
    sessionStorage.setItem("farm-entered", "yes");
    history.pushState(null, "", routePaths.story);
    setRoute("story");
    setIntro(false);
    window.scrollTo(0, 0);
  }, []);
  const curtain = useRef<HTMLDivElement>(null);
  const curtainShape = useRef<SVGPathElement>(null);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const busy = useRef(false);
  const navigationVersion = useRef(0);
  const navigate = useCallback(
    async (id: RouteId | null) => {
      setMenu(false);
      if (busy.current) return;
      if (id === route) {
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
      const commit = () => {
        history.pushState(
          null,
          "",
          id
            ? location.pathname === "/" && location.hash
              ? `#${id}`
              : routePaths[id]
            : "/",
        );
        setRoute(id);
        if (!id) setIntro(true);
        window.scrollTo(0, 0);
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        commit();
        return;
      }
      busy.current = true;
      const version = ++navigationVersion.current;
      let gsapRuntime: typeof gsap;
      try {
        gsapRuntime = (await import("gsap")).default;
      } catch {
        if (version === navigationVersion.current) {
          busy.current = false;
          commit();
        }
        return;
      }
      if (version !== navigationVersion.current) return;
      const progress = { value: 0 };
      curtainShape.current?.setAttribute(
        "fill",
        chapters.find((c) => c.id === id)?.color ?? chapters[0].color,
      );
      curtainShape.current?.setAttribute("d", curtainPath(0));
      transition.current = gsapRuntime
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
    [route],
  );
  useEffect(() => {
    const pop = () => {
      navigationVersion.current++;
      transition.current?.kill();
      busy.current = false;
      if (curtain.current) curtain.current.style.visibility = "hidden";
      const destination = readRoute();
      setRoute(destination);
      setIntro(!destination);
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("hashchange", pop);
    return () => {
      navigationVersion.current++;
      window.removeEventListener("popstate", pop);
      window.removeEventListener("hashchange", pop);
      transition.current?.kill();
    };
  }, []);
  useEffect(() => {
    if (!intro && !route) {
      history.replaceState(null, "", routePaths.story);
      setRoute("story");
    }
  }, [intro, route]);
  useEffect(() => {
    const metadata = pageMetadata[route ?? "home"];
    document.title = metadata.title;
    for (const [name, content] of Object.entries({
      description: metadata.description,
      "og:title": metadata.title,
      "og:description": metadata.description,
      "og:image": "https://www.farmnatura.in/branding/farmnatura-logo.png",
    })) {
      const attribute = name.startsWith("og:") ? "property" : "name";
      let meta = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${name}"]`,
      );
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.append(meta);
      }
      meta.content = content;
    }
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = "https://www.farmnatura.in" + routePaths[route ?? "home"];
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
    const closingSections = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) closingSections.add(entry.target);
          else closingSections.delete(entry.target);
        }
        setFooterVisible(closingSections.size > 0);
      },
      { threshold: 0.55 },
    );
    const next = document.querySelector(".next-chapter-stage");
    if (next) observer.observe(next);
    const footer = document.querySelector(".farm-footer");
    if (footer) observer.observe(footer);
    return () => {
      window.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [route]);
  const chapter = chapters.find(
    (c) => c.id === (route ?? (!intro ? "story" : null)),
  );
  return (
    <MotionConfig reducedMotion="user">
      <audio
        ref={audioRef}
        src="/audio/farm-natura-theme.m4a"
        loop
        preload="none"
        aria-hidden="true"
      />
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
        <Suspense
          fallback={
            <div className="view-loading" role="status">
              Welcome to Farm Natura…
            </div>
          }
        >
          {intro ? (
            <Intro onEnter={enterWithSound} onComplete={finishEntry} />
          ) : route === "gallery" ? (
            <GalleryPage
              onVisit={() => setVisit(true)}
              onFarmLife={() => navigate("living")}
              onNavigate={navigate}
            />
          ) : chapter ? (
            <ChapterPage
              key={chapter.id}
              chapter={chapter}
              blocked={menu || visit}
              onVisit={() => setVisit(true)}
              onNavigate={navigate}
              onGallery={() => navigate("gallery")}
            />
          ) : null}
        </Suspense>
      </main>
      <CursorRing />
      <div className="world-utilities">
        {soundControlVisible && (
          <button
            className={`round-button sound-toggle ${enabled ? "is-on" : ""}`}
            title={enabled ? "Pause the farm tune" : "Play the farm tune"}
            aria-label={enabled ? "Turn sound off" : "Turn sound on"}
            aria-pressed={enabled}
            onClick={toggle}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} />
            ))}
          </button>
        )}
        {!intro && (chapter || route === "gallery") && !footerVisible && (
          <span className="page-number">
            {chapter ? `${chapter.number}/03` : "GALLERY"}
          </span>
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
