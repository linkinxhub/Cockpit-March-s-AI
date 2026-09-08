import { ExternalLink } from 'lucide-react';

// Verified Google Finance symbols. Never replace USDT with USD or an index with a CFD.
const quotes: Record<string, string> = {
  DAX40: 'DAX:INDEXDB', FTSE100: 'UKX:INDEXFTSE', CAC40: 'PX1:INDEXEURO',
  IBEX35: 'I:INDEXBME', STOXX50: 'SX5E:INDEXSTOXX',
};
const words = {
  fr: ['Consulter les sources Google', 'Cours et actualités sur Google Finance', 'Actualités sur Google', 'Consultation externe : ces données ne sont pas importées dans le cockpit.'],
  en: ['Consult Google sources', 'Prices and news on Google Finance', 'News on Google', 'External reference: this data is not imported into the cockpit.'],
  de: ['Google-Quellen ansehen', 'Kurse und Nachrichten auf Google Finance', 'Nachrichten auf Google', 'Externe Quelle: Diese Daten werden nicht in das Cockpit importiert.'],
  nl: ['Google-bronnen raadplegen', 'Koersen en nieuws op Google Finance', 'Nieuws op Google', 'Externe bron: deze gegevens worden niet in het cockpit geïmporteerd.'],
};
export default function GoogleMarketLinks({asset, language}: {asset: {key: string; name: string; symbol: string}; language: keyof typeof words}) {
  const t = words[language];
  const query = `${asset.name} ${asset.symbol}`;
  const quote = quotes[asset.key];
  const finance = quote ? `https://www.google.com/finance/quote/${encodeURIComponent(quote)}?hl=${language}` : `https://www.google.com/search?q=${encodeURIComponent("site:google.com/finance/quote/ " + query)}&hl=${language}`;
  const news = `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=${language}`;
  return <aside translate="no" aria-label={t[0]} style={{margin:'12px 24px',padding:16,border:'1px solid #29404c',borderRadius:10,background:'#0b1923',overflowWrap:'anywhere'}}>
    <strong>{t[0]} · {asset.symbol}</strong>
    <div style={{display:'flex',flexWrap:'wrap',gap:16,marginTop:12}}>
      <a href={finance} target="_blank" rel="noopener noreferrer" style={{color:'#b9f86b',display:'inline-flex',gap:6,alignItems:'center'}}>{t[1]} <ExternalLink size={14}/></a>
      <a href={news} target="_blank" rel="noopener noreferrer" style={{color:'#b9f86b',display:'inline-flex',gap:6,alignItems:'center'}}>{t[2]} <ExternalLink size={14}/></a>
    </div>
    <p style={{fontSize:12,color:'#a8bac6',marginBottom:0}}>{t[3]}</p>
  </aside>;
}
