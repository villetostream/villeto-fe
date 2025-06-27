import 'package:flutter/material.dart';

addVerticalSpacing(double height) {
  return SizedBox(
    height: height,
  );
}

addHorizontalSpacing(double width) {
  return SizedBox(
    width: width,
  );
}

/// Spacing extension for widgets using both [verticalSpacing] & [horizontalSpacing]
extension Spacing on num {
  Widget get verticalSpacing => SizedBox(height: toDouble());
  Widget get horizontalSpacing => SizedBox(width: toDouble());
}
