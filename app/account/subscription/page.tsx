import Link from'next/link';
import{accountCopy}from'@/lib/account-copy';
import{ensureAccount}from'@/lib/account-store';
import{getSharedUserIdentity}from'@/lib/user-identity';
import{redirect}from'next/navigation';
export const dynamic='force-dynamic';
export default async function SubscriptionPage(){const identity=await getSharedUserIdentity();if(!identity)redirect('/signin-with-chatgpt?return_to=%2Faccount%2Fsubscription');const account=await ensureAccount(identity),copy=accountCopy(account.locale);return <main className="accountShell"><Link href="/account">← {copy.account}</Link><section className="accountPanel"><h1>{copy.subscription}</h1><p>{copy.manageSubscription}</p><dl className="membershipFacts"><div><dt>{copy.plan}</dt><dd>{account.plan}</dd></div><div><dt>{copy.status}</dt><dd>{account.subscriptionStatus}</dd></div><div><dt>{copy.role}</dt><dd>{account.role}</dd></div></dl><Link className="accountButton" href="/pricing">{copy.offers}</Link><p className="accountSecure">{copy.secure}</p></section></main>}
