import Link from'next/link';
import{ensureAccount}from'@/lib/account-store';
import{accountCopy}from'@/lib/account-copy';
import{getSharedUserIdentity}from'@/lib/user-identity';
import{redirect}from'next/navigation';
import{ProfileForm}from'./profile-form';
export const dynamic='force-dynamic';
export default async function ProfilePage(){const identity=await getSharedUserIdentity();if(!identity)redirect('/signin-with-chatgpt?return_to=%2Faccount%2Fprofile');const account=await ensureAccount(identity),copy=accountCopy(account.locale);return <main className="accountShell"><Link href="/account">← {copy.account}</Link><section className="accountPanel"><h1>{copy.profile}</h1><p>{copy.manageProfile}</p><ProfileForm account={account} copy={copy}/></section></main>}
