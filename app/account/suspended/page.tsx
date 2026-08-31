import{chatGPTSignOutPath}from'@/app/chatgpt-auth';
import{requirePageMembership}from'@/lib/access-control';
import{accountCopy}from'@/lib/account-copy';
export const dynamic='force-dynamic';
export default async function SuspendedPage(){const{membership}=await requirePageMembership('/account/suspended',{allowSuspended:true}),copy=accountCopy(membership.locale);return <main className="accountShell"><section className="accountPanel"><h1>{copy.suspendedTitle}</h1><p>{copy.suspendedText}</p><a className="accountButton" href={chatGPTSignOutPath('/')}>{copy.logout}</a></section></main>}
