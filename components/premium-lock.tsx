import Link from'next/link';
import type{CommercialPlan}from'@/lib/account-types';
import type{Feature}from'@/lib/entitlements';
const copy={fr:{title:'Fonction premium',text:'Débloquez cette analyse avec la formule adaptée.',cta:'Voir les offres'},en:{title:'Premium feature',text:'Unlock this analysis with the right plan.',cta:'View plans'},de:{title:'Premium-Funktion',text:'Schalten Sie diese Analyse mit dem passenden Tarif frei.',cta:'Tarife ansehen'},nl:{title:'Premiumfunctie',text:'Ontgrendel deze analyse met de passende formule.',cta:'Bekijk formules'}}as const;
export function PremiumLock({feature,requiredPlan,locale='fr'}:{feature:Feature;requiredPlan:CommercialPlan;locale?:keyof typeof copy}){const text=copy[locale];return <aside className="premiumLock" data-feature={feature}><span aria-hidden="true">🔒</span><div><strong>{text.title} · {requiredPlan}</strong><p>{text.text}</p></div><Link href="/pricing">{text.cta}</Link></aside>}
