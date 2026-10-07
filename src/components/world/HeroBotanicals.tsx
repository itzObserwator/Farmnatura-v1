/** Original pen-and-watercolor ornaments replace the hero's flat SVG decorations. */
export default function HeroBotanicals({ variant = 0 }: { variant?: number }) {
  return (
    <div className={`handdrawn-decor handdrawn-${variant}`} aria-hidden="true">
      <img
        className="decor-piece drawn-mango"
        src="/illustrations/hero/mango-branch.webp"
        alt=""
        width={600}
        height={800}
      />
      <img
        className="decor-piece drawn-marigold-top"
        src="/illustrations/hero/marigold-stem.webp"
        alt=""
        width={600}
        height={800}
      />
      <img
        className="decor-piece drawn-foliage"
        src="/illustrations/hero/native-foliage.webp"
        alt=""
        width={600}
        height={800}
      />
      <img
        className="decor-piece drawn-marigold-bottom"
        src="/illustrations/hero/marigold-stem.webp"
        alt=""
        width={600}
        height={800}
      />
      <img
        className="decor-piece drawn-bird"
        src="/illustrations/hero/orchard-bird.webp"
        alt=""
        width={800}
        height={600}
      />
    </div>
  );
}
