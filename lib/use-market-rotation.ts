"use client";
import {useEffect,useRef,useState} from 'react';
const categories=['Indices','Crypto','Forex','Métaux','Baromètres'];
export function useMarketRotation(category:string,setCategory:(value:string)=>void){
 const [node,rail]=useState<HTMLDivElement|null>(null);
 const container=useRef<HTMLDivElement>(null),previous=useRef('');
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
 if(!node)return;
 if(previous.current!==category){node.scrollLeft=0;previous.current=category;}
 let frame=0,last=0,elapsed=0,end=0,position=node.scrollLeft,stopped=false;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function tick(now:number){
  if(stopped)return;
  const dt=last?Math.min(now-last,100):0;last=now;
  const blocked=paused||reduced.matches||document.hidden||!node!.getClientRects().length||container.current?.matches(':hover, :focus-within');
  if(!blocked){
   elapsed+=dt;
   const max=Math.max(0,node!.scrollWidth-node!.clientWidth);
   if(elapsed>4000){position=Math.min(max,Math.max(position,node!.scrollLeft)+dt*.012);node!.scrollLeft=position;}
   if(elapsed>4000&&position>=max-1)end+=dt;else end=0;
   if(end>=4000){setCategory(categories[(categories.indexOf(category)+1)%categories.length]);return;}
  }else{position=node!.scrollLeft;}
  frame=requestAnimationFrame(tick);
 }
 frame=requestAnimationFrame(tick);
 return()=>{stopped=true;cancelAnimationFrame(frame);};
 },[node,category,paused,setCategory]);
 return {rail,container,paused,setPaused};
}
