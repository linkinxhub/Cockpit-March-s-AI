import 'package:flutter/material.dart';
import 'features/auth/presentation/mobile_connection_gate.dart';
import 'theme/cockpit_theme.dart';

const apiBaseUrl = String.fromEnvironment('API_BASE_URL');
void main() {
  final uri = Uri.tryParse(apiBaseUrl);
  final valid = uri != null && uri.scheme == 'https' && uri.host.isNotEmpty && uri.userInfo.isEmpty && uri.query.isEmpty && uri.fragment.isEmpty;
  runApp(valid ? const MobileConnectionGate(apiBaseUrl: apiBaseUrl) : MaterialApp(theme: CockpitTheme.dark, home: const Scaffold(body: SafeArea(child: Center(child: Padding(padding: EdgeInsets.all(24), child: Text('Cette version ne dispose pas encore de son adresse de service. Contactez l’équipe du projet.')))))));
}
