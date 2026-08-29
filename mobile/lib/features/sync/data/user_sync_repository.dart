import '../../../core/api/api_client.dart';

class UserSyncCapabilities{
  const UserSyncCapabilities({required this.durableStore,required this.watchlist,required this.notificationPreferences,required this.notificationReads,required this.paperTrading});
  final bool durableStore,watchlist,notificationPreferences,notificationReads,paperTrading;
  factory UserSyncCapabilities.fromJson(Map<String,dynamic> json)=>UserSyncCapabilities(
    durableStore:json['durableStore']==true,watchlist:json['watchlist']==true,notificationPreferences:json['notificationPreferences']==true,notificationReads:json['notificationReads']==true,paperTrading:json['paperTrading']==true,
  );
}

class SyncNotificationPreferences{
  const SyncNotificationPreferences({required this.minimumSeverity,required this.watchedOnly,required this.pushEnabled,this.quietHoursStart,this.quietHoursEnd});
  final String minimumSeverity;final bool watchedOnly,pushEnabled;final String? quietHoursStart,quietHoursEnd;
  factory SyncNotificationPreferences.fromJson(Map<String,dynamic> json)=>SyncNotificationPreferences(minimumSeverity:json['minimumSeverity']?.toString()??'IMPORTANT',watchedOnly:json['watchedOnly']!=false,pushEnabled:json['pushEnabled']==true,quietHoursStart:json['quietHoursStart']?.toString(),quietHoursEnd:json['quietHoursEnd']?.toString());
  Map<String,dynamic> toJson()=>{'minimumSeverity':minimumSeverity,'watchedOnly':watchedOnly,'pushEnabled':pushEnabled,'quietHoursStart':quietHoursStart,'quietHoursEnd':quietHoursEnd};
}

class UserSyncSnapshot{
  const UserSyncSnapshot({required this.watchlist,required this.notificationPreferences,required this.readNotificationIds});
  final List<String> watchlist,readNotificationIds;final SyncNotificationPreferences notificationPreferences;
  factory UserSyncSnapshot.fromJson(Map<String,dynamic> json){final prefs=json['notificationPreferences'];return UserSyncSnapshot(watchlist:(json['watchlist'] as List<dynamic>???const[]).map((e)=>e.toString()).toList(growable:false),notificationPreferences:SyncNotificationPreferences.fromJson(prefs is Map<String,dynamic>?prefs:<String,dynamic>{}),readNotificationIds:(json['readNotificationIds'] as List<dynamic>???const[]).map((e)=>e.toString()).toList(growable:false));}
}

class UserSyncRepository{
  UserSyncRepository(this._api);final ApiClient _api;
  Future<UserSyncCapabilities> capabilities()async=>UserSyncCapabilities.fromJson(await _api.getJson('/api/user-sync/capabilities'));
  Future<UserSyncSnapshot> snapshot()async{final json=await _api.getJson('/api/user-sync/snapshot');return UserSyncSnapshot.fromJson((json['snapshot'] as Map<String,dynamic>?)??<String,dynamic>{});}
  Future<List<String>> setWatchlist(List<String> assetKeys)async{final json=await _api.putJson('/api/user-sync/watchlist',{'assetKeys':assetKeys});return(json['watchlist'] as List<dynamic>???const[]).map((e)=>e.toString()).toList(growable:false);}
  Future<SyncNotificationPreferences> setNotificationPreferences(SyncNotificationPreferences value)async{final json=await _api.putJson('/api/user-sync/notification-preferences',value.toJson());return SyncNotificationPreferences.fromJson((json['notificationPreferences'] as Map<String,dynamic>?)??<String,dynamic>{});}
  Future<void> markNotificationsRead(List<String> eventIds)async{await _api.postJson('/api/user-sync/notification-reads',{'eventIds':eventIds});}
}
