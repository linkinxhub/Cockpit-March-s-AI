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
  factory UserSyncSnapshot.fromJson(Map<String,dynamic> json){
    final prefs=json['notificationPreferences'];
    final watchlist=json['watchlist'] as List<dynamic>? ?? const <dynamic>[];
    final reads=json['readNotificationIds'] as List<dynamic>? ?? const <dynamic>[];
    return UserSyncSnapshot(watchlist:watchlist.map((e)=>e.toString()).toList(growable:false),notificationPreferences:SyncNotificationPreferences.fromJson(prefs is Map<String,dynamic>?prefs:<String,dynamic>{}),readNotificationIds:reads.map((e)=>e.toString()).toList(growable:false));
  }
}

class PaperTrade{
  const PaperTrade({required this.id,required this.assetKey,required this.side,required this.quantity,required this.entryPrice,this.exitPrice,required this.openedAt,this.closedAt,this.note});
  final String id,assetKey,side,quantity,entryPrice;final String? exitPrice,note;final int openedAt;final int? closedAt;
  bool get isOpen=>closedAt==null;
  factory PaperTrade.fromJson(Map<String,dynamic> json)=>PaperTrade(id:json['id']?.toString()??'',assetKey:json['assetKey']?.toString()??'',side:json['side']?.toString()??'BUY',quantity:json['quantity']?.toString()??'0',entryPrice:json['entryPrice']?.toString()??'0',exitPrice:json['exitPrice']?.toString(),openedAt:(json['openedAt'] as num?)?.toInt()??0,closedAt:(json['closedAt'] as num?)?.toInt(),note:json['note']?.toString());
}

class UserSyncRepository{
  UserSyncRepository(this._api);final ApiClient _api;
  Future<UserSyncCapabilities> capabilities()async=>UserSyncCapabilities.fromJson(await _api.getJson('/api/user-sync/capabilities'));
  Future<UserSyncSnapshot> snapshot()async{final json=await _api.getJson('/api/user-sync/snapshot');return UserSyncSnapshot.fromJson((json['snapshot'] as Map<String,dynamic>?)??<String,dynamic>{});}
  Future<List<String>> setWatchlist(List<String> assetKeys)async{final json=await _api.putJson('/api/user-sync/watchlist',{'assetKeys':assetKeys});final list=json['watchlist'] as List<dynamic>? ?? const <dynamic>[];return list.map((e)=>e.toString()).toList(growable:false);}
  Future<SyncNotificationPreferences> setNotificationPreferences(SyncNotificationPreferences value)async{final json=await _api.putJson('/api/user-sync/notification-preferences',value.toJson());return SyncNotificationPreferences.fromJson((json['notificationPreferences'] as Map<String,dynamic>?)??<String,dynamic>{});}
  Future<void> markNotificationsRead(List<String> eventIds)async{await _api.postJson('/api/user-sync/notification-reads',{'eventIds':eventIds});}
  Future<List<PaperTrade>> paperTrades()async{final json=await _api.getJson('/api/user-sync/paper-trades');final list=json['trades'] as List<dynamic>? ?? const <dynamic>[];return list.whereType<Map<String,dynamic>>().map(PaperTrade.fromJson).toList(growable:false);}
  Future<PaperTrade> createPaperTrade({required String assetKey,required String side,required String quantity,required String entryPrice,String? note})async{final json=await _api.postJson('/api/user-sync/paper-trades',{'assetKey':assetKey,'side':side,'quantity':quantity,'entryPrice':entryPrice,'note':note});return PaperTrade.fromJson((json['trade'] as Map<String,dynamic>?)??<String,dynamic>{});}
  Future<PaperTrade> closePaperTrade(String id,String exitPrice)async{final json=await _api.patchJson('/api/user-sync/paper-trades',{'id':id,'exitPrice':exitPrice});return PaperTrade.fromJson((json['trade'] as Map<String,dynamic>?)??<String,dynamic>{});}
  Future<void> deletePaperTrade(String id)async{await _api.deleteJson('/api/user-sync/paper-trades?id=${Uri.encodeQueryComponent(id)}');}
}
