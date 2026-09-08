"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import {RefreshCw,History} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {useLanguage} from '@/lib/use-language';
import {releaseManifest} from '@/lib/releases';
import './update-center.css';
const words = {
 title:['Nouveautés et mises à jour','News and updates','Neuigkeiten und Updates','Nieuws en updates'],
 check:['Vérifier maintenant','Check now','Jetzt prüfen','Nu controleren'],
 update:['Mettre à jour','Update now','Jetzt aktualisieren','Nu bijwerken'],
 pending:['Nouvelle version disponible','New version available','Neue Version verfügbar','Nieuwe versie beschikbaar'],
 current:['Version affichée','Displayed version','Angezeigte Version','Weergegeven versie'],
 error:['Vérification indisponible. Réessayez lorsque la connexion revient.','Update check unavailable. Retry when connected.','Update-Prüfung nicht verfügbar. Bei Verbindung erneut versuchen.','Updatecontrole niet beschikbaar. Probeer het opnieuw zodra u verbinding heeft.'],
 latest:['Vous disposez de la dernière version.','You have the latest version.','Sie haben die neueste Version.','U heeft de nieuwste versie.'],
 notice:['Vos saisies non enregistrées pourraient être perdues. Enregistrez-les avant de recharger.','Unsaved input could be lost. Save it before reloading.','Nicht gespeicherte Eingaben könnten verloren gehen. Speichern Sie diese vor dem Neuladen.','Niet-opgeslagen invoer kan verloren gaan. Sla deze op vóór vernieuwen.'],
 confirm:['J’ai enregistré, recharger','I have saved, reload','Gespeichert, neu laden','Opgeslagen, vernieuwen'],
 automatic:['Vérification automatique toutes les 5 minutes. Aucun rechargement forcé pendant votre utilisation.','Automatic checks every 5 minutes. No forced reload while you work.','Automatische Prüfung alle 5 Minuten. Kein erzwungenes Neuladen während der Nutzung.','Automatische controle elke 5 minuten. Geen gedwongen herlaadactie tijdens gebruik.'],
 next:['À venir — en préparation','Upcoming — in preparation','Demnächst — in Vorbereitung','Binnenkort — in voorbereiding'],
 checking:['Vérification…','Checking…','Prüfung…','Controleren…']
};
type Manifest=typeof releaseManifest;
export default function UpdateCenter({runningBuild}:{runningBuild:string}) {
 const [language]=useLanguage();const i={fr:0,en:1,de:2,nl:3}[language];const t=(key:keyof typeof words)=>words[key][i];
 const [open,setOpen]=useState(false),[latest,setLatest]=useState<Manifest>(releaseManifest),[checking,setChecking]=useState(false),[status,setStatus]=useState<'idle'|'ok'|'error'>('idle'),[confirm,setConfirm]=useState(false);
 const busy=useRef(false),dirty=useRef(false),request=useRef<AbortController|null>(null);
 const check=useCallback(async()=>{if(busy.current)return;busy.current=true;setChecking(true);const controller=new AbortController();request.current=controller;const timeout=setTimeout(()=>controller.abort(),12000);try{const res=await fetch('/api/releases',{cache:'no-store',signal:controller.signal});if(!res.ok)throw Error();const data=await res.json();if(data.schemaVersion!==1||typeof data.buildId!=='string'||!Array.isArray(data.releases)||!data.upcoming)throw Error();setLatest(data);setStatus('ok');}catch{if(!controller.signal.aborted)setStatus('error');else if(request.current===controller)setStatus('error');}finally{clearTimeout(timeout);busy.current=false;setChecking(false);}},[]);
 useEffect(()=>{const initial=setTimeout(()=>void check(),1000);const interval=setInterval(()=>{if(!document.hidden)void check();},300000);const visible=()=>{if(!document.hidden)void check();};const input=()=>{dirty.current=true;};document.addEventListener('visibilitychange',visible);document.addEventListener('input',input);return()=>{clearTimeout(initial);clearInterval(interval);request.current?.abort();request.current=null;document.removeEventListener('visibilitychange',visible);document.removeEventListener('input',input);};},[check]);
 const available=latest.buildId!==runningBuild;
 const reload=()=>{const event=new Event('cockpit-before-update',{cancelable:true});if(!window.dispatchEvent(event))return;window.location.reload();};
 return <div translate="no"><button type="button" className={'cu-launch '+(available?'cu-available':'')} onClick={()=>setOpen(true)} aria-label={available?t('pending'):t('title')}><History aria-hidden="true"/><span>{available?t('pending'):t('title')}</span>{available&&<i aria-hidden="true"/>}</button><Dialog open={open} onOpenChange={v=>{setOpen(v);setConfirm(false);}}><DialogContent className="cu-panel"><DialogTitle>{t('title')}</DialogTitle><DialogDescription>{t('automatic')}</DialogDescription><p>{t('current')} : <b>{releaseManifest.version}</b> · <code>{runningBuild.slice(0,8)}</code></p><div className="cu-actions"><button type="button" disabled={checking} onClick={()=>void check()}><RefreshCw aria-hidden="true"/>{t(checking?'checking':'check')}</button>{available&&<button type="button" onClick={()=>dirty.current?setConfirm(true):reload()}>{t('update')}</button>}</div>{status==='error'&&<p role="status">{t('error')}</p>}{status==='ok'&&<p role="status">{t(available?'pending':'latest')}</p>}{confirm&&<section className="cu-confirm"><p>{t('notice')}</p><button type="button" onClick={reload}>{t('confirm')}</button></section>}<div className="cu-history">{latest.releases.map(r=><section key={r.version}><h3>{r.version} <small>{r.date}</small></h3><ul>{(r.notes[language]??r.notes.fr).map(note=><li key={note}>{note}</li>)}</ul></section>)}<section><h3>{t('next')}</h3><ul>{(latest.upcoming[language]??latest.upcoming.fr).map(note=><li key={note}>{note}</li>)}</ul></section></div></DialogContent></Dialog></div>;
}
