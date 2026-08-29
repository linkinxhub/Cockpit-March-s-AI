import '../../../core/api/api_client.dart';

class UserSyncCapabilities{
  const UserSyncCapabilities({required this.durableStore,required this.watchlist,required this.notificationPreferences,required this.notificationReads,required this.paperTrading});
  final bool durableStore,watchlist,notificationPreferences,notificationReads,paperTrading;
  factory UserSyncCapabilities.fromJson(Map<String,dynamic> json)=>UserSyncCapabilities(
    durableStore:json['durableStore']==true,
    watchlist:json['watchlist']==true,
    notificationPreferences:json['notificationPreferences']==true,
    notificationReads:json['notificationReads']==true,
    paperTrading:json['paperTrading']==true,
  );
}

class UserSyncRepository{
  UserSyncRepository(this._api);
  final ApiClient _api;
  Future<UserSyncCapabilities> capabilities()async=>UserSyncCapabilities.fromJson(await _api.getJson('/api/user-sync/capabilities'));
}
