import '../../../core/api/api_client.dart';

class MarketStatus {
  const MarketStatus({required this.key,required this.venue,required this.zone,required this.open,required this.localTime});
  final String key;
  final String venue;
  final String zone;
  final bool open;
  final String localTime;

  factory MarketStatus.fromJson(Map<String,dynamic> json)=>MarketStatus(
    key:json['key']?.toString()??'—',
    venue:json['venue']?.toString()??'—',
    zone:json['zone']?.toString()??'—',
    open:json['open']==true,
    localTime:json['localTime']?.toString()??'—',
  );
}

class MarketStatusRepository {
  MarketStatusRepository(this._api);
  final ApiClient _api;

  Future<Map<String,MarketStatus>> fetchAll() async {
    final json=await _api.getJson('/api/market-status');
    final list=json['statuses'] as List<dynamic>? ?? const [];
    return {
      for(final raw in list.whereType<Map<String,dynamic>>())
        if(raw['key']!=null) raw['key'].toString():MarketStatus.fromJson(raw),
    };
  }

  Future<MarketStatus?> fetchOne(String symbol) async {
    final json=await _api.getJson('/api/market-status?symbol=${Uri.encodeQueryComponent(symbol)}');
    final raw=json['status'];
    return raw is Map<String,dynamic>?MarketStatus.fromJson(raw):null;
  }
}
