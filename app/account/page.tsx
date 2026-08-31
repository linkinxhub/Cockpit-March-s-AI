import Link from'next/link';
import{chatGPTSignOutPath}from'@/app/chatgpt-auth';
import{accountCopy}from'@/lib/account-copy';
import{ensureAccount}from'@/lib/account-store';
import{getSharedUserIdentity}from'@/lib/user-identity';
import{redirect}from'next/navigation';
export const dynamic='force-dynamic';
export default async function AccountPage(){const identity=await getSharedUserIdentity();if(!identity)redirect('/signin-with-chatgpt?return_to=%2Faccount');const account=await ensureAccount(identity),copy=accountCopy(account.locale);return <main className="accountShell"><header><Link href="/">← {copy.back}</Link><a href={chatGPTSignOutPath('/')}>{copy.logout}</a></header><section className="accountHero"><div className="accountAvatar">{account.displayName.slice(0,1).toUpperCase()}</div><div><p>{copy.account}</p><h1>{account.displayName}</h1><span>{account.email}</span></div></section><section className="accountGrid"><Link className="accountCard" href="/account/profile"><h2>{copy.profile}</h2><p>{copy.manageProfile}</p></Link><Link className="accountCard" href="/account/subscription"><h2>{copy.subscription}</h2><p>{account.plan} · {account.subscriptionStatus}</p></Link></section><p className="accountSecure">{copy.secure}</p></main>}
