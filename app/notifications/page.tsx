'use client';
import{useEffect,useMemo,useState}from'react';

type Event={id:string;assetKey:string;title:string;publisher:string;publishedAt:number;severity:'INFO'|'IMPORTANT'|'CRITIQUE';reason:string;link:string};

export default function NotificationsPage(){
 const[events,setEvents]=useState<Event[]>([]),[severity,setSeverity]=useState('IMPORTANT'),[loading,setLoading]=useState(true),[read,setRead]=useState<Set<string>>(new Set());
 useEffect(()=>{setLoading(true);fetch(`/api/news-alerts?severity=${encodeURIComponent(severity)}`).then(r=>r.json()).then(d=>setEvents(d.events||[])).finally(()=>setLoading(false));},[severity]);
 const unread=useMemo(()=>events.filter(e=>!read.has(e.id)).length,[events,read]);
 const mark=(id:string)=>setRead(prev=>new Set(prev).add(id));
 return <main style={{maxWidth:980,margin:'0 auto',padding:'32px 20px',fontFamily:'system-ui'}}>
  <header style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',flexWrap:'wrap'}}><div><p style={{opacity:.65,margin:0}}>COCKPIT MARCHÉS AI</p><h1 style={{margin:'4px 0'}}>Centre de notifications</h1><p style={{opacity:.75}}>News synchronisées avec l’application Flutter · {unread} non lue(s)</p></div><a href="/" style={{color:'inherit'}}>← Retour au cockpit</a></header>
  <section style={{display:'flex',gap:8,margin:'22px 0',flexWrap:'wrap'}}>{['INFO','IMPORTANT','CRITIQUE'].map(level=><button key={level} onClick={()=>setSeverity(level)} style={{padding:'9px 14px',borderRadius:10,border:'1px solid #556',background:severity===level?'#243244':'transparent',color:'inherit'}}>{level}</button>)}</section>
  {loading?<p>Chargement…</p>:events.length===0?<p>Aucune alerte pour ce filtre.</p>:<section style={{display:'grid',gap:12}}>{events.map(event=><article key={event.id} onClick={()=>mark(event.id)} style={{padding:16,border:'1px solid #334',borderRadius:14,opacity:read.has(event.id)?.55:1,cursor:'pointer'}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'start'}}><div><strong>{event.severity} · {event.assetKey}</strong><h2 style={{fontSize:18,margin:'6px 0'}}>{event.title}</h2><p style={{margin:'4px 0',opacity:.75}}>{event.reason}</p><small>{event.publisher} · {new Date(event.publishedAt).toLocaleString('fr-BE')}</small></div><a href={event.link} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>Ouvrir</a></div></article>)}</section>}
 </main>;
}
