import '../../../core/api/api_client.dart';

class HistoryPoint {
  const HistoryPoint({required this.t,required this.price,this.high,this.low});
  final int t;
  final double price;
  final double? high;
  final double? low;
  factory HistoryPoint.fromJson(Map<String,dynamic> json)=>HistoryPoint(
    t:(json['t'] as num?)?.toInt()??0,
    price:(json['price'] as num?)?.toDouble()??0,
    high:(json['high'] as num?)?.toDouble(),
    low:(json['low'] as num?)?.toDouble(),
  );
}

class TimeframeComparison {
  const TimeframeComparison({required this.period,required this.decision,this.confidence,this.change,this.rsi,required this.risk});
  final String period;
  final String decision;
  final double? confidence;
  final double? change;
  final double? rsi;
  final String risk;
  factory TimeframeComparison.fromJson(Map<String,dynamic> json)=>TimeframeComparison(
    period:json['period']?.toString()??'—',
    decision:json['decision']?.toString()??'INDISPONIBLE',
    confidence:(json['confidence'] as num?)?.toDouble(),
    change:(json['change'] as num?)?.toDouble(),
    rsi:(json['rsi'] as num?)?.toDouble(),
    risk:json['risk']?.toString()??'—',
  );
}

class HistoryBundle {
  const HistoryBundle({required this.period,required this.points,required this.analysis});
  final String period;
  final List<HistoryPoint> points;
  final Map<String,dynamic> analysis;
}

class HistoryRepository {
  HistoryRepository(this._api);
  final ApiClient _api;

  Future<HistoryBundle> fetchHistory({required String symbol,String period='1d'}) async {
    final json=await _api.getJson('/api/history?symbol=${Uri.encodeQueryComponent(symbol)}&period=${Uri.encodeQueryComponent(period)}');
    final points=(json['points'] as List<dynamic>? ?? const []).whereType<Map<String,dynamic>>().map(HistoryPoint.fromJson).toList(growable:false);
    return HistoryBundle(period:json['period']?.toString()??period,points:points,analysis:(json['analysis'] as Map<String,dynamic>?)??const{});
  }

  Future<List<TimeframeComparison>> fetchComparisons(String symbol) async {
    final json=await _api.getJson('/api/history?symbol=${Uri.encodeQueryComponent(symbol)}&period=1d&compare=1');
    return (json['comparisons'] as List<dynamic>? ?? const []).whereType<Map<String,dynamic>>().map(TimeframeComparison.fromJson).toList(growable:false);
  }
}
