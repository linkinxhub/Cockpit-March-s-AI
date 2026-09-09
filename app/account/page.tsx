import AccountDetails from '@/components/account-details';
import AIAllowance from '@/components/ai-allowance';
import {billingPublicStatus} from '@/lib/plan-billing-config';
import {getBillingAccount} from '@/lib/plan-billing-store';
import Link from'next/link';
import{chatGPTSignOutPath}from'@/app/chatgpt-auth';
import{accountCopy}from'@/lib/account-copy';
import{requirePageMembership}from'@/lib/access-control';
export const dynamic='force-dynamic';
export default async function AccountPage(){const{membership:account}=await requirePageMembership('/account');const copy=accountCopy(account.locale);const [billing,b]=await Promise.all([billingPublicStatus(),getBillingAccount()]);return <main className="accountShell"><header><Link href="/">← {copy.back}</Link><a href={chatGPTSignOutPath('/')}>{copy.logout}</a></header><AccountDetails email={account.email} displayName={account.displayName} plan={account.plan} status={account.subscriptionStatus} portalAvailable={billing.ready&&!!b?.customerId} periodEnd={account.currentPeriodEnd} cancelAtEnd={account.cancelAtPeriodEnd}/><section className="member-quota"><AIAllowance/></section><p className="accountSecure">{copy.secure}</p></main>}
