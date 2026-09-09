"use client";
import {refundPolicy} from "@/lib/refund-policy";
import {useLanguage} from '@/lib/use-language';
import {infoLabels} from '@/lib/info-labels';
import {paths,pageKeys} from '@/lib/public-content';
import './public-content.css';
export default function SiteInfoLinks(){const [lang]=useLanguage(),c=infoLabels[lang];return <footer className="site-info-links"><a className="smartdev-credit" href="/qui-sommes-nous">{c[0]} <span>↗</span></a><nav aria-label={c[6]}><a href="/decouvrir">{{fr:"Découvrir la plateforme",en:"Discover the platform",de:"Plattform entdecken",nl:"Ontdek het platform"}[lang]}</a>{pageKeys.map((p,i)=><a key={p} href={paths[p]}>{c[i+1]}</a>)}<a href="/remboursement">{refundPolicy[lang].title}</a><a href="/contact">{{fr:"Contactez-nous",en:"Contact us",de:"Kontakt",nl:"Contact"}[lang]}</a></nav></footer>;}
