import{SignIn}from'@clerk/nextjs';import Link from'next/link';
export default function SignInPage(){if(!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)return <AuthUnavailable/>;return <main className="authShell"><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/account"/></main>}
function AuthUnavailable(){return <main className="authShell"><section><h1>Connexion temporairement indisponible</h1><p>Le fournisseur d’identité Vercel doit être configuré avant l’ouverture des comptes.</p><Link href="/">Retour au cockpit</Link></section></main>}
