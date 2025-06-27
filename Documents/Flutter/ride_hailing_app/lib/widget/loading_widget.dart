import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'package:ride_hailing_app/res/gap.dart';

import '../../res/colors.dart';

class LoadingWidget extends StatelessWidget {
  const LoadingWidget({
    super.key,
    this.height = 25,
    this.color,
    this.text,
    this.textStyle,
    this.strokeWidth,
  });
  final double height;
  final Color? color;
  final String? text;
  final TextStyle? textStyle;
  final double? strokeWidth;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            height: height,
            width: height,
            child: CupertinoActivityIndicator(
              color: RidingAppColors.primaryColor,
            ),
          ),
          if (text != null) ...[
            5.verticalSpacing,
            Text(
              text!,
              style: textStyle ?? Theme.of(context).textTheme.labelLarge,
            )
          ]
        ],
      ),
    );
  }
}
