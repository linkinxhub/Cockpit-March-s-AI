"use client";
import {useEffect,useState} from 'react';
import {ArrowUp} from 'lucide-react';
import {useLanguage} from '@/lib/use-language';
import './back-to-top.css';
export default function BackToTop(){
 const [visible,setVisible]=useState(false),[lang]=useLanguage();
 const label={fr:'Retour en haut',en:'Back to top',de:'Nach oben',nl:'Naar boven'}[lang];
 useEffect(()=>{const update=()=>setVisible(window.scrollY>500);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[]);
 if(!visible)return null;
 return <button type="button" className="back-to-top" aria-label={label} title={label} onClick={()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector<HTMLElement>('.usage-navigation a')?.focus({preventScroll:true});}}><ArrowUp size={22}/><span>{label}</span></button>;
}
