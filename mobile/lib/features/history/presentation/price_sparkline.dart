import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../data/history_repository.dart';

class PriceSparkline extends StatelessWidget {
  const PriceSparkline({super.key,required this.points,this.height=190});
  final List<HistoryPoint> points;
  final double height;

  @override
  Widget build(BuildContext context){
    if(points.length<2)return SizedBox(height:height,child:const Center(child:Text('Historique insuffisant')));
    return SizedBox(width:double.infinity,height:height,child:CustomPaint(painter:_PricePainter(points:points,color:Theme.of(context).colorScheme.primary)));
  }
}

class _PricePainter extends CustomPainter{
  const _PricePainter({required this.points,required this.color});
  final List<HistoryPoint> points;
  final Color color;

  @override
  void paint(Canvas canvas,Size size){
    final prices=points.map((e)=>e.price).where((v)=>v.isFinite&&v>0).toList(growable:false);
    if(prices.length<2)return;
    final minPrice=prices.reduce(math.min),maxPrice=prices.reduce(math.max),range=(maxPrice-minPrice).abs()<1e-12?1.0:maxPrice-minPrice;
    final grid=Paint()..color=color.withValues(alpha:.10)..strokeWidth=1;
    for(var i=1;i<4;i++){final y=size.height*i/4;canvas.drawLine(Offset(0,y),Offset(size.width,y),grid);}
    final path=Path();
    for(var i=0;i<points.length;i++){
      final x=points.length==1?0.0:size.width*i/(points.length-1),y=size.height-((points[i].price-minPrice)/range)*size.height;
      if(i==0)path.moveTo(x,y);else path.lineTo(x,y);
    }
    canvas.drawPath(path,Paint()..color=color..strokeWidth=2..style=PaintingStyle.stroke..strokeCap=StrokeCap.round..strokeJoin=StrokeJoin.round);
  }

  @override
  bool shouldRepaint(covariant _PricePainter oldDelegate)=>oldDelegate.points!=points||oldDelegate.color!=color;
}
