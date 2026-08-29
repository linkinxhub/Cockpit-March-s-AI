import 'package:flutter/widgets.dart';
import 'features/auth/presentation/mobile_connection_gate.dart';

const apiBaseUrl=String.fromEnvironment('API_BASE_URL',defaultValue:'http://localhost:3000');

void main()=>runApp(const MobileConnectionGate(apiBaseUrl:apiBaseUrl));
