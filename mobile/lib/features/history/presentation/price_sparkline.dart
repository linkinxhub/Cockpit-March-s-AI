import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../data/history_repository.dart';
import '../data/ichimoku_history_repository.dart';

class PriceSparkline extends StatelessWidget {
  const PriceSparkline({super.key,required this.points,this.markers=const[],this.height=220});
  final List<HistoryPoint> points;
  final List<IchimokuSignalMarker> markers;
  final double height;

  @override
  Widget build(BuildContext context){
    if(points.length<2)return SizedBox(height:height,child:const Center(child:Text('Historique insuffisant')));
    return Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[
      SizedBox(width:double.infinity,height:height,child:CustomPaint(painter:_PricePainter(points:points,markers:markers,color:Theme.of(context).colorScheme.primary))),
      if(markers.isNotEmpty)Padding(padding:const EdgeInsets.only(top:8),child:Wrap(spacing:12,runSpacing:6,children:const[
        _LegendDot(label:'Achat historique',color:Colors.greenAccent),
        _LegendDot(label:'Vente historique',color:Colors.redAccent),
      ])),
    ]);
  }
}

class _LegendDot extends StatelessWidget{
  const _LegendDot({required this.label,required this.color});final String label;final Color color;
  @override Widget build(BuildContext context)=>Row(mainAxisSize:MainAxisSize.min,children:[Container(width:9,height:9,decoration:BoxDecoration(color:color,shape:BoxShape.circle)),const SizedBox(width:5),Text(label,style:Theme.of(context).textTheme.bodySmall)]);
}

class _PricePainter extends CustomPainter{
  const _PricePainter({required this.points,required this.markers,required this.color});
  final List<HistoryPoint> points;
  final List<IchimokuSignalMarker> markers;
  final Color color;

  @override
  void paint(Canvas canvas,Size size){
    final prices=points.map((e)=>e.price).where((v)=>v.isFinite&&v>0).toList(growable:false);
    if(prices.length<2)return;
    final minPrice=prices.reduce(math.min),maxPrice=prices.reduce(math.max),range=(maxPrice-minPrice).abs()<1e-12?1.0:maxPrice-minPrice;
    final minT=points.first.t,maxT=points.last.t,timeRange=math.max(1,maxT-minT);
    final grid=Paint()..color=color.withValues(alpha:.10)..strokeWidth=1;
    for(var i=1;i<4;i++){final y=size.height*i/4;canvas.drawLine(Offset(0,y),Offset(size.width,y),grid);}
    final path=Path();
    for(var i=0;i<points.length;i++){
      final x=points.length==1?0.0:size.width*i/(points.length-1),y=size.height-((points[i].price-minPrice)/range)*size.height;
      if(i==0)path.moveTo(x,y);else path.lineTo(x,y);
    }
    canvas.drawPath(path,Paint()..color=color..strokeWidth=2..style=PaintingStyle.stroke..strokeCap=StrokeCap.round..strokeJoin=StrokeJoin.round);

    for(final marker in markers){
      if(marker.t<minT||marker.t>maxT||!marker.price.isFinite)continue;
      final x=size.width*(marker.t-minT)/timeRange,y=size.height-((marker.price-minPrice)/range)*size.height;
      final buy=marker.action=='ACHETER',paint=Paint()..color=buy?Colors.greenAccent:Colors.redAccent;
      canvas.drawCircle(Offset(x,y),5.5,paint);
      final stem=Paint()..color=paint.color.withValues(alpha:.7)..strokeWidth=1.5;
      canvas.drawLine(Offset(x,y),Offset(x,buy?math.min(size.height,y+18):math.max(0,y-18)),stem);
    }
  }

  @override
  bool shouldRepaint(covariant _PricePainter oldDelegate)=>oldDelegate.points!=points||oldDelegate.markers!=markers||oldDelegate.color!=color;
}
