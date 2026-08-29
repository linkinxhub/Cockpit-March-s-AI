'use client';
import{useState}from'react';

export default function MobileConnectPage(){
 const[token,setToken]=useState(''),[expiresAt,setExpiresAt]=useState<number|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const generate=async()=>{setLoading(true);setError('');try{const r=await fetch('/api/mobile-session',{method:'POST'}),data=await r.json();if(!r.ok)throw new Error(data?.error||'Erreur');setToken(data.token||'');setExpiresAt(data.expiresAt||null);}catch(e){setError(e instanceof Error?e.message:'Erreur');}finally{setLoading(false)}};
 return <main style={{maxWidth:720,margin:'40px auto',padding:24,fontFamily:'system-ui'}}><h1>Connecter l’application mobile</h1><p>Générez un jeton temporaire depuis votre session Web authentifiée, puis collez-le une seule fois dans Flutter. Le jeton est signé côté serveur et expire automatiquement.</p><button onClick={generate} disabled={loading}>{loading?'Génération…':'Générer le jeton mobile'}</button>{error&&<p style={{color:'crimson'}}>{error}</p>}{token&&<section style={{marginTop:20}}><label>Jeton de connexion</label><textarea readOnly value={token} rows={6} style={{width:'100%',marginTop:8}}/><button onClick={()=>navigator.clipboard.writeText(token)}>Copier</button>{expiresAt&&<p>Expiration : {new Date(expiresAt).toLocaleString()}</p>}<p>Ne partagez pas ce jeton. Supprimez-le du presse-papiers après connexion.</p></section>}</main>;
}
