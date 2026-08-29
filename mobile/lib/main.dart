import 'package:flutter/widgets.dart';
import 'app_shell.dart';

const apiBaseUrl=String.fromEnvironment('API_BASE_URL',defaultValue:'http://localhost:3000');

void main()=>runApp(const CockpitMarketsApp(apiBaseUrl:apiBaseUrl));
