import 'package:flutter/material.dart';

extension AppTheme on BuildContext {
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
  bool get isDarkMode {
    final brightness = theme.brightness;

    return brightness == Brightness.dark;
  }
}
