import ResponsiveImage from "./ResponsiveImage";
/** Shared original pen-and-watercolor ornaments. Decorative images have empty alt text. */
const motifs = {
  flower: "marigold-stem",
  mango: "mango-branch",
  bird: "orchard-bird",
  sprig: "native-foliage",
  okra: "okra-branch",
  chilli: "chilli-sprig",
} as const;
export default function HandDrawnMotif({
  kind,
  className = "",
  loading,
}: {
  kind: keyof typeof motifs;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <picture className="botanical-picture">
      <source type="image/avif" srcSet={[240,480,800].map(width => `/illustrations/hero/${motifs[kind]}-${width}.avif ${width}w`).join(', ')} sizes={className.includes('scene-orbit') ? '100px' : '(max-width: 767px) 180px, 400px'}/>
    <ResponsiveImage
      className={className}
      src={`/illustrations/hero/${motifs[kind]}.webp`}
      srcSet={[240, 480, 800].map(width => `/illustrations/hero/${motifs[kind]}-${width}.webp ${width}w`).join(', ')}
      sizes={className.includes('scene-orbit') ? '100px' : '(max-width: 767px) 180px, 400px'}
      decoding="async"
      alt=""
      aria-hidden="true"
      width={1000}
      height={{flower:1053,mango:1500,bird:667,sprig:667,okra:914,chilli:1500}[kind]}
      fetchPriority={className.includes('drawn-marigold-bottom') ? 'high' : className.includes('drawn-') ? 'low' : undefined}
      loading={loading}
      draggable="false"
    />
    </picture>
  );
}
