import 'package:flutter/material.dart';
import '../../markets/data/market_repository.dart';
import '../../sync/data/user_sync_repository.dart';

class WatchlistView extends StatefulWidget{
  const WatchlistView({super.key,required this.rows,required this.repository});
  final List<MarketRow> rows;
  final UserSyncRepository repository;
  @override State<WatchlistView> createState()=>_WatchlistViewState();
}

class _WatchlistViewState extends State<WatchlistView>{
  late Future<UserSyncSnapshot> future;
  Set<String> selected={};
  bool saving=false;
  String? error;

  @override void initState(){super.initState();future=widget.repository.snapshot();}
  Future<void> toggle(String key)async{
    final next={...selected};next.contains(key)?next.remove(key):next.add(key);
    setState((){selected=next;saving=true;error=null;});
    try{final saved=await widget.repository.setWatchlist(next.toList());if(mounted)setState(()=>selected=saved.toSet());}catch(e){if(mounted)setState(()=>error=e.toString());}finally{if(mounted)setState(()=>saving=false);}
  }

  @override Widget build(BuildContext context)=>FutureBuilder<UserSyncSnapshot>(future:future,builder:(context,s){
    if(s.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator());
    if(s.hasError)return Padding(padding:const EdgeInsets.all(20),child:Text('Watchlist synchronisée indisponible : ${s.error}\nLe store durable et la session mobile doivent être configurés.'));
    if(s.hasData&&selected.isEmpty)selected=s.data!.watchlist.toSet();
    return ListView(padding:const EdgeInsets.all(16),children:[Text('Watchlist synchronisée',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:6),const Text('Les favoris sont stockés côté serveur et partagés avec la WebApp.'),if(error!=null)Padding(padding:const EdgeInsets.only(top:10),child:Text(error!,style:TextStyle(color:Theme.of(context).colorScheme.error))),const SizedBox(height:12),...widget.rows.map((row)=>Card(child:ListTile(title:Text(row.symbol),subtitle:Text('${row.name} · ${row.kind}'),trailing:IconButton(onPressed:saving?null:()=>toggle(row.key),icon:Icon(selected.contains(row.key)?Icons.star:Icons.star_border)))))]);
  });
}
