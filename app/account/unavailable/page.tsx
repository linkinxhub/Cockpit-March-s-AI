import{accountCopy}from'@/lib/account-copy';
export default function AccountUnavailablePage(){const copy=accountCopy('fr');return <main className="accountShell"><section className="accountPanel"><h1>{copy.unavailableTitle}</h1><p>{copy.unavailableText}</p><a className="accountButton" href="/">{copy.back}</a></section></main>}
