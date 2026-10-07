import {useCallback,useEffect,useRef,useState} from 'react';
import gsap from 'gsap';
import {Menu} from 'lucide-react';
import {chapters,type ChapterId} from './data/chapters';
import Intro from './components/world/Intro';
import ChapterCarousel from './components/world/ChapterCarousel';
import ChapterPage from './components/world/ChapterPage';
import MenuPanel from './components/world/MenuPanel';
import ContactDialog from './components/ContactDialog';
import {FarmSeal,BotanicalMotif} from './components/world/BotanicalMotifs';
import {useAmbientSound} from './hooks/useAmbientSound';
function readRoute():ChapterId|null{return chapters.find(c=>`#${c.id}`===location.hash)?.id??null;}
export default function App(){
 const [route,setRoute]=useState<ChapterId|null>(readRoute),[intro,setIntro]=useState(()=>!sessionStorage.getItem('farm-entered')&&!readRoute()),[menu,setMenu]=useState(false),[visit,setVisit]=useState(false),[active,setActive]=useState(0);
 const {enabled,toggle}=useAmbientSound();const curtain=useRef<HTMLDivElement>(null);const transition=useRef<gsap.core.Timeline|null>(null);const busy=useRef(false);
 const enter=useCallback(()=>{sessionStorage.setItem('farm-entered','yes');setIntro(false);},[]);
 const onActive=useCallback((index:number)=>setActive(index),[]);
 const navigate=useCallback((id:ChapterId|null)=>{
  setMenu(false);if(busy.current)return;
  const commit=()=>{history.pushState(null,'',id?`#${id}`:location.pathname+location.search);setRoute(id);window.scrollTo(0,0);};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){commit();return;}
  busy.current=true;transition.current=gsap.timeline({onComplete:()=>{busy.current=false;}}).set(curtain.current,{visibility:'visible',yPercent:100}).to(curtain.current,{yPercent:0,duration:.65,ease:'power3.inOut'}).call(commit).to(curtain.current,{yPercent:-100,duration:.7,ease:'power3.inOut',delay:.1}).set(curtain.current,{visibility:'hidden'});
 },[]);
 useEffect(()=>{const pop=()=>{setRoute(readRoute());setMenu(false);window.scrollTo(0,0);};window.addEventListener('popstate',pop);window.addEventListener('hashchange',pop);return()=>{window.removeEventListener('popstate',pop);window.removeEventListener('hashchange',pop);transition.current?.kill();};},[]);
 useEffect(()=>{document.title=route?`${chapters.find(c=>c.id===route)?.title} — Farm Natura`:'Farm Natura — A Life Rooted in Nature';document.documentElement.style.overflow=(!route||intro)?'hidden':'';return()=>{document.documentElement.style.overflow='';};},[route,intro]);
 const chapter=chapters.find(c=>c.id===route);
 return <><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById("main-content")?.focus();}}>Skip to content</a>{!intro&&<header className="world-header"><button className="brand-seal" aria-label="Farm Natura home" onClick={()=>navigate(null)}><FarmSeal/></button><button className="round-button header-menu" aria-label="Open menu" aria-expanded={menu} onClick={()=>setMenu(true)}><Menu size={21} strokeWidth={1}/></button></header>}
 <main id="main-content" tabIndex={-1}>{intro?<Intro onComplete={enter}/>:chapter?<ChapterPage key={chapter.id} chapter={chapter} onVisit={()=>setVisit(true)} onNavigate={navigate}/>:<ChapterCarousel onExplore={navigate} onActive={onActive} blocked={menu||visit}/>}</main>
 <div className="world-utilities"><button className={`round-button sound-toggle ${enabled?'is-on':''}`} aria-label={enabled?'Turn sound off':'Turn sound on'} aria-pressed={enabled} onClick={toggle}>{[0,1,2,3,4].map(i=><span key={i}/>)}</button>{!intro&&chapter&&<><button className="paper-button index-button" onClick={()=>setMenu(true)}>INDEX <Menu size={18} strokeWidth={1}/></button><span className="page-number">{chapter.number}/03</span></>}</div>
 <MenuPanel open={menu} onClose={()=>setMenu(false)} onNavigate={navigate} onHome={()=>navigate(null)} onVisit={()=>{setMenu(false);setVisit(true);}}/><ContactDialog open={visit} onClose={()=>setVisit(false)}/><div ref={curtain} className="transition-curtain" aria-hidden="true"><BotanicalMotif kind={active===2?'bird':'flower'}/><span>FARM NATURA</span></div></>;
}
