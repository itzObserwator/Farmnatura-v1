import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {X,ArrowUpRight} from 'lucide-react';
import {chapters,type ChapterId} from '../../data/chapters';
import {contact} from '../../data/content';
import {BotanicalMotif} from './BotanicalMotifs';
export default function MenuPanel({open,onClose,onNavigate,onHome,onVisit}:{open:boolean;onClose:()=>void;onNavigate:(id:ChapterId)=>void;onHome:()=>void;onVisit:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(open){ref.current?.showModal();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)gsap.fromTo('.menu-paper',{xPercent:100},{xPercent:0,duration:.8,stagger:.07,ease:'power3.out',overwrite:true});}else ref.current?.close();},[open]);
 return <dialog ref={ref} className="menu-dialog" data-lenis-prevent aria-label="Explore Farm Natura" onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="menu-paper paper-back-one"/><div className="menu-paper paper-back-two"/><div className="menu-paper paper-front"><button className="round-button menu-close" onClick={onClose} aria-label="Close menu"><X size={20} strokeWidth={1}/></button><button className="menu-home" onClick={onHome}>FARM NATURA <ArrowUpRight size={15}/></button><nav aria-label="Chapter navigation">{chapters.map(c=><button key={c.id} onClick={()=>onNavigate(c.id)}><span>{c.number}</span><span>{c.title}</span></button>)}</nav><BotanicalMotif kind="flower" className="menu-flower"/><div className="menu-footer"><p>A life rooted in nature.<br/>Kandukur, Hyderabad.</p><button className="paper-button" onClick={onVisit}>PLAN A VISIT <ArrowUpRight size={16}/></button><div><a href={`tel:${contact.tel}`}>{contact.phone}</a><a href="https://www.farmnatura.in/" target="_blank" rel="noreferrer">farmnatura.in ↗</a></div></div></div></dialog>;
}
