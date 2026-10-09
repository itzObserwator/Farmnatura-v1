import { galleryDimensions } from "../../data/galleryDimensions";
import type { ImgHTMLAttributes } from "react";
import { useRef } from "react";
import { useNearViewport } from "../../hooks/useNearViewport";
const photos = new Set([
  "story-farmland",
  "natural-farm-aerial",
  "farm-estate",
  "farmhouse",
  "garden-planter",
  "living-fields",
  "sunflowers",
]);
const scenes = new Set([
  "story-grove",
  "farming-peppers",
  "living-harvest-moringa",
  "gallery-memories",
  "chemical-free-care-folk",
  "living-ecosystem-folk",
  "managed-with-care-folk",
]);
const ornaments = new Set([
  "chilli-sprig",
  "mango-branch",
  "marigold-stem",
  "native-foliage",
  "okra-branch",
  "orchard-bird",
]);
export default function ResponsiveImage(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  const image = useRef<HTMLImageElement>(null);
  const lazy = props.loading === "lazy";
  const near = useNearViewport(image, lazy);
  const ready = !lazy || near;
  const name = props.src?.split("/").pop()?.replace(".webp", "") ?? "";
  const gallerySize = props.src?.startsWith("/images/gallery/")
    ? galleryDimensions[name]
    : undefined;
  const widths = gallerySize
    ? null
    : photos.has(name)
      ? [640, 1280, 1920]
      : scenes.has(name)
        ? [480, 800, 1200]
        : ornaments.has(name)
          ? [240, 480, 800]
          : null;
  const base = props.src?.replace(".webp", "");
  const gallerySrcSet =
    gallerySize && gallerySize.width > 800
      ? [480, 800]
          .map(
            (width) =>
              `/images/gallery/responsive/${name}-${width}.webp ${width}w`,
          )
          .concat(`${props.src} ${gallerySize.width}w`)
          .join(", ")
      : undefined;
  const srcSet =
    props.srcSet ??
    gallerySrcSet ??
    (widths
      ? widths.map((width) => `${base}-${width}.webp ${width}w`).join(", ")
      : undefined);
  const escape = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;");
  const fallback = `<img src="${escape(props.src ?? "")}" alt="${escape(props.alt ?? "")}" class="${escape(props.className ?? "")}"${props.width ? ` width="${props.width}"` : ""}${props.height ? ` height="${props.height}"` : ""}${srcSet ? ` srcset="${srcSet}" sizes="(max-width: 767px) 100vw, 60vw"` : ""}/>`;
  return (
    <>
      <img
        decoding="async"
        {...props}
        ref={image}
        src={
          ready
            ? props.src
            : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        }
        data-src={lazy ? props.src : undefined}
        data-srcset={lazy ? srcSet : undefined}
        srcSet={ready ? srcSet : undefined}
        sizes={
          props.sizes ??
          (ornaments.has(name)
            ? props.className === "hero-scroll-art"
              ? "45px"
              : "(max-width: 767px) 180px, 400px"
            : widths
              ? "(max-width: 767px) 100vw, 60vw"
              : undefined)
        }
      />
      {lazy && <noscript dangerouslySetInnerHTML={{ __html: fallback }} />}
    </>
  );
}
