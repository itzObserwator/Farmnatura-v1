import ResponsiveImage from "./ResponsiveImage";
/** The supplied logo, preserved unchanged with its transparent background. */
export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <ResponsiveImage
      className={`brand-logo ${className}`}
      src="/branding/farmnatura-logo.png"
      srcSet="/branding/farmnatura-logo-340.webp 340w, /branding/farmnatura-logo-680.webp 680w"
      sizes="(max-width: 767px) 130px, 220px"
      alt="Farm Natura"
      width={609}
      height={283}
      fetchPriority="high"
    />
  );
}
