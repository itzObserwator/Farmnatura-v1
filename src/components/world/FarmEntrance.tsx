import ResponsiveImage from "./ResponsiveImage";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BrandLogo from "./BrandLogo";

const cropSprites = [
  "tomato-seedling",
  "okra-seedling",
  "marigold-seedling",
] as const;
const sceneCount = 3;
const sceneDuration = 2200;
const entranceDuration = sceneDuration * sceneCount;

/** A short illustrated welcome, separate from actual image-loading progress. */
export default function FarmEntrance({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const reduced = useReducedMotion();
  const [scene, setScene] = useState(reduced ? 2 : 0);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const duration = reduced ? sceneDuration : entranceDuration;
    const interval = reduced
      ? undefined
      : window.setInterval(
          () => setScene((value) => Math.min(value + 1, sceneCount - 1)),
          sceneDuration,
        );
    const fade = window.setTimeout(
      () => setClosing(true),
      duration - (reduced ? 0 : 400),
    );
    const complete = window.setTimeout(onComplete, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(fade);
      clearTimeout(complete);
    };
  }, [onComplete, reduced]);
  return (
    <motion.div
      className="farm-entrance"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.4 }}
      aria-label="Entering Farm Natura"
    >
      <div className="entrance-header">
        <BrandLogo />
        <span>PLANET GREEN PRESENTS</span>
      </div>
      <div className="entrance-world">
        <div className="entrance-field-scene" aria-hidden="true">
          <motion.div
            className="entrance-sun"
            initial={reduced ? false : { scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <svg className="entrance-landscape" viewBox="0 0 600 560">
            <defs>
              <pattern
                id="entrance-soil-grain"
                width="37"
                height="29"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M4 7l5 2m13 11l7-3M13 25l4-2"
                  stroke="#ead7ac"
                  strokeWidth="1"
                  opacity=".55"
                />
                <path
                  d="M17 4l3 1m12 9l2 2"
                  stroke="#614927"
                  strokeWidth="1"
                  opacity=".35"
                />
                <circle cx="5" cy="21" r="1.2" fill="#604b2f" opacity=".4" />
                <circle cx="26" cy="5" r=".8" fill="#efe0bb" opacity=".6" />
              </pattern>
            </defs>
            <path
              d="M20 326Q105 247 214 296T420 269Q516 261 583 318L575 365H24Z"
              fill="#dce6cd"
            />
            <path
              d="M27 335Q153 299 298 333T578 328"
              fill="none"
              stroke="#8caa70"
              strokeWidth="2"
            />
            <path
              d="M32 355Q297 296 568 355L590 477Q315 558 10 477Z"
              fill="#b99564"
              stroke="#725a3b"
              strokeWidth="1.5"
            />
            <motion.path
              d="M32 355Q297 296 568 355L590 477Q315 558 10 477Z"
              fill="#637d43"
              initial={{ opacity: reduced ? 0.6 : 0 }}
              animate={{ opacity: 0.6 }}
              transition={{
                delay: reduced ? 0 : 2.4,
                duration: reduced ? 0 : 2.8,
              }}
            />
            <path
              d="M32 355Q297 296 568 355L590 477Q315 558 10 477Z"
              fill="url(#entrance-soil-grain)"
            />
            {Array.from({ length: 6 }, (_, row) => (
              <g key={row}>
                <path
                  d={`M${26 - row * 2} ${366 + row * 22}Q300 ${308 + row * 29} ${575 + row * 2} ${366 + row * 22}`}
                  fill="none"
                  stroke="#7a5a37"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <motion.path
                  d={`M${26 - row * 2} ${361 + row * 22}Q300 ${304 + row * 29} ${575 + row * 2} ${361 + row * 22}`}
                  fill="none"
                  stroke="#e0c697"
                  strokeWidth="2"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    delay: reduced ? 0 : row * 0.16,
                    duration: reduced ? 0 : 2.8,
                    ease: "linear",
                  }}
                />
              </g>
            ))}
            {Array.from({ length: 32 }, (_, i) => {
              const row = Math.floor(i / 8),
                col = i % 8;
              const x = 55 + col * 69,
                y = 396 + row * 28 - Math.sin((col / 7) * Math.PI) * 28;
              return (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <motion.g
                    className="entrance-seedling"
                    initial={reduced ? false : { scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    style={{ originX: "0px", originY: "0px" }}
                    transition={{
                      delay: reduced ? 0 : 2.8 + col * 0.12 + row * 0.14,
                      duration: reduced ? 0 : 0.85,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.g
                      className="entrance-crop-sway"
                      animate={{ rotate: reduced ? 0 : [-2, 2, -2] }}
                      style={{ originX: "0px", originY: "0px" }}
                      transition={{
                        delay: reduced ? 0 : 3.4 + col * 0.12 + row * 0.14,
                        duration: reduced ? 0 : 2.1 + (i % 3) * 0.25,
                        repeat: reduced ? 0 : Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <image
                        className="entrance-crop-art"
                        href={`/illustrations/entrance/${cropSprites[(col + row) % cropSprites.length]}.webp`}
                        x={-23}
                        y={-44}
                        width={46}
                        height={55}
                        preserveAspectRatio="xMidYMid meet"
                      />
                    </motion.g>
                  </motion.g>
                </g>
              );
            })}
            <path
              d="M33 492Q292 553 567 493"
              fill="none"
              stroke="#725a3b"
              strokeWidth="1"
            />
          </svg>
          <motion.div
            className="entrance-plough-team"
            initial={reduced ? false : { x: "-12%" }}
            animate={{ x: reduced ? "10%" : "12%" }}
            transition={{ duration: reduced ? 0 : 4.6, ease: "linear" }}
          >
            <ResponsiveImage
              src="/illustrations/entrance/oxen-plough.webp"
              alt=""
            />
          </motion.div>
          <ResponsiveImage
            className="entrance-bird"
            src="/illustrations/hero/orchard-bird.webp"
            alt=""
          />
          <span className="entrance-art-note">
            Restoring the land, season by season.
          </span>
        </div>
      </div>
      <div className="entrance-status">
        <span role="status" aria-live="polite">
          {reduced ? "WELCOME TO FARM NATURA" : "ENTERING THE FARM"}
        </span>
        <span aria-hidden="true">0{scene + 1} / 03</span>
      </div>
      <div className="entrance-progress" aria-hidden="true">
        <motion.span
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: reduced ? 0 : entranceDuration / 1000,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
}
