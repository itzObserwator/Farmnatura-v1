import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {Observer} from 'gsap/Observer';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {chapters,type ChapterId} from '../../data/chapters';
import {BotanicalMotif} from './BotanicalMotifs';
gsap.registerPlugin(Observer);
export default function ChapterCarousel({onExplore,onActive,blocked}:{onExplore:(id:ChapterId)=>void;onActive:(index:number)=>void;blocked:boolean}){
 const [active,setActive]=useState(0);const root=useRef<HTMLDivElement>(null);const lock=useRef(false);const changeRef=useRef<(direction:number)=>void>(()=>{});
 const change=(direction:number)=>{if(lock.current||blocked)return;lock.current=true;setActive(a=>(a+direction+3)%3);};changeRef.current=change;
 useLayoutEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layout=()=>{const gap=innerWidth*(innerWidth<768?.69:.47);root.current?.querySelectorAll<HTMLElement>('.chapter-scene').forEach((el,i)=>{let offset=(i-active+3)%3;if(offset===2)offset=-1;const currentX=Number(gsap.getProperty(el,'x'));el.style.zIndex=offset===0?'2':'1';if(!reduced&&Math.abs(currentX-offset*gap)>gap*1.5){gsap.set(el,{x:offset*gap,y:55,scale:.68,opacity:0});gsap.to(el,{opacity:1,duration:.6,delay:.35,overwrite:true});}else{gsap.to(el,{x:offset*gap,y:offset===0?0:55,scale:offset===0?1:.68,opacity:1,duration:reduced?0:1.1,ease:'power3.inOut',overwrite:true});}gsap.to(el.querySelector('.scene-illustration'),{rotation:offset*-5,duration:reduced?0:1.1,ease:'power3.inOut',overwrite:true});});};
  layout();onActive(active);
  gsap.fromTo('.chapter-caption',{y:22,opacity:0},{y:0,opacity:1,duration:reduced?0:.65,delay:reduced?0:.15,ease:'power3.out',overwrite:true});
  const timeout=window.setTimeout(()=>{lock.current=false;},reduced?150:1150);window.addEventListener('resize',layout);return()=>{clearTimeout(timeout);window.removeEventListener('resize',layout);};
 },[active,onActive]);
 useEffect(()=>{
  if(blocked)return;
  const observer=Observer.create({target:root.current,type:'wheel,touch',preventDefault:true,tolerance:45,wheelSpeed:1,onDown:()=>changeRef.current(1),onUp:()=>changeRef.current(-1),onLeft:()=>changeRef.current(1),onRight:()=>changeRef.current(-1)});
  const keyboard=(e:KeyboardEvent)=>{if((e.target as HTMLElement).closest('button,a,input,dialog'))return;if(['ArrowDown','ArrowRight','PageDown'].includes(e.key)){e.preventDefault();changeRef.current(1);}if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();changeRef.current(-1);}};
  window.addEventListener('keydown',keyboard);return()=>{observer.kill();window.removeEventListener('keydown',keyboard);};
 },[blocked]);
 useEffect(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced)return;const ctx=gsap.context(()=>{gsap.to('.scene-orbit',{y:-9,rotation:7,duration:3.8,stagger:.3,yoyo:true,repeat:-1,ease:'sine.inOut'});const move=(e:PointerEvent)=>{if(e.pointerType==='touch')return;gsap.to('.scene-parallax',{x:(e.clientX/innerWidth-.5)*22,y:(e.clientY/innerHeight-.5)*15,duration:1,ease:'power2.out'});};window.addEventListener('pointermove',move);return()=>window.removeEventListener('pointermove',move);},root);return()=>ctx.revert();},[]);
 return <div ref={root} className="chapter-carousel" aria-label="Explore Farm Natura’s three chapters"><div className="scenes-stage">{chapters.map((chapter,i)=><button key={chapter.id} className={`chapter-scene scene-${i} ${active===i?'is-current':''}`} aria-label={active===i?`Explore ${chapter.title}`:`Show ${chapter.title}`} onClick={()=>active===i?onExplore(chapter.id):change((i-active+3)%3===1?1:-1)} tabIndex={active===i?0:-1}><div className="scene-parallax"><div className="scene-blob" style={{backgroundColor:chapter.color}}/><img className="scene-illustration" src={chapter.art} alt={chapter.alt} draggable="false"/><BotanicalMotif kind={i===2?'bird':'flower'} className="scene-orbit orbit-one"/><BotanicalMotif kind="mango" className="scene-orbit orbit-two"/><span className="scene-explore">EXPLORE<br/>↗</span></div></button>)}</div><div className="chapter-caption" key={active}><span className="chapter-tag">{chapters[active].tag}</span><h1><button onClick={()=>onExplore(chapters[active].id)}>{chapters[active].title}</button></h1><button className="caption-explore" onClick={()=>onExplore(chapters[active].id)}>explore ↗</button></div><div className="carousel-controls"><button className="paper-button arrow-button" aria-label="Previous chapter" onClick={()=>change(-1)}><ArrowLeft size={23} strokeWidth={1}/></button><button className="paper-button arrow-button" aria-label="Next chapter" onClick={()=>change(1)}><ArrowRight size={23} strokeWidth={1}/></button></div><span className="scroll-instruction">SCROLL TO DISCOVER</span><div className="chapter-pagination" aria-live="polite"><span className="pagination-orbit"/>0{active+1}<span>/03</span></div></div>;
}
