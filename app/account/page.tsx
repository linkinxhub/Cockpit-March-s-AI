import Link from'next/link';
import{chatGPTSignOutPath}from'@/app/chatgpt-auth';
import{accountCopy}from'@/lib/account-copy';
import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function AccountPage(){const{membership:account}=await requirePageMembership('/account');const copy=accountCopy(account.locale);return <main className="accountShell"><header><Link href="/">← {copy.back}</Link><a href={chatGPTSignOutPath('/')}>{copy.logout}</a></header><section className="accountHero"><div className="accountAvatar">{account.displayName.slice(0,1).toUpperCase()}</div><div><p>{copy.account}</p><h1>{account.displayName}</h1><span>{account.email}</span></div></section><section className="accountGrid"><Link className="accountCard" href="/account/profile"><h2>{copy.profile}</h2><p>{copy.manageProfile}</p></Link><Link className="accountCard" href="/account/subscription"><h2>{copy.subscription}</h2><p>{account.plan} · {account.subscriptionStatus}</p></Link></section><p className="accountSecure">{copy.secure}</p></main>}
