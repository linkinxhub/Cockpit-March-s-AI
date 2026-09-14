"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
const categories=['Indices','Crypto','Forex','Métaux','Baromètres'];
export function useMarketRotation(category:string,setCategory:(value:string)=>void){
 const node=useRef<HTMLDivElement|null>(null),container=useRef<HTMLDivElement|null>(null),previous=useRef('');
 const [paused,setPaused]=useState(false);
 const railRef=useCallback((value:HTMLDivElement|null)=>{node.current=value;},[]);
 const containerRef=useCallback((value:HTMLDivElement|null)=>{container.current=value;},[]);
 useEffect(()=>{
 const currentRail=node.current;if(!currentRail)return;
 const rail:HTMLDivElement=currentRail;
 if(previous.current!==category){rail.scrollLeft=0;previous.current=category;}
 let frame=0,last=0,elapsed=0,end=0,position=rail.scrollLeft,stopped=false;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function tick(now:number){
  if(stopped)return;
  const dt=last?Math.min(now-last,100):0;last=now;
  const blocked=paused||reduced.matches||document.hidden||!rail.getClientRects().length||container.current?.matches(':hover, :focus-within');
  if(!blocked){
   elapsed+=dt;
   const max=Math.max(0,rail.scrollWidth-rail.clientWidth);
   if(elapsed>4000){position=Math.min(max,Math.max(position,rail.scrollLeft)+dt*.012);rail.scrollLeft=position;}
   if(elapsed>4000&&position>=max-1)end+=dt;else end=0;
   if(end>=4000){setCategory(categories[(categories.indexOf(category)+1)%categories.length]);return;}
  }else{position=rail.scrollLeft;}
  frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);
 return()=>{stopped=true;cancelAnimationFrame(frame);};
 },[category,paused,setCategory]);
 return {railRef,containerRef,paused,setPaused};
}
