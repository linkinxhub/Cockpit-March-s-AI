export const BASIC_INDICATORS=['EMA 20 / EMA 50','RSI 14','Supports / Résistances'];
export const DISCOVERY_PERIODS=['1h','1d','1w'];
// A stable, diversified selection. Price movements never change pack access.
export function discoveryAssets<T extends {kind:string}>(assets:readonly T[]):T[]{
 const allocation:[string,number][]=[['Crypto',3],['Indices',3],['Forex',3],['Métaux',2],['Baromètres',1]];
 return allocation.flatMap(([kind,count])=>assets.filter(a=>a.kind===kind).slice(0,count));
}
