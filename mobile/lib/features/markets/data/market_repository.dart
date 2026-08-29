import '../../../core/api/api_client.dart';

class MarketRow {
  const MarketRow({
    required this.symbol,
    required this.name,
    required this.kind,
    required this.price,
    required this.changePct,
    required this.signal,
    this.rsi,
    this.ema20,
    this.ema50,
    this.support,
    this.resistance,
  });

  final String symbol;
  final String name;
  final String kind;
  final double? price;
  final double? changePct;
  final String? signal;
  final double? rsi;
  final double? ema20;
  final double? ema50;
  final double? support;
  final double? resistance;

  static double? _number(dynamic value) => value is num ? value.toDouble() : double.tryParse(value?.toString() ?? '');

  factory MarketRow.fromJson(Map<String, dynamic> json) => MarketRow(
        symbol: json['symbol']?.toString() ?? '—',
        name: json['name']?.toString() ?? '—',
        kind: json['kind']?.toString() ?? '—',
        price: _number(json['price'] ?? json['last']),
        changePct: _number(json['changePct']),
        signal: (json['signal'] ?? json['decision'])?.toString(),
        rsi: _number(json['rsi']),
        ema20: _number(json['ema20']),
        ema50: _number(json['ema50']),
        support: _number(json['support']),
        resistance: _number(json['resistance']),
      );
}

class MarketRepository {
  MarketRepository(this._api);
  final ApiClient _api;

  Future<List<MarketRow>> fetchScanner() async {
    final json = await _api.getJson('/api/scanner');
    final rows = (json['rows'] as List<dynamic>? ?? const []);
    return rows.whereType<Map<String, dynamic>>().map(MarketRow.fromJson).toList(growable: false);
  }
}
