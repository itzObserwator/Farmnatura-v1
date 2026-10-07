/** Shared original pen-and-watercolor ornaments. Decorative images have empty alt text. */
const motifs = {
  flower: "marigold-stem",
  mango: "mango-branch",
  bird: "orchard-bird",
  sprig: "native-foliage",
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
    <img
      className={className}
      src={`/illustrations/hero/${motifs[kind]}.webp`}
      alt=""
      aria-hidden="true"
      width={kind === "bird" ? 800 : 600}
      height={kind === "bird" ? 600 : 800}
      loading={loading}
      draggable="false"
    />
  );
}
