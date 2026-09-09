"use client";
import {useEffect,useState} from 'react';
import {useLanguage} from '@/lib/use-language';
import './text-size-controls.css';
const KEY='cockpit-text-scale';
const levels=[90,100,110,120,130,140,150];
const words={fr:['Taille du texte','Réduire le texte','Agrandir le texte','Rétablir la taille normale'],en:['Text size','Decrease text size','Increase text size','Reset text size'],de:['Textgröße','Text verkleinern','Text vergrößern','Textgröße zurücksetzen'],nl:['Tekstgrootte','Tekst verkleinen','Tekst vergroten','Tekstgrootte herstellen']};
function valid(value:number){return levels.includes(value)?value:100;}
export default function TextSizeControls(){
 const [lang]=useLanguage(),c=words[lang];const [size,setSize]=useState(100);
 useEffect(()=>{function apply(value:number){const next=valid(value);setSize(next);document.documentElement.style.fontSize=next+'%';}
 try{apply(Number(localStorage.getItem(KEY)));}catch{}
 const sync=(e:StorageEvent)=>{if(e.key===KEY||e.key===null)apply(Number(e.newValue));};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[]);
 function change(value:number){const next=valid(value);setSize(next);document.documentElement.style.fontSize=next+'%';try{localStorage.setItem(KEY,String(next));}catch{}}
 return <div className="text-size-controls" role="group" aria-label={c[0]}><button type="button" onClick={()=>change(size-10)} disabled={size===90} aria-label={c[1]} title={c[1]}>A−</button><button type="button" className="text-size-reset" onClick={()=>change(100)} aria-label={c[3]} title={c[3]}><span aria-live="polite">{size}%</span></button><button type="button" onClick={()=>change(size+10)} disabled={size===150} aria-label={c[2]} title={c[2]}>A+</button></div>;
}
