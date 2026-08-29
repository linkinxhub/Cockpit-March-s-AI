export type IndexSession={venue:string;zone:string;ranges:[number,number][]};

export const indexSessions:Record<string,IndexSession>={
 SP500:{venue:'New York',zone:'America/New_York',ranges:[[570,960]]},NASDAQ100:{venue:'New York',zone:'America/New_York',ranges:[[570,960]]},DOWJONES:{venue:'New York',zone:'America/New_York',ranges:[[570,960]]},RUSSELL2000:{venue:'New York',zone:'America/New_York',ranges:[[570,960]]},
 DAX40:{venue:'Francfort',zone:'Europe/Berlin',ranges:[[540,1050]]},CAC40:{venue:'Paris',zone:'Europe/Paris',ranges:[[540,1050]]},STOXX50:{venue:'Europe',zone:'Europe/Paris',ranges:[[540,1050]]},STOXX600:{venue:'Europe',zone:'Europe/Paris',ranges:[[540,1050]]},
 FTSE100:{venue:'Londres',zone:'Europe/London',ranges:[[480,990]]},NIKKEI225:{venue:'Tokyo',zone:'Asia/Tokyo',ranges:[[540,690],[750,930]]},HANGSENG:{venue:'Hong Kong',zone:'Asia/Hong_Kong',ranges:[[570,720],[780,960]]},ASX200:{venue:'Sydney',zone:'Australia/Sydney',ranges:[[600,960]]},
 CSI300:{venue:'Shanghai',zone:'Asia/Shanghai',ranges:[[570,690],[780,900]]},SSECOMP:{venue:'Shanghai',zone:'Asia/Shanghai',ranges:[[570,690],[780,900]]},NIFTY50:{venue:'Mumbai',zone:'Asia/Kolkata',ranges:[[555,930]]},KOSPI:{venue:'Séoul',zone:'Asia/Seoul',ranges:[[540,930]]},
 AEX25:{venue:'Amsterdam',zone:'Europe/Amsterdam',ranges:[[540,1050]]},BEL20:{venue:'Bruxelles',zone:'Europe/Brussels',ranges:[[540,1050]]},SMI20:{venue:'Zurich',zone:'Europe/Zurich',ranges:[[540,1050]]},IBEX35:{venue:'Madrid',zone:'Europe/Madrid',ranges:[[540,1050]]},FTSEMIB:{venue:'Milan',zone:'Europe/Rome',ranges:[[540,1050]]},
 TSX60:{venue:'Toronto',zone:'America/Toronto',ranges:[[570,960]]},IBOVESPA:{venue:'São Paulo',zone:'America/Sao_Paulo',ranges:[[600,1020]]},OMX30:{venue:'Stockholm',zone:'Europe/Stockholm',ranges:[[540,1050]]},
};

export function indexMarketStatus(key:string,date=new Date()){
 const schedule=indexSessions[key];
 if(!schedule)return null;
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:schedule.zone,weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
 const value=(type:string)=>parts.find(part=>part.type===type)?.value||'';
 const weekday=value('weekday'),minutes=Number(value('hour'))*60+Number(value('minute'));
 const weekdayOpen=!['Sat','Sun'].includes(weekday),open=weekdayOpen&&schedule.ranges.some(([start,end])=>minutes>=start&&minutes<end);
 return{key,...schedule,open,localTime:`${value('hour')}:${value('minute')}`,weekday};
}
