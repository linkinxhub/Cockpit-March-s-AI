import 'package:flutter/material.dart';
import 'app_shell.dart';
import 'core/api/api_client.dart';
import 'features/history/data/history_repository.dart';
import 'features/history/data/ichimoku_history_repository.dart';
import 'features/indicators/data/indicator_repository.dart';
import 'features/markets/data/market_repository.dart';
import 'features/markets/data/market_status_repository.dart';

class CockpitMarketsDemoApp extends StatelessWidget {
  const CockpitMarketsDemoApp({super.key,required this.apiBaseUrl});
  final String apiBaseUrl;

  @override
  Widget build(BuildContext context)=>MaterialApp(
    debugShowCheckedModeBanner:false,
    title:'Cockpit Marchés AI · Démo',
    themeMode:ThemeMode.dark,
    darkTheme:ThemeData(brightness:Brightness.dark,useMaterial3:true),
    home:DemoMobileShell(apiBaseUrl:apiBaseUrl),
  );
}

class DemoMobileShell extends StatefulWidget {
  const DemoMobileShell({super.key,required this.apiBaseUrl});
  final String apiBaseUrl;
  @override
  State<DemoMobileShell> createState()=>_DemoMobileShellState();
}

class _DemoMobileShellState extends State<DemoMobileShell> {
  late final MarketRepository marketsRepo;
  late final MarketStatusRepository statusRepo;
  late final IndicatorRepository indicatorsRepo;
  late final HistoryRepository historyRepo;
  late final IchimokuHistoryRepository ichimokuRepo;
  late Future<List<MarketRow>> markets;
  late Future<Map<String,MarketStatus>> statuses;
  int index=0;

  @override
  void initState(){
    super.initState();
    final api=ApiClient(baseUrl:widget.apiBaseUrl);
    marketsRepo=MarketRepository(api);
    statusRepo=MarketStatusRepository(api);
    indicatorsRepo=IndicatorRepository(api);
    historyRepo=HistoryRepository(api);
    ichimokuRepo=IchimokuHistoryRepository(api);
    markets=marketsRepo.fetchScanner();
    statuses=statusRepo.fetchAll();
  }

  Future<void> refresh()async{
    final m=marketsRepo.fetchScanner(),s=statusRepo.fetchAll();
    setState((){markets=m;statuses=s;});
    await Future.wait([m,s]);
  }

  @override
  Widget build(BuildContext context){
    const titles=['Cockpit','Marchés','Indicateurs','Signaux'];
    return Scaffold(
      appBar:AppBar(
        title:Text('Cockpit Marchés AI · ${titles[index]}'),
        actions:[
          const Padding(padding:EdgeInsets.symmetric(horizontal:8),child:Center(child:Text('DÉMO',style:TextStyle(fontWeight:FontWeight.bold)))),
          IconButton(onPressed:refresh,icon:const Icon(Icons.refresh)),
        ],
      ),
      body:FutureBuilder<List<MarketRow>>(
        future:markets,
        builder:(context,ms){
          if(ms.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator());
          if(ms.hasError)return Center(child:Padding(padding:const EdgeInsets.all(24),child:Text('API indisponible : ${ms.error}')));
          final rows=ms.data??const<MarketRow>[];
          return FutureBuilder<Map<String,MarketStatus>>(
            future:statuses,
            builder:(context,ss){
              final statusMap=ss.data??const<String,MarketStatus>{};
              return switch(index){
                0=>CockpitView(rows:rows,onRefresh:refresh),
                1=>MarketsView(rows:rows,statuses:statusMap,onRefresh:refresh,historyRepo:historyRepo,indicatorRepo:indicatorsRepo,ichimokuRepo:ichimokuRepo),
                2=>IndicatorsView(rows:rows,repository:indicatorsRepo),
                _=>SignalsView(rows:rows),
              };
            },
          );
        },
      ),
      bottomNavigationBar:NavigationBar(
        selectedIndex:index,
        onDestinationSelected:(value)=>setState(()=>index=value),
        destinations:const[
          NavigationDestination(icon:Icon(Icons.dashboard_outlined),label:'Cockpit'),
          NavigationDestination(icon:Icon(Icons.candlestick_chart_outlined),label:'Marchés'),
          NavigationDestination(icon:Icon(Icons.monitor_heart_outlined),label:'Indicateurs'),
          NavigationDestination(icon:Icon(Icons.bolt_outlined),label:'Signaux'),
        ],
      ),
    );
  }
}
