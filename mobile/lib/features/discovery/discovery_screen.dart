import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../theme/cockpit_theme.dart';

/// Native presentation; assets match the web landing page.
class DiscoveryScreen extends StatefulWidget {
  const DiscoveryScreen({super.key, required this.onOpen});
  final VoidCallback onOpen;
  @override State<DiscoveryScreen> createState() => _DiscoveryScreenState();
}
class _DiscoveryScreenState extends State<DiscoveryScreen> with SingleTickerProviderStateMixin {
  late final AnimationController motion = AnimationController(vsync: this, duration: const Duration(seconds: 32));
  bool paused = false;
  int language = 0;
  static const copy = [
    ['Comprendre avant d’agir', 'Un regard clair sur les marchés.', 'Explorez les actifs, comparez les indicateurs et gardez vos décisions en perspective.', 'Ouvrir le cockpit', 'Vue d’ensemble', 'Exemple illustratif', 'Acheter', 'Vendre', 'Attendre', 'Illustration pédagogique · aucun cours réel ni signal actuel.', 'Des repères pour votre analyse', 'Marchés, indicateurs et journal réunis dans un même espace.', 'Pause des animations', 'Reprendre les animations'],
    ['Understand before acting', 'A clear view of the markets.', 'Explore assets, compare indicators and keep your decisions in perspective.', 'Open cockpit', 'Overview', 'Illustrative example', 'Buy', 'Sell', 'Wait', 'Educational illustration · no live prices or current signals.', 'Context for your analysis', 'Markets, indicators and journal in one place.', 'Pause animations', 'Resume animations'],
    ['Verstehen, bevor Sie handeln', 'Ein klarer Blick auf die Märkte.', 'Entdecken Sie Werte, vergleichen Sie Indikatoren und ordnen Sie Entscheidungen ein.', 'Cockpit öffnen', 'Übersicht', 'Illustratives Beispiel', 'Kaufen', 'Verkaufen', 'Abwarten', 'Lernbeispiel · keine Live-Kurse oder aktuellen Signale.', 'Orientierung für Ihre Analyse', 'Märkte, Indikatoren und Journal an einem Ort.', 'Animationen pausieren', 'Animationen fortsetzen'],
    ['Begrijpen voordat u handelt', 'Een helder beeld van de markten.', 'Verken activa, vergelijk indicatoren en plaats uw beslissingen in perspectief.', 'Cockpit openen', 'Overzicht', 'Illustratief voorbeeld', 'Kopen', 'Verkopen', 'Wachten', 'Educatieve illustratie · geen livekoersen of actuele signalen.', 'Context voor uw analyse', 'Markten, indicatoren en dagboek op één plek.', 'Animaties pauzeren', 'Animaties hervatten'],
  ];
  @override void didChangeDependencies() {super.didChangeDependencies(); syncMotion();}
  void syncMotion() {if(paused || MediaQuery.disableAnimationsOf(context)){motion.stop();}else{motion.repeat();}}
  @override void dispose(){motion.dispose();super.dispose();}
  @override Widget build(BuildContext context) {
    final t = copy[language];
    return Scaffold(body: Stack(children: [
      Positioned.fill(child: AnimatedBuilder(animation: motion, builder: (_, child) => Transform.translate(offset: Offset(math.sin(motion.value * math.pi * 2) * 8, math.cos(motion.value * math.pi * 2) * 5), child: Transform.scale(scale:1.08, child:child)), child:Image.asset('assets/markets-global.webp',fit:BoxFit.cover))),
      const Positioned.fill(child:DecoratedBox(decoration:BoxDecoration(gradient:LinearGradient(begin:Alignment.topCenter,end:Alignment.bottomCenter,colors:[Color(0x880A131C),Color(0xF50A131C)])))),
      SafeArea(child:ListView(padding:const EdgeInsets.all(22),children:[
        const Text('COCKPIT MARCHÉS AI',style:TextStyle(letterSpacing:2,fontWeight:FontWeight.w700)),
        const SizedBox(height:20),
        Wrap(spacing:6,runSpacing:6,children:List.generate(4,(i)=>ChoiceChip(label:Text(['FR','EN','DE','NL'][i]),selected:i==language,onSelected:(_)=>setState(()=>language=i)))),
        const SizedBox(height:30),Text(t[0],style:const TextStyle(color:CockpitTheme.accent)),
        const SizedBox(height:12),Text(t[1],style:const TextStyle(fontSize:36,height:1.12,fontWeight:FontWeight.w700)),
        const SizedBox(height:16),Text(t[2],style:const TextStyle(fontSize:16,height:1.6,color:Color(0xFFB1C0CD))),
        const SizedBox(height:24),FilledButton(onPressed:widget.onOpen,child:Text(t[3])),
        const SizedBox(height:30),Container(padding:const EdgeInsets.all(20),decoration:BoxDecoration(color:const Color(0xE610232E),borderRadius:BorderRadius.circular(18),border:Border.all(color:const Color(0xFF304A59))),child:Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[
          Text(t[4],style:const TextStyle(fontWeight:FontWeight.w600,letterSpacing:1)),const SizedBox(height:8),Text(t[5],style:const TextStyle(color:CockpitTheme.accent,fontSize:12)),const SizedBox(height:20),
          const SizedBox(height:180,child:CustomPaint(painter:_IllustrationPainter())),const SizedBox(height:16),
          Wrap(spacing:8,children:[Chip(label:Text(t[6]),side:const BorderSide(color:CockpitTheme.accent)),Chip(label:Text(t[7]),side:const BorderSide(color:Color(0xFFD38E71))),Chip(label:Text(t[8]),side:const BorderSide(color:Color(0xFFD4B46D)))]),const SizedBox(height:12),Text(t[0],style:const TextStyle(fontWeight:FontWeight.bold)),const SizedBox(height:12),Text(t[9],style:const TextStyle(fontSize:12,color:Color(0xFFB1C0CD))),
        ])),
        const SizedBox(height:28),ClipRRect(borderRadius:BorderRadius.circular(18),child:Stack(children:[Image.asset('assets/markets-city.webp',height:190,width:double.infinity,fit:BoxFit.cover),Positioned.fill(child:Container(color:const Color(0x990A131C))),Padding(padding:const EdgeInsets.all(24),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(t[10],style:const TextStyle(fontSize:22,fontWeight:FontWeight.bold)),const SizedBox(height:14),Text(t[11],style:const TextStyle(height:1.5))]))])),
        const SizedBox(height:16),TextButton.icon(onPressed:(){setState(()=>paused=!paused);syncMotion();},icon:Icon(paused?Icons.play_arrow:Icons.pause),label:Text(t[paused?13:12])),
      ])),
    ]));
  }
}
class _IllustrationPainter extends CustomPainter {
 const _IllustrationPainter();
 @override void paint(Canvas canvas,Size size){
   final grid=Paint()..color=const Color(0xFF203644)..strokeWidth=1;
   for(var i=0;i<6;i++){final y=size.height*i/5;canvas.drawLine(Offset(0,y),Offset(size.width,y),grid);}
   for(var i=0;i<9;i++){final x=size.width*i/8;canvas.drawLine(Offset(x,0),Offset(x,size.height),grid);}
   const values=[.85,.78,.83,.64,.68,.52,.6,.42,.49,.31,.43,.22,.29,.17,.26,.14];
   final path=Path();for(var i=0;i<values.length;i++){final x=size.width*.69*i/(values.length-1),y=size.height*values[i];if(i==0){path.moveTo(x,y);}else{path.lineTo(x,y);}}
   canvas.drawPath(path,Paint()..color=CockpitTheme.accent..strokeWidth=2.5..style=PaintingStyle.stroke);
   for(final end in [.03,.25,.73]){final start=Offset(size.width*.69,size.height*.14),finish=Offset(size.width,size.height*end);final p=Paint()..color=(end<.1?CockpitTheme.accent:end>.5?const Color(0xFFD38E71):const Color(0xFFB1C0CD))..strokeWidth=1.5;for(var i=0;i<14;i+=2){canvas.drawLine(Offset.lerp(start,finish,i/14)!,Offset.lerp(start,finish,(i+1)/14)!,p);}}
 }
 @override bool shouldRepaint(covariant _IllustrationPainter oldDelegate)=>false;
}
