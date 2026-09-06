import { chatGPTSignInPath, safeRelativeReturnPath } from '../chatgpt-auth';

export const metadata = { title: 'Connexion interrompue · Cockpit Marchés AI', robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  provider_unavailable: 'Le service de connexion n’a pas pu récupérer votre profil. Si le problème persiste, la connexion du fournisseur doit être vérifiée par l’administrateur.',
  session_expired: 'La tentative de connexion a expiré ou a déjà été utilisée. Recommencez pour ouvrir une nouvelle session.',
  access_denied: 'La connexion n’a pas été autorisée. Vous pouvez recommencer si vous souhaitez accéder à votre compte.',
  connection_failed: 'Votre connexion n’a pas pu aboutir. Vous pouvez réessayer ou revenir au cockpit.',
};

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const reason = typeof params.reason === 'string' && Object.hasOwn(messages, params.reason) ? params.reason : 'connection_failed';
  const returnTo = safeRelativeReturnPath(typeof params.returnTo === 'string' ? params.returnTo : '/');
  return <main className="authShell"><section aria-labelledby="auth-error-title">
    <h1 id="auth-error-title">Connexion interrompue</h1>
    <p>{messages[reason]}</p>
    <p><a href={chatGPTSignInPath(returnTo)}>Réessayer la connexion</a></p>
    <p><a href="/">Retour au cockpit</a></p>
  </section></main>;
}
