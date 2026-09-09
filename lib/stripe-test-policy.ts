export const TEST_PRICES={pro:'price_1U9hfjPaqMcvZjThyHhCdmiO',expert:'price_1U9hfpPaqMcvZjThgzBA4ADB'} as const;
export function isTestKey(key:string){return /^(rk|sk)_test_[A-Za-z0-9]{12,}$/.test(key);}
export function isWebhookSecret(value:string){return /^whsec_[A-Za-z0-9]{12,}$/.test(value);}
export function validPrice(p:any,id:string,amount:number){return p.id===id&&p.livemode===false&&p.active===true&&p.currency==='eur'&&p.unit_amount===amount&&p.recurring?.interval==='month'&&p.recurring?.interval_count===1;}
