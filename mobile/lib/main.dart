import 'package:flutter/material.dart';
import 'core/api/api_client.dart';
import 'features/markets/data/market_repository.dart';

const apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:3000',
);

void main() {
  runApp(const CockpitMarketsApp());
}

class CockpitMarketsApp extends StatelessWidget {
  const CockpitMarketsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Cockpit Marchés AI',
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
      ),
      home: const MarketsScreen(),
    );
  }
}

class MarketsScreen extends StatefulWidget {
  const MarketsScreen({super.key});

  @override
  State<MarketsScreen> createState() => _MarketsScreenState();
}

class _MarketsScreenState extends State<MarketsScreen> {
  late final MarketRepository repository;
  late Future<List<MarketRow>> future;

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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cockpit Marchés AI'),
        actions: [
          IconButton(onPressed: refresh, icon: const Icon(Icons.refresh)),
        ],
      ),
      body: FutureBuilder<List<MarketRow>>(
        future: future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text('API indisponible : ${snapshot.error}'),
              ),
            );
          }
          final rows = snapshot.data ?? const <MarketRow>[];
          return RefreshIndicator(
            onRefresh: refresh,
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: rows.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final row = rows[index];
                return Card(
                  child: ListTile(
                    title: Text(row.symbol),
                    subtitle: Text('${row.name} · ${row.kind}'),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(row.price?.toStringAsFixed(4) ?? '—'),
                        Text(row.signal ?? 'NEUTRE'),
                      ],
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
