import '../../../core/api/api_client.dart';

class IndicatorItem {
  const IndicatorItem({required this.name,required this.value,required this.reading,required this.decision,required this.explanation});
  final String name;
  final String value;
  final String reading;
  final String decision;
  final String explanation;
  factory IndicatorItem.fromJson(Map<String,dynamic> json)=>IndicatorItem(
    name:json['name']?.toString()??'—',
    value:json['value']?.toString()??'—',
    reading:json['reading']?.toString()??'—',
    decision:json['decision']?.toString()??'INDISPONIBLE',
    explanation:json['explanation']?.toString()??'',
  );
}

class IndicatorCenter {
  const IndicatorCenter({required this.symbol,required this.period,required this.consensus,required this.items});
  final String symbol;
  final String period;
  final String consensus;
  final List<IndicatorItem> items;
  factory IndicatorCenter.fromJson(Map<String,dynamic> json)=>IndicatorCenter(
    symbol:json['symbol']?.toString()??'—',
    period:json['period']?.toString()??'1d',
    consensus:json['consensus']?.toString()??'ATTENDRE',
    items:(json['items'] as List<dynamic>? ?? const[]).whereType<Map<String,dynamic>>().map(IndicatorItem.fromJson).toList(growable:false),
  );
}

class IndicatorRepository {
  IndicatorRepository(this._api);
  final ApiClient _api;
  Future<IndicatorCenter> fetch({required String symbol,String period='1d'}) async {
    final json=await _api.getJson('/api/indicators?symbol=${Uri.encodeQueryComponent(symbol)}&period=${Uri.encodeQueryComponent(period)}');
    return IndicatorCenter.fromJson(json);
  }
}
