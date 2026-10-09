import ResponsiveImage from "./ResponsiveImage";
/** The supplied logo, preserved unchanged with its transparent background. */
export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <ResponsiveImage
      className={`brand-logo ${className}`}
      src="/branding/farmnatura-logo.png"
      srcSet="/branding/farmnatura-logo-170.avif 170w, /branding/farmnatura-logo-240.avif 240w, /branding/farmnatura-logo-340.avif 340w, /branding/farmnatura-logo-680.avif 680w"
      sizes={
        className.includes("intro-logo")
          ? "(max-width: 767px) 160px, 220px"
          : className.includes("footer-logo")
            ? "(max-width: 767px) 110px, 145px"
            : "(max-width: 767px) 140px, 170px"
      }
      alt="Farm Natura"
      width={609}
      height={283}
      fetchPriority="high"
    />
  );
}
