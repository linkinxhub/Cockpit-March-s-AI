import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../data/account_repository.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({
    super.key,
    required this.repository,
    required this.onSignOut,
  });
  final AccountRepository repository;
  final Future<void> Function() onSignOut;
  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen>
    with WidgetsBindingObserver {
  late Future<MobileAccount> account;
  bool signingOut = false;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    account = widget.repository.fetch();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  void refresh() {
    setState(() {
      account = widget.repository.fetch();
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) refresh();
  }

  Future<void> signOut() async {
    if (signingOut) return;
    setState(() => signingOut = true);
    try {
      await widget.onSignOut();
    } catch (_) {
      if (mounted) {
        setState(() => signingOut = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Déconnexion impossible. Réessayez.')),
        );
      }
    }
  }

  String date(DateTime? value) => value == null
      ? 'Indisponible'
      : '${value.day.toString().padLeft(2, '0')}/${value.month.toString().padLeft(2, '0')}/${value.year} (UTC)';
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Mon compte'),
      actions: [
        IconButton(
          tooltip: 'Actualiser le compte',
          onPressed: refresh,
          icon: const Icon(Icons.refresh),
        ),
      ],
    ),
    body: SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          FutureBuilder<MobileAccount>(
            future: account,
            builder: (context, snapshot) {
              if (snapshot.connectionState != ConnectionState.done)
                return const Center(child: CircularProgressIndicator());
              if (!snapshot.hasData) {
                final error = snapshot.error;
                final expired =
                    error is DioException && error.response?.statusCode == 401;
                return Column(
                  children: [
                    Text(
                      expired
                          ? 'Votre connexion a expiré. Déconnectez cette application, puis reconnectez-la.'
                          : 'Compte indisponible. Vérifiez votre connexion et réessayez.',
                    ),
                    TextButton(
                      onPressed: refresh,
                      child: const Text('Réessayer'),
                    ),
                  ],
                );
              }
              final a = snapshot.data!;
              const statuses = {
                'ACTIVE': 'Actif',
                'TRIALING': 'Essai',
                'PAST_DUE': 'Paiement en attente',
                'CANCELED': 'Résilié',
                'SUSPENDED': 'Suspendu',
              };
              return Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Card(
                    child: ListTile(
                      leading: const Icon(Icons.person_outline),
                      title: Text(a.name),
                      subtitle: Text(a.email),
                    ),
                  ),
                  if (a.suspended)
                    const Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Text(
                          'Compte suspendu. Les fonctions protégées sont indisponibles.',
                        ),
                      ),
                    ),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            a.plan == 'DISCOVERY'
                                ? 'Découverte'
                                : a.plan == 'PRO'
                                ? 'Pro'
                                : a.plan == 'EXPERT'
                                ? 'Expert / Trader+'
                                : a.plan,
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          Text(statuses[a.status] ?? a.status),
                          if (a.periodEnd != null)
                            Text(
                              '${a.cancelAtEnd ? 'Fin prévue' : 'Prochaine échéance'} : ${date(a.periodEnd)}',
                            ),
                        ],
                      ),
                    ),
                  ),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Analyses IA',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          Text(
                            a.limit == null
                                ? '${a.used} utilisées · sans limite'
                                : '${a.used} / ${a.limit} utilisées · ${a.remaining} restantes',
                          ),
                          if (a.limit != null && a.limit! > 0)
                            Padding(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              child: LinearProgressIndicator(
                                value: (a.used / a.limit!).clamp(0.0, 1.0),
                                semanticsLabel: 'Quota IA utilisé',
                              ),
                            ),
                          Text('Renouvellement : ${date(a.resetAt)}'),
                          const Text(
                            'Le quota est partagé avec votre compte web. Aucun dépassement facturé automatiquement.',
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.all(12),
                    child: Text(
                      'Les achats dans l’application ne sont pas encore disponibles.',
                    ),
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: 20),
          OutlinedButton.icon(
            onPressed: signingOut ? null : signOut,
            icon: const Icon(Icons.logout),
            label: Text(
              signingOut ? 'Déconnexion…' : 'Déconnecter cet appareil',
            ),
          ),
          const Text(
            'La déconnexion efface le jeton enregistré sur cet appareil. Les autres sessions restent actives.',
          ),
        ],
      ),
    ),
  );
}
