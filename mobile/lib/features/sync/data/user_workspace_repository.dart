import '../../../core/api/api_client.dart';

class UserWorkspaceState{
  const UserWorkspaceState({required this.profile,required this.priceAlerts,required this.passports,required this.updatedAt});
  final Map<String,dynamic> profile;
  final List<Map<String,dynamic>> priceAlerts;
  final List<Map<String,dynamic>> passports;
  final int updatedAt;
  factory UserWorkspaceState.fromJson(Map<String,dynamic> json)=>UserWorkspaceState(
    profile:(json['profile'] as Map<String,dynamic>?)??<String,dynamic>{},
    priceAlerts:(json['priceAlerts'] as List<dynamic>? ?? const[]).whereType<Map<String,dynamic>>().toList(growable:false),
    passports:(json['passports'] as List<dynamic>? ?? const[]).whereType<Map<String,dynamic>>().toList(growable:false),
    updatedAt:(json['updatedAt'] as num?)?.toInt()??0,
  );
  Map<String,dynamic> toJson()=>{'profile':profile,'priceAlerts':priceAlerts,'passports':passports};
}

class UserWorkspaceRepository{
  UserWorkspaceRepository(this._api);final ApiClient _api;
  Future<UserWorkspaceState> load()async{final json=await _api.getJson('/api/user-sync/workspace');return UserWorkspaceState.fromJson((json['workspace'] as Map<String,dynamic>?)??<String,dynamic>{});}
  Future<UserWorkspaceState> save(UserWorkspaceState value)async{final json=await _api.putJson('/api/user-sync/workspace',value.toJson());return UserWorkspaceState.fromJson((json['workspace'] as Map<String,dynamic>?)??<String,dynamic>{});}
}
