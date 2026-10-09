import HandDrawnMotif from "./HandDrawnMotif";
import heroImages from "../../data/heroImages.json";
/** Original pen-and-watercolor ornaments around each chapter's hero headline. */
export default function HeroBotanicals({ variant = 0 }: { variant?: number }) {
  return (
    <div className={`handdrawn-decor handdrawn-${variant}`} aria-hidden="true">
      <HandDrawnMotif
        kind="mango"
        className="decor-piece drawn-mango"
        sizes={heroImages.sizes["mango-branch"]}
      />
      <HandDrawnMotif
        kind={variant === 0 || variant === 1 ? "okra" : "flower"}
        className={`decor-piece ${variant === 0 || variant === 1 ? "drawn-okra-top" : "drawn-marigold-top"}`}
        sizes={
          variant === 0
            ? heroImages.storyOkraSizes
            : variant === 1
              ? heroImages.sizes["okra-branch"]
              : "(max-width: 767px) 160px, (min-width: 1700px) 360px, 280px"
        }
      />
      <HandDrawnMotif
        kind="sprig"
        className="decor-piece drawn-foliage"
        sizes={heroImages.sizes["native-foliage"]}
      />
      <HandDrawnMotif
        kind="flower"
        className="decor-piece drawn-marigold-bottom"
        sizes={heroImages.sizes["marigold-stem"]}
      />
      <HandDrawnMotif
        kind="bird"
        className="decor-piece drawn-bird"
        sizes={heroImages.sizes["orchard-bird"]}
      />
    </div>
  );
}
