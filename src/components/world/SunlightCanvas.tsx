import {useEffect,useRef} from 'react';
import {useReducedMotion} from 'framer-motion';
import gsap from 'gsap';

/** A lazy-loaded Three.js/WebGL atmosphere. It never captures clicks or touch gestures. */
export default function SunlightCanvas({active,paused}:{active:number;paused:boolean}){
 const host=useRef<HTMLDivElement>(null);
 const uniforms=useRef<{uChapter:{value:number}}|null>(null);
 const reduced=useReducedMotion();
 const pause=useRef(paused);pause.current=paused;
 useEffect(()=>{if(uniforms.current)gsap.to(uniforms.current.uChapter,{value:active,duration:reduced?0:1.2,ease:'power2.inOut'});},[active,reduced]);
 useEffect(()=>{
  let cancelled=false;let dispose=()=>{};
  const node=host.current;if(!node)return;
  // Dynamic import keeps Three.js out of the intro and editorial page bundles.
  void import('three').then(THREE=>{
   if(cancelled)return;
   const canvas=document.createElement('canvas');
   const context=canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'});
   if(!context){node.dataset.webgl='unavailable';return;}
   const renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:false});
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);
   const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
   const values={uTime:{value:0},uPointer:{value:new THREE.Vector2(.5,.5)},uAspect:{value:1},uChapter:{value:active},uGreen:{value:new THREE.Color('#3c7a3a')},uYellow:{value:new THREE.Color('#fdd504')}};
   uniforms.current=values;
   const geometry=new THREE.PlaneGeometry(2,2);
   const material=new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,uniforms:values,
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
    fragmentShader:`
     varying vec2 vUv;
     uniform float uTime,uAspect,uChapter;
     uniform vec2 uPointer;
     uniform vec3 uGreen,uYellow;
     float hash(float x){return fract(sin(x*127.1)*43758.5453);}
     void main(){
      vec2 uv=vUv;
      vec2 sun=(uv-vec2(.62+uPointer.x*.025,.73+uPointer.y*.018))*vec2(uAspect,1.0);
      float r=length(sun);
      float glow=exp(-r*r*9.0)*.055;
      float angle=atan(sun.y,sun.x);
      float rays=pow(max(0.0,sin(angle*18.0+uTime*.055)),12.0)*exp(-r*3.0)*.025;
      // Quiet field contours near the foot of the page, inspired by furrowed farmland.
      float field=uv.y+sin(uv.x*5.0+uTime*.07)*.025;
      float lines=pow(.5+.5*sin(field*145.0),30.0)*(1.0-smoothstep(.04,.30,uv.y))*.025;
      float pollen=0.0;
      for(int i=0;i<18;i++){
       float n=float(i);
       vec2 p=vec2(hash(n+1.0),fract(hash(n+30.0)+uTime*(.004+hash(n)*.004)));
       p.x+=sin(uTime*.22+n*3.0)*.018;
       float d=length((uv-p)*vec2(uAspect,1.0));
       pollen+=exp(-d*d*280000.0)*.22;
      }
      vec3 color=mix(uYellow,uGreen,clamp(lines*18.0+uChapter*.10,0.0,.6));
      gl_FragColor=vec4(color,glow+rays+lines+pollen);
     }`});
   scene.add(new THREE.Mesh(geometry,material));node.append(canvas);node.dataset.webgl='ready';
   const resize=()=>{const {width,height}=node.getBoundingClientRect();renderer.setSize(width,height,false);values.uAspect.value=width/Math.max(height,1);renderer.render(scene,camera);};
   const observer=new ResizeObserver(resize);observer.observe(node);resize();
   const pointer=(event:PointerEvent)=>{if(event.pointerType==='touch')return;values.uPointer.value.set(event.clientX/innerWidth,1-event.clientY/innerHeight);};
   window.addEventListener('pointermove',pointer);
   let elapsed=0;let previous=performance.now();
   if(!reduced)renderer.setAnimationLoop(()=>{const now=performance.now();const dt=Math.min((now-previous)/1000,.05);previous=now;if(document.hidden||pause.current)return;elapsed+=dt;values.uTime.value=elapsed;renderer.render(scene,camera);});
   const lost=(event:Event)=>{event.preventDefault();renderer.setAnimationLoop(null);node.dataset.webgl='unavailable';};canvas.addEventListener('webglcontextlost',lost);
   dispose=()=>{renderer.setAnimationLoop(null);observer.disconnect();window.removeEventListener('pointermove',pointer);canvas.removeEventListener('webglcontextlost',lost);gsap.killTweensOf(values.uChapter);uniforms.current=null;geometry.dispose();material.dispose();renderer.dispose();canvas.remove();};
  }).catch(()=>{if(!cancelled)node.dataset.webgl='unavailable';});
  return()=>{cancelled=true;dispose();};
 },[reduced]);
 return <div ref={host} className="sunlight-canvas" aria-hidden="true"/>;
}
