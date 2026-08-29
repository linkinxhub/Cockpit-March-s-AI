import '../../../core/api/api_client.dart';

class IchimokuSignalMarker{
  const IchimokuSignalMarker({required this.t,required this.price,required this.action,required this.confidence,required this.reason});
  final int t;
  final double price;
  final String action,reason;
  final double confidence;
  factory IchimokuSignalMarker.fromJson(Map<String,dynamic> json)=>IchimokuSignalMarker(
    t:(json['t'] as num?)?.toInt()??0,
    price:(json['price'] as num?)?.toDouble()??0,
    action:json['action']?.toString()??'ATTENDRE',
    confidence:(json['confidence'] as num?)?.toDouble()??0,
    reason:json['reason']?.toString()??'',
  );
}

class IchimokuHistoryRepository{
  IchimokuHistoryRepository(this._api);
  final ApiClient _api;
  Future<List<IchimokuSignalMarker>> fetch({required String symbol,required String period}) async{
    final json=await _api.getJson('/api/ichimoku-history?symbol=${Uri.encodeQueryComponent(symbol)}&period=${Uri.encodeQueryComponent(period)}');
    final raw=json['signals'] as List<dynamic>? ?? const[];
    return raw.whereType<Map<String,dynamic>>().map(IchimokuSignalMarker.fromJson).toList(growable:false);
  }
}
