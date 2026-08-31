import Link from'next/link';import{SignOutClient}from'./sign-out-client';
export default function SignOutPage(){if(!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)return <main className="authShell"><section><h1>Déconnexion</h1><p>Aucune session Clerk n’est active.</p><Link href="/">Retour au cockpit</Link></section></main>;return <SignOutClient/>}
