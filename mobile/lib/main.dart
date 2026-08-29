import 'package:flutter/material.dart';
import 'core/api/api_client.dart';
import 'features/markets/data/market_repository.dart';
import 'features/markets/data/market_status_repository.dart';
import 'features/indicators/data/indicator_repository.dart';
import 'features/history/data/history_repository.dart';

const apiBaseUrl = String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3000');

void main() => runApp(const CockpitMarketsApp());

class CockpitMarketsApp extends StatelessWidget {
  const CockpitMarketsApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner:false,
    title:'Cockpit Marchés AI',
    themeMode:ThemeMode.dark,
    darkTheme:ThemeData(brightness:Brightness.dark,useMaterial3:true),
    home:const MobileShell(),
  );
}

class MobileShell extends StatefulWidget {
  const MobileShell({super.key});
  @override State<MobileShell> createState()=>_MobileShellState();
}

class _MobileShellState extends State<MobileShell>{
  late final MarketRepository marketRepository;
  late final MarketStatusRepository statusRepository;
  late final IndicatorRepository indicatorRepository;
  late final HistoryRepository historyRepository;
  late Future<List<MarketRow>> markets;
  late Future<Map<String,MarketStatus>> statuses;
  int index=0;

  @override
  void initState(){super.initState();final api=ApiClient(baseUrl:apiBaseUrl);marketRepository=MarketRepository(api);statusRepository=MarketStatusRepository(api);indicatorRepository=IndicatorRepository(api);historyRepository=HistoryRepository(api);markets=marketRepository.fetchScanner();statuses=statusRepository.fetchAll();}
  Future<void> refresh() async{final nextMarkets=marketRepository.fetchScanner(),nextStatuses=statusRepository.fetchAll();setState((){markets=nextMarkets;statuses=nextStatuses;});await Future.wait([nextMarkets,nextStatuses]);}

  @override
  Widget build(BuildContext context){
    const titles=['Cockpit','Marchés','Indicateurs','Signaux'];
    return Scaffold(
      appBar:AppBar(title:Text('Cockpit Marchés AI · ${titles[index]}'),actions:[IconButton(onPressed:refresh,icon:const Icon(Icons.refresh))]),
      body:FutureBuilder<List<MarketRow>>(future:markets,builder:(context,marketSnap){
        if(marketSnap.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator());
        if(marketSnap.hasError)return Center(child:Padding(padding:const EdgeInsets.all(24),child:Text('API indisponible : ${marketSnap.error}')));
        final rows=marketSnap.data??const<MarketRow>[];
        return FutureBuilder<Map<String,MarketStatus>>(future:statuses,builder:(context,statusSnap){
          final map=statusSnap.data??const<String,MarketStatus>{};
          return switch(index){
            0=>CockpitView(rows:rows,onRefresh:refresh),
            1=>MarketsView(rows:rows,statuses:map,onRefresh:refresh,historyRepository:historyRepository,indicatorRepository:indicatorRepository),
            2=>IndicatorsView(rows:rows,repository:indicatorRepository),
            _=>SignalsView(rows:rows),
          };
        });
      }),
      bottomNavigationBar:NavigationBar(selectedIndex:index,onDestinationSelected:(v)=>setState(()=>index=v),destinations:const[
        NavigationDestination(icon:Icon(Icons.dashboard_outlined),selectedIcon:Icon(Icons.dashboard),label:'Cockpit'),
        NavigationDestination(icon:Icon(Icons.candlestick_chart_outlined),selectedIcon:Icon(Icons.candlestick_chart),label:'Marchés'),
        NavigationDestination(icon:Icon(Icons.monitor_heart_outlined),selectedIcon:Icon(Icons.monitor_heart),label:'Indicateurs'),
        NavigationDestination(icon:Icon(Icons.bolt_outlined),selectedIcon:Icon(Icons.bolt),label:'Signaux'),
      ]),
    );
  }
}

class CockpitView extends StatelessWidget{
  const CockpitView({super.key,required this.rows,required this.onRefresh});final List<MarketRow> rows;final Future<void>Function() onRefresh;
  @override Widget build(BuildContext context){final buy=rows.where((r)=>_tone(r.signal)=='buy').length,sell=rows.where((r)=>_tone(r.signal)=='sell').length;return RefreshIndicator(onRefresh:onRefresh,child:ListView(padding:const EdgeInsets.all(16),children:[Text('Vue d’ensemble',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:12),Wrap(spacing:10,runSpacing:10,children:[_Metric(label:'Actifs suivis',value:'${rows.length}'),_Metric(label:'Achats',value:'$buy'),_Metric(label:'Ventes',value:'$sell')]),const SizedBox(height:18),Text('Opportunités',style:Theme.of(context).textTheme.titleLarge),const SizedBox(height:8),...rows.take(8).map((r)=>_MarketTile(row:r))]));}
}

class MarketsView extends StatelessWidget{
  const MarketsView({super.key,required this.rows,required this.statuses,required this.onRefresh,required this.historyRepository,required this.indicatorRepository});
  final List<MarketRow> rows;final Map<String,MarketStatus> statuses;final Future<void>Function() onRefresh;final HistoryRepository historyRepository;final IndicatorRepository indicatorRepository;
  @override Widget build(BuildContext context)=>RefreshIndicator(onRefresh:onRefresh,child:ListView.separated(padding:const EdgeInsets.all(16),itemCount:rows.length,separatorBuilder:(_,__)=>const SizedBox(height:8),itemBuilder:(context,i){final row=rows[i],status=statuses[row.key];return Card(child:ListTile(onTap:()=>Navigator.of(context).push(MaterialPageRoute(builder:(_)=>AssetDetailScreen(row:row,status:status,historyRepository:historyRepository,indicatorRepository:indicatorRepository))),title:Text(row.symbol),subtitle:Text(status==null?'${row.name} · ${row.kind}':'${row.name} · ${row.kind}\n${status.venue} · ${status.localTime}'),isThreeLine:status!=null,trailing:Column(mainAxisAlignment:MainAxisAlignment.center,crossAxisAlignment:CrossAxisAlignment.end,children:[Text(_fmt(row.price)),Text(row.signal??'NEUTRE'),if(status!=null)Text(status.open?'OUVERT':'FERMÉ',style:TextStyle(fontWeight:FontWeight.bold,color:status.open?Colors.greenAccent:Colors.redAccent))])));}),);
}

class AssetDetailScreen extends StatefulWidget{
  const AssetDetailScreen({super.key,required this.row,required this.status,required this.historyRepository,required this.indicatorRepository});final MarketRow row;final MarketStatus? status;final HistoryRepository historyRepository;final IndicatorRepository indicatorRepository;
  @override State<AssetDetailScreen> createState()=>_AssetDetailScreenState();
}

class _AssetDetailScreenState extends State<AssetDetailScreen>{
  String period='1d';static const periods=['15m','1h','4h','1d','1w','1mo','6mo','1y'];late Future<HistoryBundle> history;late Future<List<TimeframeComparison>> comparisons;late Future<IndicatorCenter> indicators;
  @override void initState(){super.initState();_load();}
  void _load(){history=widget.historyRepository.fetchHistory(symbol:widget.row.key,period:period);comparisons=widget.historyRepository.fetchComparisons(widget.row.key);indicators=widget.indicatorRepository.fetch(symbol:widget.row.key,period:period);}
  void changePeriod(String value){setState((){period=value;_load();});}
  @override Widget build(BuildContext context)=>Scaffold(appBar:AppBar(title:Text(widget.row.symbol)),body:ListView(padding:const EdgeInsets.all(16),children:[
    Card(child:ListTile(title:Text(widget.row.name),subtitle:Text(widget.status==null?widget.row.kind:'${widget.row.kind} · ${widget.status!.venue} · ${widget.status!.localTime}'),trailing:widget.status==null?null:Text(widget.status!.open?'OUVERT':'FERMÉ',style:TextStyle(fontWeight:FontWeight.bold,color:widget.status!.open?Colors.greenAccent:Colors.redAccent)))),
    const SizedBox(height:10),DropdownButtonFormField<String>(value:period,items:periods.map((p)=>DropdownMenuItem(value:p,child:Text(p))).toList(),onChanged:(v){if(v!=null)changePeriod(v);},decoration:const InputDecoration(labelText:'Période')),
    const SizedBox(height:16),FutureBuilder<HistoryBundle>(future:history,builder:(context,s){if(s.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator());if(s.hasError)return Text('Historique indisponible : ${s.error}');final data=s.data;if(data==null)return const SizedBox.shrink();final analysis=data.analysis;return Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Text('Historique ${data.period}',style:Theme.of(context).textTheme.titleLarge),const SizedBox(height:8),Card(child:Padding(padding:const EdgeInsets.all(16),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text('Points reçus : ${data.points.length}'),Text('Décision : ${analysis['decision']??'—'}'),Text('Confiance : ${analysis['confidence']??'—'}'),Text('RSI : ${analysis['rsi']??'—'}'),Text('Risque : ${analysis['risk']??'—'}')])))]);}),
    const SizedBox(height:16),FutureBuilder<IndicatorCenter>(future:indicators,builder:(context,s){if(!s.hasData)return const SizedBox.shrink();final d=s.data!;return Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Text('Consensus technique',style:Theme.of(context).textTheme.titleLarge),Card(child:ListTile(title:Text(d.consensus),subtitle:Text('${d.symbol} · ${d.period}'))),...d.items.take(4).map((item)=>_IndicatorCard(name:item.name,value:'${item.value}\n${item.reading}',decision:item.decision,highlighted:item.name.contains('Ichimoku'),explanation:item.explanation))]);}),
    const SizedBox(height:16),FutureBuilder<List<TimeframeComparison>>(future:comparisons,builder:(context,s){if(!s.hasData)return const SizedBox.shrink();return Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Text('Multi-timeframes',style:Theme.of(context).textTheme.titleLarge),...s.data!.map((c)=>Card(child:ListTile(title:Text(c.period),subtitle:Text('RSI ${_fmt(c.rsi)} · Risque ${c.risk}'),trailing:Text('${c.decision}\n${c.confidence?.toStringAsFixed(0)??'—'}%',textAlign:TextAlign.right))))]);}),
  ]));
}

class IndicatorsView extends StatefulWidget{const IndicatorsView({super.key,required this.rows,required this.repository});final List<MarketRow> rows;final IndicatorRepository repository;@override State<IndicatorsView> createState()=>_IndicatorsViewState();}
class _IndicatorsViewState extends State<IndicatorsView>{String? symbol;String period='1d';Future<IndicatorCenter>? center;static const periods=['15m','1h','4h','1d','1w','1mo','6mo','1y'];@override void didChangeDependencies(){super.didChangeDependencies();if(widget.rows.isNotEmpty&&symbol==null){symbol=widget.rows.first.key;center=widget.repository.fetch(symbol:symbol!,period:period);}}void load(){if(symbol==null)return;setState(()=>center=widget.repository.fetch(symbol:symbol!,period:period));}@override Widget build(BuildContext context){if(widget.rows.isEmpty)return const Center(child:Text('Aucun actif disponible'));return ListView(padding:const EdgeInsets.all(16),children:[Text('Centre des indicateurs',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:8),Row(children:[Expanded(child:DropdownButtonFormField<String>(value:symbol,items:widget.rows.map((r)=>DropdownMenuItem(value:r.key,child:Text(r.symbol))).toList(),onChanged:(v){symbol=v;load();},decoration:const InputDecoration(labelText:'Actif'))),const SizedBox(width:10),SizedBox(width:110,child:DropdownButtonFormField<String>(value:period,items:periods.map((p)=>DropdownMenuItem(value:p,child:Text(p))).toList(),onChanged:(v){if(v!=null){period=v;load();}},decoration:const InputDecoration(labelText:'Période')))]),const SizedBox(height:16),FutureBuilder<IndicatorCenter>(future:center,builder:(context,snapshot){if(snapshot.connectionState==ConnectionState.waiting)return const Padding(padding:EdgeInsets.all(24),child:Center(child:CircularProgressIndicator()));if(snapshot.hasError)return Card(child:Padding(padding:const EdgeInsets.all(16),child:Text('Indicateurs indisponibles : ${snapshot.error}')));final data=snapshot.data;if(data==null)return const SizedBox.shrink();return Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[Card(child:ListTile(title:const Text('Consensus technique'),subtitle:Text('${data.symbol} · ${data.period}'),trailing:Text(data.consensus,style:const TextStyle(fontWeight:FontWeight.bold)))),const SizedBox(height:8),...data.items.map((item)=>_IndicatorCard(name:item.name,value:'${item.value}\n${item.reading}',decision:item.decision,highlighted:item.name.contains('Ichimoku'),explanation:item.explanation))]);})]);}}

class SignalsView extends StatelessWidget{const SignalsView({super.key,required this.rows});final List<MarketRow> rows;@override Widget build(BuildContext context){final signaled=rows.where((r)=>r.signal!=null).toList();return ListView(padding:const EdgeInsets.all(16),children:[Text('Signaux AI',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:12),...signaled.map((r)=>_MarketTile(row:r))]);}}
class _Metric extends StatelessWidget{const _Metric({required this.label,required this.value});final String label,value;@override Widget build(BuildContext context)=>Card(child:Padding(padding:const EdgeInsets.all(16),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text(label),const SizedBox(height:4),Text(value,style:Theme.of(context).textTheme.headlineSmall)])));}
class _MarketTile extends StatelessWidget{const _MarketTile({required this.row});final MarketRow row;@override Widget build(BuildContext context)=>Card(child:ListTile(title:Text(row.symbol),subtitle:Text('${row.name} · ${row.kind}'),trailing:Column(mainAxisAlignment:MainAxisAlignment.center,crossAxisAlignment:CrossAxisAlignment.end,children:[Text(_fmt(row.price)),Text(row.signal??'NEUTRE')])));}
class _IndicatorCard extends StatelessWidget{const _IndicatorCard({required this.name,required this.value,required this.decision,this.highlighted=false,this.explanation=''});final String name,value,decision,explanation;final bool highlighted;@override Widget build(BuildContext context)=>Card(child:ListTile(leading:Icon(highlighted?Icons.auto_awesome:Icons.analytics_outlined),title:Text(name,style:highlighted?const TextStyle(fontWeight:FontWeight.bold):null),subtitle:Text(explanation.isEmpty?value:'$value\n$explanation'),isThreeLine:explanation.isNotEmpty,trailing:Text(decision)));}
String _fmt(double? value)=>value==null?'—':value.toStringAsFixed(4);String _tone(String? signal){final s=(signal??'').toUpperCase();if(s.contains('ACH')||s.contains('BUY'))return'buy';if(s.contains('VEN')||s.contains('SELL'))return'sell';return'wait';}
