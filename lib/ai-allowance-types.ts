export class AIQuotaError extends Error{constructor(public limit:number,public used:number,public resetAt:number){super('USAGE_LIMIT_REACHED');}}
