export function isRecentTimestamp(value: string | number | null | undefined, now: number, maxAgeMs: number) {
  const timestamp = typeof value === "number" ? value : Date.parse(value || "");
  return Number.isFinite(timestamp) && timestamp <= now + 60_000 && now - timestamp <= maxAgeMs;
}

export function isLiveContext(
  context: { connected?: boolean; asset?: string; updatedAt?: string } | null | undefined,
  symbol: string,
  now: number,
) {
  return Boolean(context?.connected && context.asset === symbol && isRecentTimestamp(context.updatedAt, now, 30 * 60_000));
}

export function quoteIsStale(kind: string, timestamp: number | null | undefined, now = Date.now()) {
  return !timestamp || !isRecentTimestamp(timestamp, now, (kind === "Crypto" ? 6 : 96) * 60 * 60_000);
}

export function includeActiveTimeframe<T extends { period: string }>(comparisons: T[], current: T) {
  return [...comparisons.filter((item) => item.period !== current.period), current];
}

export function analysisErrorMessage(code: string) {
  if (code === "SERVICE_UNAVAILABLE" || code === "OPENAI_NOT_CONFIGURED") return "L’analyse IA n’est pas encore activée sur ce site. Les indicateurs techniques restent disponibles.";
  if (code === "OPENAI_AUTH_ERROR") return "La connexion au service IA doit être rétablie par l’administrateur.";
  if (code === "AUTH_REQUIRED" || code === "authentication_required") return "Connectez-vous à votre compte pour utiliser l’analyse IA.";
  if (code === "PLAN_UPGRADE_REQUIRED" || code === "entitlement_required") return "L’analyse IA est incluse dans la formule Expert. Consultez votre compte.";
  if (code === "ACCOUNT_SUSPENDED" || code === "account_suspended") return "Votre compte est suspendu. Contactez l’administrateur.";
  if (code === "USAGE_LIMIT_REACHED") return "Votre quota mensuel d’analyses IA est atteint. Consultez votre abonnement.";
  if (code === "OPENAI_LIMIT" || code === "RATE_LIMITED") return "Limite temporaire atteinte. Réessayez dans une minute.";
  if (code === "OPENAI_TIMEOUT") return "L’analyse a pris trop de temps. Vous pouvez réessayer.";
  return "Le service d’analyse est momentanément indisponible. Les indicateurs techniques restent consultables.";
}
