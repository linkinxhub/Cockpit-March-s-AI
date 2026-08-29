import type { IndicatorPoint } from './indicator-engine';

export type IchimokuHistoricalSignal={
  t:number;
  price:number;
  action:'ACHETER'|'VENDRE';
  confidence:number;
  reason:string;
};

type IchimokuBias='HAUSSIER'|'BAISSIER'|'MIXTE';

function midpoint(points:IndicatorPoint[],end:number,period:number){
  const window=points.slice(Math.max(0,end-period+1),end+1);
  const highs=window.map(p=>Number.isFinite(p.high)?Number(p.high):p.price);
  const lows=window.map(p=>Number.isFinite(p.low)?Number(p.low):p.price);
  return(Math.max(...highs)+Math.min(...lows))/2;
}

function stateAt(points:IndicatorPoint[],index:number):{bias:IchimokuBias;above:boolean;below:boolean;crossUp:boolean;crossDown:boolean;cloudUp:boolean;cloudDown:boolean}|null{
  if(index<51)return null;
  const point=points[index];if(!point)return null;
  const tenkan=midpoint(points,index,9),kijun=midpoint(points,index,26),spanB=midpoint(points,index,52),spanA=(tenkan+kijun)/2;
  const cloudTop=Math.max(spanA,spanB),cloudBottom=Math.min(spanA,spanB);
  const above=point.price>cloudTop,below=point.price<cloudBottom,crossUp=tenkan>kijun,crossDown=tenkan<kijun,cloudUp=spanA>spanB,cloudDown=spanA<spanB;
  const bias:IchimokuBias=above&&crossUp&&cloudUp?'HAUSSIER':below&&crossDown&&cloudDown?'BAISSIER':'MIXTE';
  return{bias,above,below,crossUp,crossDown,cloudUp,cloudDown};
}

export function buildIchimokuHistoricalSignals(points:IndicatorPoint[]){
  const signals:IchimokuHistoricalSignal[]=[];
  let previous:IchimokuBias='MIXTE';
  for(let i=51;i<points.length;i++){
    const point=points[i],state=stateAt(points,i);if(!point||!state)continue;
    if(state.bias==='HAUSSIER'&&previous!=='HAUSSIER'){
      signals.push({t:point.t,price:point.price,action:'ACHETER',confidence:82,reason:'Prix au-dessus du Kumo, Tenkan au-dessus de Kijun et nuage projeté haussier.'});
    }else if(state.bias==='BAISSIER'&&previous!=='BAISSIER'){
      signals.push({t:point.t,price:point.price,action:'VENDRE',confidence:82,reason:'Prix sous le Kumo, Tenkan sous Kijun et nuage projeté baissier.'});
    }
    previous=state.bias;
  }
  return signals;
}
