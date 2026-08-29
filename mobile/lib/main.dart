import 'package:flutter/material.dart';
import 'core/api/api_client.dart';
import 'features/markets/data/market_repository.dart';

const apiBaseUrl = String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3000');

void main() => runApp(const CockpitMarketsApp());

class CockpitMarketsApp extends StatelessWidget {
  const CockpitMarketsApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Cockpit Marchés AI',
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(brightness: Brightness.dark, useMaterial3: true),
      home: const MobileShell(),
    );
  }
}

class MobileShell extends StatefulWidget {
  const MobileShell({super.key});
  @override
  State<MobileShell> createState() => _MobileShellState();
}

class _MobileShellState extends State<MobileShell> {
  late final MarketRepository repository;
  late Future<List<MarketRow>> future;
  int index = 0;

  @override
  void initState() {
    super.initState();
    repository = MarketRepository(ApiClient(baseUrl: apiBaseUrl));
    future = repository.fetchScanner();
  }

  Future<void> refresh() async {
    final next = repository.fetchScanner();
    setState(() => future = next);
    await next;
  }

  @override
  Widget build(BuildContext context) {
    const titles = ['Cockpit', 'Marchés', 'Indicateurs', 'Signaux'];
    return Scaffold(
      appBar: AppBar(
        title: Text('Cockpit Marchés AI · ${titles[index]}'),
        actions: [IconButton(onPressed: refresh, icon: const Icon(Icons.refresh))],
      ),
      body: FutureBuilder<List<MarketRow>>(
        future: future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError) return Center(child: Padding(padding: const EdgeInsets.all(24), child: Text('API indisponible : ${snapshot.error}')));
          final rows = snapshot.data ?? const <MarketRow>[];
          return switch (index) {
            0 => CockpitView(rows: rows, onRefresh: refresh),
            1 => MarketsView(rows: rows, onRefresh: refresh),
            2 => IndicatorsView(rows: rows),
            _ => SignalsView(rows: rows),
          };
        },
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Cockpit'),
          NavigationDestination(icon: Icon(Icons.candlestick_chart_outlined), selectedIcon: Icon(Icons.candlestick_chart), label: 'Marchés'),
          NavigationDestination(icon: Icon(Icons.monitor_heart_outlined), selectedIcon: Icon(Icons.monitor_heart), label: 'Indicateurs'),
          NavigationDestination(icon: Icon(Icons.bolt_outlined), selectedIcon: Icon(Icons.bolt), label: 'Signaux'),
        ],
      ),
    );
  }
}

class CockpitView extends StatelessWidget {
  const CockpitView({super.key, required this.rows, required this.onRefresh});
  final List<MarketRow> rows;
  final Future<void> Function() onRefresh;
  @override
  Widget build(BuildContext context) {
    final buy = rows.where((r) => _tone(r.signal) == 'buy').length;
    final sell = rows.where((r) => _tone(r.signal) == 'sell').length;
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView(padding: const EdgeInsets.all(16), children: [
        Text('Vue d’ensemble', style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 12),
        Wrap(spacing: 10, runSpacing: 10, children: [
          _Metric(label: 'Actifs suivis', value: '${rows.length}'),
          _Metric(label: 'Achats', value: '$buy'),
          _Metric(label: 'Ventes', value: '$sell'),
        ]),
        const SizedBox(height: 18),
        Text('Opportunités', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        ...rows.take(8).map((r) => _MarketTile(row: r)),
      ]),
    );
  }
}

class MarketsView extends StatelessWidget {
  const MarketsView({super.key, required this.rows, required this.onRefresh});
  final List<MarketRow> rows;
  final Future<void> Function() onRefresh;
  @override
  Widget build(BuildContext context) => RefreshIndicator(
        onRefresh: onRefresh,
        child: ListView.separated(
          padding: const EdgeInsets.all(16),
          itemCount: rows.length,
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (_, i) => _MarketTile(row: rows[i]),
        ),
      );
}

class IndicatorsView extends StatelessWidget {
  const IndicatorsView({super.key, required this.rows});
  final List<MarketRow> rows;
  @override
  Widget build(BuildContext context) {
    if (rows.isEmpty) return const Center(child: Text('Aucun actif disponible'));
    final r = rows.first;
    final emaDecision = r.ema20 == null || r.ema50 == null ? 'INDISPONIBLE' : (r.ema20! > r.ema50! ? 'ACHETER' : 'VENDRE');
    final rsiDecision = r.rsi == null ? 'INDISPONIBLE' : r.rsi! <= 30 ? 'ACHETER' : r.rsi! >= 70 ? 'VENDRE' : 'ATTENDRE';
    return ListView(padding: const EdgeInsets.all(16), children: [
      Text('Centre des indicateurs', style: Theme.of(context).textTheme.headlineSmall),
      const SizedBox(height: 6),
      Text('${r.symbol} · lecture issue du même scanner Web'),
      const SizedBox(height: 16),
      const _IndicatorCard(name: 'Ichimoku Kinko Hyo', value: 'API dédiée à synchroniser', decision: 'BIENTÔT', highlighted: true),
      _IndicatorCard(name: 'EMA 20 / EMA 50', value: '${_fmt(r.ema20)} / ${_fmt(r.ema50)}', decision: emaDecision),
      _IndicatorCard(name: 'RSI 14', value: _fmt(r.rsi), decision: rsiDecision),
      _IndicatorCard(name: 'Support / Résistance', value: '${_fmt(r.support)} / ${_fmt(r.resistance)}', decision: 'ATTENDRE'),
    ]);
  }
}

class SignalsView extends StatelessWidget {
  const SignalsView({super.key, required this.rows});
  final List<MarketRow> rows;
  @override
  Widget build(BuildContext context) {
    final signaled = rows.where((r) => r.signal != null).toList();
    return ListView(padding: const EdgeInsets.all(16), children: [
      Text('Signaux AI', style: Theme.of(context).textTheme.headlineSmall),
      const SizedBox(height: 12),
      ...signaled.map((r) => _MarketTile(row: r)),
    ]);
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.label, required this.value});
  final String label, value;
  @override
  Widget build(BuildContext context) => Card(child: Padding(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label), const SizedBox(height: 4), Text(value, style: Theme.of(context).textTheme.headlineSmall)])));
}

class _MarketTile extends StatelessWidget {
  const _MarketTile({required this.row});
  final MarketRow row;
  @override
  Widget build(BuildContext context) => Card(
        child: ListTile(
          title: Text(row.symbol),
          subtitle: Text('${row.name} · ${row.kind}'),
          trailing: Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.end, children: [Text(_fmt(row.price)), Text(row.signal ?? 'NEUTRE')]),
        ),
      );
}

class _IndicatorCard extends StatelessWidget {
  const _IndicatorCard({required this.name, required this.value, required this.decision, this.highlighted = false});
  final String name, value, decision;
  final bool highlighted;
  @override
  Widget build(BuildContext context) => Card(
        child: ListTile(
          leading: Icon(highlighted ? Icons.auto_awesome : Icons.analytics_outlined),
          title: Text(name, style: highlighted ? const TextStyle(fontWeight: FontWeight.bold) : null),
          subtitle: Text(value),
          trailing: Text(decision),
        ),
      );
}

String _fmt(double? value) => value == null ? '—' : value.toStringAsFixed(4);
String _tone(String? signal) {
  final s = (signal ?? '').toUpperCase();
  if (s.contains('ACH') || s.contains('BUY')) return 'buy';
  if (s.contains('VEN') || s.contains('SELL')) return 'sell';
  return 'wait';
}
