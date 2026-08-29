import type { IndicatorPoint } from './indicator-engine';

export type IchimokuHistoricalSignal={
  t:number;
  price:number;
  action:'ACHETER'|'VENDRE';
  confidence:number;
  reason:string;
};

function midpoint(points:IndicatorPoint[],end:number,period:number){
  const window=points.slice(Math.max(0,end-period+1),end+1);
  const highs=window.map(p=>Number.isFinite(p.high)?Number(p.high):p.price);
  const lows=window.map(p=>Number.isFinite(p.low)?Number(p.low):p.price);
  return(Math.max(...highs)+Math.min(...lows))/2;
}

function stateAt(points:IndicatorPoint[],index:number){
  if(index<51)return null;
  const point=points[index],tenkan=midpoint(points,index,9),kijun=midpoint(points,index,26),spanB=midpoint(points,index,52),spanA=(tenkan+kijun)/2;
  const cloudTop=Math.max(spanA,spanB),cloudBottom=Math.min(spanA,spanB);
  const above=point.price>cloudTop,below=point.price<cloudBottom,crossUp=tenkan>kijun,crossDown=tenkan<kijun,cloudUp=spanA>spanB,cloudDown=spanA<spanB;
  const bias=above&&crossUp&&cloudUp?'HAUSSIER':below&&crossDown&&cloudDown?'BAISSIER':'MIXTE';
  return{bias,above,below,crossUp,crossDown,cloudUp,cloudDown};
}

export function buildIchimokuHistoricalSignals(points:IndicatorPoint[]){
  const signals:IchimokuHistoricalSignal[]=[];
  let previous:'HAUSSIER'|'BAISSIER'|'MIXTE'='MIXTE';
  for(let i=51;i<points.length;i++){
    const state=stateAt(points,i);if(!state)continue;
    if(state.bias==='HAUSSIER'&&previous!=='HAUSSIER'){
      signals.push({t:points[i].t,price:points[i].price,action:'ACHETER',confidence:82,reason:'Prix au-dessus du Kumo, Tenkan au-dessus de Kijun et nuage projeté haussier.'});
    }else if(state.bias==='BAISSIER'&&previous!=='BAISSIER'){
      signals.push({t:points[i].t,price:points[i].price,action:'VENDRE',confidence:82,reason:'Prix sous le Kumo, Tenkan sous Kijun et nuage projeté baissier.'});
    }
    previous=state.bias;
  }
  return signals;
}
