import '../../../core/api/api_client.dart';

class MarketRow {
  const MarketRow({
    required this.symbol,
    required this.name,
    required this.kind,
    required this.price,
    required this.changePct,
    required this.signal,
  });

  final String symbol;
  final String name;
  final String kind;
  final double? price;
  final double? changePct;
  final String? signal;

  factory MarketRow.fromJson(Map<String, dynamic> json) => MarketRow(
        symbol: json['symbol']?.toString() ?? '—',
        name: json['name']?.toString() ?? '—',
        kind: json['kind']?.toString() ?? '—',
        price: (json['price'] as num?)?.toDouble(),
        changePct: (json['changePct'] as num?)?.toDouble(),
        signal: json['signal']?.toString(),
      );
}

class MarketRepository {
  MarketRepository(this._api);

  final ApiClient _api;

  Future<List<MarketRow>> fetchScanner() async {
    final json = await _api.getJson('/api/scanner');
    final rows = (json['rows'] as List<dynamic>? ?? const []);
    return rows
        .whereType<Map<String, dynamic>>()
        .map(MarketRow.fromJson)
        .toList(growable: false);
  }
}
