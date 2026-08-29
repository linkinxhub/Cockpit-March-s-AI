import '../../../core/api/api_client.dart';

class SharedUserIdentity{
  const SharedUserIdentity({required this.id,required this.email,required this.displayName,required this.source});
  final String id,email,displayName,source;
  factory SharedUserIdentity.fromJson(Map<String,dynamic> json)=>SharedUserIdentity(
    id:json['id']?.toString()??'',
    email:json['email']?.toString()??'',
    displayName:json['displayName']?.toString()??'',
    source:json['source']?.toString()??'unknown',
  );
}

class IdentityRepository{
  IdentityRepository(this._api);
  final ApiClient _api;
  Future<SharedUserIdentity?> current()async{
    try{
      final json=await _api.getJson('/api/me');
      final raw=json['user'];
      return raw is Map<String,dynamic>?SharedUserIdentity.fromJson(raw):null;
    }catch(_){return null;}
  }
}
