import 'package:flutter/material.dart';
import '../../markets/data/market_repository.dart';
import '../../sync/data/user_sync_repository.dart';

class PaperTradingView extends StatefulWidget{
  const PaperTradingView({super.key,required this.rows,required this.repository});
  final List<MarketRow> rows;final UserSyncRepository repository;
  @override State<PaperTradingView> createState()=>_PaperTradingViewState();
}

class _PaperTradingViewState extends State<PaperTradingView>{
  late Future<List<PaperTrade>> future;
  late Future<List<DecisionNote>> notesFuture;
  String? assetKey;
  String side='BUY';
  final quantity=TextEditingController(text:'1'),price=TextEditingController(),tradeNote=TextEditingController(),decisionNote=TextEditingController();
  bool saving=false,savingDecisionNote=false;
  String? error,decisionNoteError;

  @override void initState(){
    super.initState();
    assetKey=widget.rows.isEmpty?null:widget.rows.first.key;
    future=widget.repository.paperTrades();
    notesFuture=widget.repository.decisionNotes();
  }
  @override void dispose(){quantity.dispose();price.dispose();tradeNote.dispose();decisionNote.dispose();super.dispose();}
  void reload()=>setState(()=>future=widget.repository.paperTrades());
  void reloadNotes()=>setState(()=>notesFuture=widget.repository.decisionNotes());

  Future<void> create()async{
    if(assetKey==null)return;
    setState((){saving=true;error=null;});
    try{
      await widget.repository.createPaperTrade(assetKey:assetKey!,side:side,quantity:quantity.text,entryPrice:price.text,note:tradeNote.text.trim().isEmpty?null:tradeNote.text.trim());
      tradeNote.clear();reload();
    }catch(e){if(mounted)setState(()=>error=e.toString());}
    finally{if(mounted)setState(()=>saving=false);}
  }

  Future<void> createDecisionNote()async{
    final text=decisionNote.text.trim();
    if(text.isEmpty)return;
    setState((){savingDecisionNote=true;decisionNoteError=null;});
    try{
      await widget.repository.createDecisionNote(assetKey:assetKey,text:text);
      decisionNote.clear();reloadNotes();
    }catch(e){if(mounted)setState(()=>decisionNoteError=e.toString());}
    finally{if(mounted)setState(()=>savingDecisionNote=false);}
  }

  Future<void> closeTrade(PaperTrade trade)async{
    final controller=TextEditingController();
    final value=await showDialog<String>(context:context,builder:(context)=>AlertDialog(title:Text('Clôturer ${trade.assetKey}'),content:TextField(controller:controller,keyboardType:const TextInputType.numberWithOptions(decimal:true),decoration:const InputDecoration(labelText:'Prix de sortie')),actions:[TextButton(onPressed:()=>Navigator.pop(context),child:const Text('Annuler')),FilledButton(onPressed:()=>Navigator.pop(context,controller.text),child:const Text('Clôturer'))]));
    controller.dispose();
    if(value==null||value.trim().isEmpty)return;
    try{await widget.repository.closePaperTrade(trade.id,value.trim());reload();}catch(e){if(mounted)ScaffoldMessenger.of(context).showSnackBar(SnackBar(content:Text('$e')));}
  }
  Future<void> remove(PaperTrade trade)async{try{await widget.repository.deletePaperTrade(trade.id);reload();}catch(e){if(mounted)ScaffoldMessenger.of(context).showSnackBar(SnackBar(content:Text('$e')));}}
  Future<void> removeDecisionNote(DecisionNote note)async{try{await widget.repository.deleteDecisionNote(note.id);reloadNotes();}catch(e){if(mounted)ScaffoldMessenger.of(context).showSnackBar(SnackBar(content:Text('$e')));}}

  @override Widget build(BuildContext context)=>ListView(
    padding:const EdgeInsets.all(16),
    children:[
      Text('Paper Trading & Journal',style:Theme.of(context).textTheme.headlineSmall),
      const SizedBox(height:6),
      const Text('Simulation uniquement : aucun ordre réel n’est exécuté. Les notes de décision sont enregistrées séparément dans votre compte.'),
      const SizedBox(height:14),
      Card(child:Padding(padding:const EdgeInsets.all(14),child:Column(children:[
        DropdownButtonFormField<String>(initialValue:assetKey,decoration:const InputDecoration(labelText:'Actif'),items:widget.rows.map((r)=>DropdownMenuItem(value:r.key,child:Text(r.symbol))).toList(),onChanged:(v)=>setState(()=>assetKey=v)),
        const SizedBox(height:8),
        DropdownButtonFormField<String>(initialValue:side,decoration:const InputDecoration(labelText:'Sens'),items:['BUY','SELL'].map((v)=>DropdownMenuItem(value:v,child:Text(v))).toList(),onChanged:(v){if(v!=null)setState(()=>side=v);}),
        const SizedBox(height:8),
        TextField(controller:quantity,keyboardType:const TextInputType.numberWithOptions(decimal:true),decoration:const InputDecoration(labelText:'Quantité')),
        const SizedBox(height:8),
        TextField(controller:price,keyboardType:const TextInputType.numberWithOptions(decimal:true),decoration:const InputDecoration(labelText:'Prix d’entrée simulé')),
        const SizedBox(height:8),
        TextField(controller:tradeNote,maxLength:2000,decoration:const InputDecoration(labelText:'Note liée à cette position simulée')),
        if(error!=null)Text(error!,style:TextStyle(color:Theme.of(context).colorScheme.error)),
        FilledButton.icon(onPressed:saving?null:create,icon:const Icon(Icons.add_chart),label:Text(saving?'Enregistrement…':'Ouvrir une position simulée'))
      ]))),
      const SizedBox(height:14),
      FutureBuilder<List<PaperTrade>>(future:future,builder:(context,s){
        if(s.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator());
        if(s.hasError)return Text('Paper Trading indisponible : ${s.error}');
        final list=s.data??const<PaperTrade>[];
        if(list.isEmpty)return const Text('Aucune position simulée enregistrée.');
        return Column(children:list.map((t)=>Card(child:ListTile(title:Text('${t.side} · ${t.assetKey}'),subtitle:Text('Qté ${t.quantity} · Entrée ${t.entryPrice}${t.exitPrice==null?'':' · Sortie ${t.exitPrice}'}${t.note==null?'':'\n${t.note}'}'),isThreeLine:t.note!=null,trailing:Wrap(spacing:2,children:[if(t.isOpen)IconButton(tooltip:'Clôturer',onPressed:()=>closeTrade(t),icon:const Icon(Icons.flag_outlined)),IconButton(tooltip:'Supprimer',onPressed:()=>remove(t),icon:const Icon(Icons.delete_outline))])))).toList());
      }),
      const SizedBox(height:24),
      Text('Notes de décision synchronisées',style:Theme.of(context).textTheme.titleLarge),
      const SizedBox(height:6),
      const Text('Ces notes documentent votre raisonnement avant une décision. Elles ne créent aucune position et sont partagées avec le Web.'),
      const SizedBox(height:10),
      Card(child:Padding(padding:const EdgeInsets.all(14),child:Column(children:[
        TextField(controller:decisionNote,maxLength:4000,maxLines:4,decoration:InputDecoration(labelText:assetKey==null?'Nouvelle note':'Nouvelle note · $assetKey',hintText:'Contexte, scénario, invalidation, raisons de rester en attente…')),
        if(decisionNoteError!=null)Text(decisionNoteError!,style:TextStyle(color:Theme.of(context).colorScheme.error)),
        FilledButton.icon(onPressed:savingDecisionNote?null:createDecisionNote,icon:const Icon(Icons.note_add_outlined),label:Text(savingDecisionNote?'Enregistrement…':'Enregistrer la note'))
      ]))),
      const SizedBox(height:10),
      FutureBuilder<List<DecisionNote>>(future:notesFuture,builder:(context,s){
        if(s.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator());
        if(s.hasError)return Text('Notes indisponibles : ${s.error}');
        final list=s.data??const<DecisionNote>[];
        if(list.isEmpty)return const Text('Aucune note de décision enregistrée.');
        return Column(children:list.map((n)=>Card(child:ListTile(title:Text(n.assetKey??'Note générale'),subtitle:Text('${n.text}\n${DateTime.fromMillisecondsSinceEpoch(n.createdAt).toLocal()}'),isThreeLine:true,trailing:IconButton(tooltip:'Supprimer',onPressed:()=>removeDecisionNote(n),icon:const Icon(Icons.delete_outline))))).toList());
      }),
    ],
  );
}
