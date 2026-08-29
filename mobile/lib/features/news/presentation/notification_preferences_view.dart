import 'package:flutter/material.dart';
import '../../sync/data/user_sync_repository.dart';

class NotificationPreferencesView extends StatefulWidget{
  const NotificationPreferencesView({super.key,required this.repository});
  final UserSyncRepository repository;
  @override State<NotificationPreferencesView> createState()=>_NotificationPreferencesViewState();
}

class _NotificationPreferencesViewState extends State<NotificationPreferencesView>{
  late Future<UserSyncSnapshot> future;
  SyncNotificationPreferences? prefs;
  bool saving=false;
  String? error;

  @override void initState(){super.initState();future=widget.repository.snapshot();}

  Future<void> save()async{
    final current=prefs;if(current==null)return;
    setState((){saving=true;error=null;});
    try{final saved=await widget.repository.setNotificationPreferences(current);if(mounted)setState(()=>prefs=saved);if(mounted)ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content:Text('Préférences synchronisées.')));}catch(e){if(mounted)setState(()=>error=e.toString());}finally{if(mounted)setState(()=>saving=false);}
  }

  Future<String?> pickTime(String? initial)async{
    TimeOfDay start=TimeOfDay.now();
    if(initial!=null&&initial.contains(':')){final parts=initial.split(':');final h=int.tryParse(parts[0]),m=int.tryParse(parts[1]);if(h!=null&&m!=null)start=TimeOfDay(hour:h,minute:m);}
    final selected=await showTimePicker(context:context,initialTime:start);if(selected==null)return initial;return '${selected.hour.toString().padLeft(2,'0')}:${selected.minute.toString().padLeft(2,'0')}';
  }

  @override Widget build(BuildContext context)=>Scaffold(appBar:AppBar(title:const Text('Préférences News')),body:FutureBuilder<UserSyncSnapshot>(future:future,builder:(context,s){
    if(s.connectionState==ConnectionState.waiting)return const Center(child:CircularProgressIndicator());
    if(s.hasError)return Padding(padding:const EdgeInsets.all(20),child:Text('Préférences indisponibles : ${s.error}'));
    prefs??=s.data!.notificationPreferences;final p=prefs!;
    return ListView(padding:const EdgeInsets.all(16),children:[
      Text('Synchronisation Web ↔ Flutter',style:Theme.of(context).textTheme.headlineSmall),
      const SizedBox(height:8),const Text('Ces réglages sont enregistrés côté serveur et partagés entre les deux applications.'),
      const SizedBox(height:16),
      DropdownButtonFormField<String>(value:p.minimumSeverity,decoration:const InputDecoration(labelText:'Seuil minimum'),items:['INFO','IMPORTANT','CRITIQUE'].map((v)=>DropdownMenuItem(value:v,child:Text(v))).toList(),onChanged:(v){if(v!=null)setState(()=>prefs=SyncNotificationPreferences(minimumSeverity:v,watchedOnly:p.watchedOnly,pushEnabled:p.pushEnabled,quietHoursStart:p.quietHoursStart,quietHoursEnd:p.quietHoursEnd));}),
      SwitchListTile(contentPadding:EdgeInsets.zero,title:const Text('Uniquement les actifs favoris'),value:p.watchedOnly,onChanged:(v)=>setState(()=>prefs=SyncNotificationPreferences(minimumSeverity:p.minimumSeverity,watchedOnly:v,pushEnabled:p.pushEnabled,quietHoursStart:p.quietHoursStart,quietHoursEnd:p.quietHoursEnd))),
      SwitchListTile(contentPadding:EdgeInsets.zero,title:const Text('Notifications push'),subtitle:const Text('Effectives dès qu’un fournisseur push est configuré.'),value:p.pushEnabled,onChanged:(v)=>setState(()=>prefs=SyncNotificationPreferences(minimumSeverity:p.minimumSeverity,watchedOnly:p.watchedOnly,pushEnabled:v,quietHoursStart:p.quietHoursStart,quietHoursEnd:p.quietHoursEnd))),
      Card(child:Column(children:[ListTile(title:const Text('Silence début'),trailing:Text(p.quietHoursStart??'Non défini'),onTap:()async{final value=await pickTime(p.quietHoursStart);if(mounted)setState(()=>prefs=SyncNotificationPreferences(minimumSeverity:p.minimumSeverity,watchedOnly:p.watchedOnly,pushEnabled:p.pushEnabled,quietHoursStart:value,quietHoursEnd:p.quietHoursEnd));}),ListTile(title:const Text('Silence fin'),trailing:Text(p.quietHoursEnd??'Non défini'),onTap:()async{final value=await pickTime(p.quietHoursEnd);if(mounted)setState(()=>prefs=SyncNotificationPreferences(minimumSeverity:p.minimumSeverity,watchedOnly:p.watchedOnly,pushEnabled:p.pushEnabled,quietHoursStart:p.quietHoursStart,quietHoursEnd:value));})])),
      if(error!=null)Padding(padding:const EdgeInsets.only(top:8),child:Text(error!,style:TextStyle(color:Theme.of(context).colorScheme.error))),
      const SizedBox(height:16),FilledButton.icon(onPressed:saving?null:save,icon:const Icon(Icons.sync),label:Text(saving?'Enregistrement…':'Enregistrer et synchroniser')),
    ]);
  }));
}
