import { useEffect, useState, type RefObject } from "react";
/** Start expensive enhancements only as their section approaches the viewport. */
export function useNearViewport(ref: RefObject<HTMLElement | null>, enabled = true) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled]);
  return near;
}
