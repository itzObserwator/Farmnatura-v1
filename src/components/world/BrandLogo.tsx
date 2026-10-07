/** The supplied logo, preserved unchanged with its transparent background. */
export default function BrandLogo({className=''}:{className?:string}){
 return <img className={`brand-logo ${className}`} src="/branding/farmnatura-logo.png" alt="Farm Natura" width={609} height={283} fetchPriority="high"/>;
}
