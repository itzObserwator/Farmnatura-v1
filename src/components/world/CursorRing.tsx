import { useEffect, useRef } from "react";

export default function CursorRing() {
  const ring = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const node = ring.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let shown = false;
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0,
      last = 0;
    const draw = (time: number) => {
      const blend = reduced.matches
        ? 1
        : 1 - Math.exp(-Math.min(time - last, 64) / 55);
      last = time;
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      node.style.transform = `translate3d(${x - 19}px, ${y - 19}px, 0)`;
      frame =
        Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1
          ? requestAnimationFrame(draw)
          : 0;
    };
    const hide = () => {
      shown = false;
      node.dataset.visible = "false";
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!shown) {
        x = targetX;
        y = targetY;
        shown = true;
        node.dataset.visible = "true";
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
    };
  }, []);
  return <span ref={ring} className="cursor-ring" aria-hidden="true" />;
}
