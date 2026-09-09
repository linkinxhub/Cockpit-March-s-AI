'use client';
import {useLanguage} from '@/lib/use-language';
export default function StripeSettingsLink(){const [lang]=useLanguage();const c={fr:['Configuration Stripe','Paiements test · Propriétaire'],en:['Stripe settings','Test payments · Owner'],de:['Stripe-Konfiguration','Testzahlungen · Eigentümer'],nl:['Stripe-instellingen','Testbetalingen · Eigenaar']}[lang];return <a href="/admin/stripe-settings" className="accountCard"><h2>{c[0]}</h2><p>{c[1]}</p></a>;}
