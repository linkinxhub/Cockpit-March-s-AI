import Link from'next/link';
import{requirePageMembership}from'@/lib/access-control';
import{accountCopy}from'@/lib/account-copy';
import{ProfileForm}from'./profile-form';
export const dynamic='force-dynamic';
export default async function ProfilePage(){const{membership:account}=await requirePageMembership('/account/profile');const copy=accountCopy(account.locale);return <main className="accountShell"><Link href="/account">← {copy.account}</Link><section className="accountPanel"><h1>{copy.profile}</h1><p>{copy.manageProfile}</p><ProfileForm account={account} copy={copy}/></section></main>}
