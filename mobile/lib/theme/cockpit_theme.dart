import 'package:flutter/material.dart';
class CockpitTheme {
 static const background=Color(0xFF0A131C),panel=Color(0xFF10232E),accent=Color(0xFFB9F86B);
 static ThemeData get dark=>ThemeData(brightness:Brightness.dark,useMaterial3:true,scaffoldBackgroundColor:background,colorScheme:ColorScheme.fromSeed(seedColor:accent,brightness:Brightness.dark,surface:panel,primary:accent),appBarTheme:const AppBarTheme(backgroundColor:background,foregroundColor:Colors.white),navigationBarTheme:const NavigationBarThemeData(backgroundColor:background,indicatorColor:Color(0xFF294632)),inputDecorationTheme:const InputDecorationTheme(border:OutlineInputBorder(),filled:true,fillColor:panel));
}
