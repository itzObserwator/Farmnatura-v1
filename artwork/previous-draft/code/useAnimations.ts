import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
/** All motion in one place. Respect reduced motion; clean up on React unmount. */
export function useAnimations() {
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  let lenis:Lenis|undefined;
  const tick=(time:number)=>lenis?.raf(time*1000);
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   lenis=new Lenis({duration:1.1,smoothWheel:true,anchors:{offset:-85}});
   lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);
   gsap.from('.hero-copy, .hero-art',{y:45,opacity:0,duration:1.15,stagger:.18,ease:'power3.out'});
   gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
   gsap.to('.family-art',{y:-6,duration:4,yoyo:true,repeat:-1,ease:'sine.inOut'});
   gsap.to('.garden-butterfly',{x:18,y:-16,rotation:8,duration:3.4,yoyo:true,repeat:-1,ease:'sine.inOut'});
   gsap.to('.butterfly-wings',{scaleX:.65,transformOrigin:'50% 50%',duration:.4,yoyo:true,repeat:-1});
   gsap.to('.garden-mote',{y:-30,opacity:.15,duration:3,stagger:.8,yoyo:true,repeat:-1,ease:'sine.inOut'});
   gsap.to('.bee-wings',{scaleY:.6,transformOrigin:'center',duration:.12,yoyo:true,repeat:-1});
   gsap.to('.hero-bee',{motionPath:{path:'#bee-path',align:'#bee-path',alignOrigin:[.5,.5],autoRotate:false},duration:18,repeat:-1,ease:'sine.inOut'});
   gsap.to('.scroll-bee',{y:-200,x:120,rotation:-25,scrollTrigger:{trigger:'.intro',start:'top bottom',end:'bottom top',scrub:1.2}});
   media.add('(min-width: 800px)',()=>{
    const track=document.querySelector<HTMLElement>('.landscape-track')!;
    gsap.to(track,{x:()=>-(track.scrollWidth-window.innerWidth),ease:'none',scrollTrigger:{trigger:'.landscape',pin:true,start:'top top',end:()=>`+=${track.scrollWidth-window.innerWidth}`,scrub:.9,invalidateOnRefresh:true}});
   });
   return()=>{gsap.ticker.remove(tick);lenis?.destroy();lenis=undefined;};
  });
  return()=>media.revert();
 },[]);
}
