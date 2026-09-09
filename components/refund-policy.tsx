"use client";
import {useLanguage} from '@/lib/use-language';
import {refundPolicy} from '@/lib/refund-policy';

import './platform-highlights.css';
export function RefundNotice(){const [lang]=useLanguage(),c=refundPolicy[lang];return <div className="refund-notice"><p>{c.short}</p><a href="/remboursement">{c.title} →</a></div>;}
export default function RefundPolicy(){const [lang,setLang]=useLanguage(),c=refundPolicy[lang];return <main className="refund-page"><select aria-label="Language" value={lang} onChange={e=>setLang(e.target.value as typeof lang)}>{["fr","en","de","nl"].map(l=><option key={l} value={l}>{l.toUpperCase()}</option>)}</select><p className="feature-eyebrow">SMARTDEV · COCKPIT MARCHÉS AI</p><h1>{c.title}</h1><p>{c.intro}</p>{c.sections.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}<a className="feature-action" href="/contact">{c.contact} →</a></main>;}
