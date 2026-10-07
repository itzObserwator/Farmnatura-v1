import HandDrawnMotif from "./HandDrawnMotif";
/** Original pen-and-watercolor ornaments around each chapter's hero headline. */
export default function HeroBotanicals({ variant = 0 }: { variant?: number }) {
  return (
    <div className={`handdrawn-decor handdrawn-${variant}`} aria-hidden="true">
      <HandDrawnMotif kind="mango" className="decor-piece drawn-mango" />
      <HandDrawnMotif
        kind="flower"
        className="decor-piece drawn-marigold-top"
      />
      <HandDrawnMotif kind="sprig" className="decor-piece drawn-foliage" />
      <HandDrawnMotif
        kind="flower"
        className="decor-piece drawn-marigold-bottom"
      />
      <HandDrawnMotif kind="bird" className="decor-piece drawn-bird" />
    </div>
  );
}
