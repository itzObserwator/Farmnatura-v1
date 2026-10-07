import {useLayoutEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
/** Editorial-page movement is separate from the chapter carousel's wheel controls. */
export function useChapterAnimations(){
 useLayoutEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const lenis=new Lenis({duration:1.15,anchors:{offset:-90},prevent:node=>node.closest('dialog')!==null});
  const tick=(t:number)=>lenis.raf(t*1000);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);
  const ctx=gsap.context(()=>{
   gsap.from('.page-hero .line-inner',{yPercent:110,opacity:0,duration:1.1,stagger:.1,ease:'power3.out',delay:.2});
   gsap.from('.page-hero .chapter-tag, .hero-subtitle',{opacity:0,y:15,duration:1,delay:.6});
   gsap.to('.page-hero .decor-piece',{y:-14,rotation:'+=3',duration:4,yoyo:true,repeat:-1,stagger:.3,ease:'sine.inOut'});
   gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.from(el,{y:55,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
   gsap.utils.toArray<HTMLElement>('.art-panel img').forEach(el=>gsap.fromTo(el,{y:30},{y:-30,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}}));
   gsap.to('.hero-decor',{yPercent:18,ease:'none',scrollTrigger:{trigger:'.page-hero',start:'top top',end:'bottom top',scrub:1}});
  });
  const refresh=()=>ScrollTrigger.refresh();void document.fonts.ready.then(refresh);const timeout=window.setTimeout(refresh,1200);window.addEventListener('load',refresh);
  return()=>{clearTimeout(timeout);window.removeEventListener('load',refresh);ctx.revert();gsap.ticker.remove(tick);lenis.destroy();};
 },[]);
}
