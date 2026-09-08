import 'dart:async';
import 'package:flutter/widgets.dart';
import '../../core/api/api_client.dart';
class ReleaseEntry {
 const ReleaseEntry(this.version,this.date,this.notes);
 final String version,date;final List<String> notes;
 factory ReleaseEntry.fromJson(Map<String,dynamic> json,String language){final all=json['notes'] as Map<String,dynamic>? ?? {};return ReleaseEntry(json['version']?.toString()??'',json['date']?.toString()??'',((all[language]??all['fr']) as List? ?? []).map((e)=>e.toString()).toList());}
}
class UpdateController extends ChangeNotifier with WidgetsBindingObserver {
 UpdateController(this.api){WidgetsBinding.instance.addObserver(this);_timer=Timer.periodic(const Duration(minutes:5),(_){if(_foreground)unawaited(check());});}
 final ApiClient api;Timer? _timer;bool _disposed=false,_foreground=true,checking=false;
 String? error,latestBuild,appliedBuild,serverVersion;List<ReleaseEntry> releases=[];List<String> upcoming=[];
 static const installedVersion='0.2.0';static const installedBuild=2;
 bool binaryAvailable=false;Uri? storeUrl;
 bool get dataAvailable=>latestBuild!=null&&appliedBuild!=null&&latestBuild!=appliedBuild;
 void _emit(){if(!_disposed)notifyListeners();}
 Future<void> check({String language='fr'})async{
  if(checking||_disposed)return;checking=true;error=null;_emit();
  try{final data=await api.getJson('/api/releases');if(data['schemaVersion']!=1||data['buildId'] is! String||data['releases'] is! List)throw const FormatException('Unsupported manifest');if(_disposed)return;
   latestBuild=data['buildId'] as String;appliedBuild??=latestBuild;serverVersion=data['version']?.toString();
   releases=(data['releases'] as List).whereType<Map<String,dynamic>>().map((e)=>ReleaseEntry.fromJson(e,language)).toList();
   final next=data['upcoming'] as Map<String,dynamic>? ?? {};upcoming=((next[language]??next['fr']) as List? ?? []).map((e)=>e.toString()).toList();
   final platform=defaultTargetPlatform==TargetPlatform.iOS?'ios':'android';final mobile=(data['mobile'] as Map<String,dynamic>? ?? {})[platform] as Map<String,dynamic>? ?? {};
   binaryAvailable=(mobile['build'] as num? ?? 0)>installedBuild;final candidate=Uri.tryParse(mobile['storeUrl']?.toString()??'');storeUrl=candidate!=null&&candidate.scheme=='https'&&['apps.apple.com','play.google.com'].contains(candidate.host)?candidate:null;
  }catch(_){if(!_disposed)error='Vérification indisponible. Réessayez lorsque la connexion revient.';}finally{checking=false;_emit();}
 }
 Future<void> refreshData(Future<void> Function() refresh)async{final target=latestBuild;await refresh();if(_disposed)return;appliedBuild=target;_emit();}
 @override void didChangeAppLifecycleState(AppLifecycleState state){_foreground=state==AppLifecycleState.resumed;if(_foreground)unawaited(check());}
 @override void dispose(){_disposed=true;_timer?.cancel();WidgetsBinding.instance.removeObserver(this);super.dispose();}
}
