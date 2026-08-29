import 'package:flutter/material.dart';
import '../../../core/api/api_client.dart';
import '../data/mobile_session_repository.dart';
import '../../../app_shell.dart';

class MobileConnectionGate extends StatefulWidget{
  const MobileConnectionGate({super.key,required this.apiBaseUrl});
  final String apiBaseUrl;
  @override State<MobileConnectionGate> createState()=>_MobileConnectionGateState();
}

class _MobileConnectionGateState extends State<MobileConnectionGate>{
  final session=MobileSessionRepository();
  final controller=TextEditingController();
  bool loading=true,connecting=false;
  String? error;
  String? token;

  @override void initState(){super.initState();_restore();}
  Future<void> _restore()async{final saved=await session.readToken();if(saved!=null&&saved.isNotEmpty){final ok=await _validate(saved);if(ok){ApiClient.sessionBearerToken=saved;token=saved;}}if(mounted)setState(()=>loading=false);}
  Future<bool> _validate(String value)async{try{final api=ApiClient(baseUrl:widget.apiBaseUrl,bearerToken:value),json=await api.getJson('/api/me');return json['authenticated']==true;}catch{return false;}}
  Future<void> _connect()async{final value=controller.text.trim();if(value.isEmpty)return;setState((){connecting=true;error=null;});final ok=await _validate(value);if(!ok){setState((){connecting=false;error='Jeton invalide ou expiré.';});return;}await session.saveToken(value);ApiClient.sessionBearerToken=value;if(mounted)setState((){token=value;connecting=false;});}
  Future<void> _disconnect()async{await session.clear();ApiClient.sessionBearerToken=null;if(mounted)setState((){token=null;controller.clear();});}

  @override Widget build(BuildContext context){
    if(loading)return const MaterialApp(home:Scaffold(body:Center(child:CircularProgressIndicator())));
    if(token!=null)return CockpitMarketsApp(apiBaseUrl:widget.apiBaseUrl);
    return MaterialApp(debugShowCheckedModeBanner:false,themeMode:ThemeMode.dark,darkTheme:ThemeData(brightness:Brightness.dark,useMaterial3:true),home:Scaffold(appBar:AppBar(title:const Text('Cockpit Marchés AI')),body:ListView(padding:const EdgeInsets.all(24),children:[
      const Icon(Icons.phonelink_lock,size:56),const SizedBox(height:20),Text('Connecter cette application',style:Theme.of(context).textTheme.headlineSmall),const SizedBox(height:10),const Text('Depuis la WebApp connectée, ouvrez /mobile-connect et générez un jeton mobile. Collez-le ici une seule fois. Il sera conservé dans le stockage sécurisé du téléphone.'),const SizedBox(height:20),TextField(controller:controller,minLines:3,maxLines:6,autocorrect:false,enableSuggestions:false,decoration:const InputDecoration(labelText:'Jeton mobile',border:OutlineInputBorder())),const SizedBox(height:12),FilledButton.icon(onPressed:connecting?null:_connect,icon:const Icon(Icons.lock_open),label:Text(connecting?'Vérification…':'Connecter')),if(error!=null)Padding(padding:const EdgeInsets.only(top:12),child:Text(error!,style:TextStyle(color:Theme.of(context).colorScheme.error))),const SizedBox(height:20),const Text('Aucun mot de passe n’est stocké dans l’application. Un jeton expiré est refusé automatiquement.'),
    ])));
  }

  @override void dispose(){controller.dispose();super.dispose();}
}
