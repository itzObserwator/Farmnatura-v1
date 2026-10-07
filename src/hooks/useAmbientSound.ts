import {useEffect,useRef,useState} from 'react';
/** Optional, locally synthesised ambience. No autoplay or external audio download. */
export function useAmbientSound(){
 const [enabled,setEnabled]=useState(false);const context=useRef<AudioContext|null>(null);
 useEffect(()=>{
  if(!enabled){if(context.current){void context.current.close();context.current=null;}return;}
  const audio=new AudioContext();context.current=audio;void audio.resume();
  const gain=audio.createGain();gain.gain.value=.015;gain.connect(audio.destination);
  const tones=[196,293.66,392].map((frequency,i)=>{const osc=audio.createOscillator();osc.type='sine';osc.frequency.value=frequency;const volume=audio.createGain();volume.gain.value=.3/(i+1);osc.connect(volume);volume.connect(gain);osc.start();return osc;});
  return()=>{tones.forEach(t=>t.stop());if(audio.state!=='closed')void audio.close();context.current=null;};
 },[enabled]);return {enabled,toggle:()=>setEnabled(v=>!v)};
}
