import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/** Viewport coordinates keep the cursor steady over transformed and scrolling artwork. */
export function useExploreCursor(enabled = true) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const tracking = useRef(false);
  const targetX = useMotionValue(0),
    targetY = useMotionValue(0);
  const smoothX = useSpring(targetX, {
    stiffness: 480,
    damping: 35,
    mass: 0.45,
  });
  const smoothY = useSpring(targetY, {
    stiffness: 480,
    damping: 35,
    mass: 0.45,
  });
  const hide = useCallback(() => {
    tracking.current = false;
    setVisible(false);
  }, []);
  const follow = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (
        !enabled ||
        event.pointerType === "touch" ||
        !matchMedia("(hover: hover) and (pointer: fine)").matches
      )
        return;
      // The reference badge sits just above and to the left of the native hand cursor.
      const x = event.clientX - 22,
        y = event.clientY - 22;
      if (!tracking.current) {
        targetX.jump(x);
        targetY.jump(y);
        smoothX.jump(x);
        smoothY.jump(y);
        tracking.current = true;
        setVisible(true);
      } else {
        targetX.set(x);
        targetY.set(y);
      }
    },
    [enabled, targetX, targetY, smoothX, smoothY],
  );
  useEffect(() => {
    if (!enabled) hide();
  }, [enabled, hide]);
  useEffect(() => {
    // A badge must not remain floating if its illustration scrolls out from under it.
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", hide);
    };
  }, [hide]);
  const cursor = typeof document === 'undefined' ? null : createPortal(
    <motion.span
      className="explore-cursor"
      aria-hidden="true"
      data-visible={visible && enabled ? "true" : "false"}
      initial={false}
      animate={{
        opacity: visible && enabled ? 1 : 0,
        scale: visible && enabled ? 1 : 0.15,
      }}
      transition={{
        duration: reduced ? 0 : visible ? 0.2 : 0.15,
        ease: "easeOut",
      }}
      style={{ x: reduced ? targetX : smoothX, y: reduced ? targetY : smoothY }}
    >
      EXPLORE
    </motion.span>,
    document.body,
  );
  return {
    cursor,
    hide,
    handlers: {
      onPointerEnter: follow,
      onPointerMove: follow,
      onPointerLeave: hide,
      onPointerCancel: hide,
      onClick: hide,
    },
  };
}
