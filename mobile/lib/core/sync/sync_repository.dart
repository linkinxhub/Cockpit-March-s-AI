import '../api/api_client.dart';

class SyncManifest {
  const SyncManifest({required this.schemaVersion,required this.sourceOfTruth,required this.flutterCompatible,required this.contracts});
  final String schemaVersion;
  final String sourceOfTruth;
  final bool flutterCompatible;
  final Map<String,String> contracts;

  factory SyncManifest.fromJson(Map<String,dynamic> json){
    final rawContracts=json['contracts'] as Map<String,dynamic>? ?? const <String,dynamic>{};
    final clients=json['clients'] as Map<String,dynamic>? ?? const <String,dynamic>{};
    return SyncManifest(
      schemaVersion:json['schemaVersion']?.toString()??'0.0.0',
      sourceOfTruth:json['sourceOfTruth']?.toString()??'unknown',
      flutterCompatible:clients['flutter']?.toString()=='compatible',
      contracts:rawContracts.map((key,value)=>MapEntry(key,value.toString())),
    );
  }
}

class SyncRepository {
  SyncRepository(this._api);
  final ApiClient _api;

  Future<SyncManifest> fetchManifest() async => SyncManifest.fromJson(await _api.getJson('/api/sync/manifest'));

  Future<void> assertCompatible({String supportedMajor='1'}) async {
    final manifest=await fetchManifest();
    if(!manifest.flutterCompatible) throw StateError('Client Flutter déclaré incompatible par le serveur.');
    if(manifest.schemaVersion.split('.').first!=supportedMajor) throw StateError('Contrat API incompatible: serveur ${manifest.schemaVersion}, Flutter $supportedMajor.x');
    for(final required in ['scanner','history','indicators']){
      if(!manifest.contracts.containsKey(required)) throw StateError('Contrat requis absent: $required');
    }
  }
}
