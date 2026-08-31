import Link from'next/link';
import{accountCopy}from'@/lib/account-copy';
import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function SubscriptionPage(){const{membership:account}=await requirePageMembership('/account/subscription');const copy=accountCopy(account.locale);return <main className="accountShell"><Link href="/account">← {copy.account}</Link><section className="accountPanel"><h1>{copy.subscription}</h1><p>{copy.manageSubscription}</p><dl className="membershipFacts"><div><dt>{copy.plan}</dt><dd>{account.plan}</dd></div><div><dt>{copy.status}</dt><dd>{account.subscriptionStatus}</dd></div><div><dt>{copy.role}</dt><dd>{account.role}</dd></div></dl><Link className="accountButton" href="/pricing">{copy.offers}</Link><p className="accountSecure">{copy.secure}</p></section></main>}
