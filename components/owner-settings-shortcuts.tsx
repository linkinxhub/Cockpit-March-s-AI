"use client";
import {useEffect,useState} from 'react';
import {useLanguage} from '@/lib/use-language';
const labels={
 fr:['Super administrateur','Configuration sécurisée des services','OpenAI','Clé API et modèle IA','Stripe — mode test','Clé Stripe, secret webhook et offres','Les clés restent chiffrées côté serveur. Chaque site conserve sa propre configuration.'],
 en:['Super administrator','Secure service settings','OpenAI','API key and AI model','Stripe — test mode','Stripe key, webhook secret and plans','Keys remain encrypted on the server. Each site keeps its own settings.'],
 de:['Superadministrator','Sichere Diensteinstellungen','OpenAI','API-Schlüssel und KI-Modell','Stripe — Testmodus','Stripe-Schlüssel, Webhook-Geheimnis und Tarife','Die Schlüssel bleiben serverseitig verschlüsselt. Jede Website hat ihre eigene Konfiguration.'],
 nl:['Superbeheerder','Veilige service-instellingen','OpenAI','API-sleutel en AI-model','Stripe — testmodus','Stripe-sleutel, webhookgeheim en abonnementen','Sleutels blijven op de server versleuteld. Elke site heeft zijn eigen instellingen.']
};
export default function OwnerSettingsShortcuts(){
 const [lang]=useLanguage(),c=labels[lang];const [authorized,setAuthorized]=useState(false);
 useEffect(()=>{const controller=new AbortController();fetch('/api/admin/settings-access',{cache:'no-store',signal:controller.signal}).then(async r=>{if(!r.ok)return false;const data=await r.json();return data.authorized===true;}).then(value=>{if(!controller.signal.aborted)setAuthorized(value);}).catch(()=>{if(!controller.signal.aborted)setAuthorized(false);});return()=>controller.abort();},[]);
 if(!authorized)return null;
 return <section style={{border:'1px solid #39574b',borderRadius:16,padding:20,margin:'20px 0',background:'#0d202b'}} aria-label={c[0]}><h3 style={{color:'#bafa70',marginBottom:8}}>{c[0]}</h3><p>{c[1]}</p><div style={{display:'flex',flexWrap:'wrap',gap:12,margin:'16px 0'}}>{[[c[2],c[3],'/admin/ai-settings'],[c[4],c[5],'/admin/stripe-settings']].map(([title,description,url])=><a key={url} href={url} style={{flex:'1 1 220px',display:'block',padding:16,border:'1px solid #476854',borderRadius:12,background:'#17323b',color:'#e5f3ee',textDecoration:'none'}}><strong style={{display:'block',marginBottom:6}}>{title} →</strong><span style={{fontSize:13,color:'#bbcecb'}}>{description}</span></a>)}</div><p style={{fontSize:13,color:'#b6c8c4'}}>{c[6]}</p></section>;
}
