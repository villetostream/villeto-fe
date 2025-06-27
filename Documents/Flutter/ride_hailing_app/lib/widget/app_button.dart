import 'package:flutter/material.dart';

import '../res/colors.dart';
import 'loading_widget.dart';

class AppButton extends StatelessWidget {
  const AppButton(
      {super.key,
      this.text = "text",
      this.width,
      required this.onTap,
      this.height,
      this.fontSize,
      this.textColor,
      this.bgColor,
      this.radius,
      this.padding,
      this.isDisabled = false,
      this.borderColor = RidingAppColors.activeColor,
      this.textWidget,
      this.fontWeight = FontWeight.w400,
      this.loading = false,
      this.centerText = false});
  const AppButton.grey({
    super.key,
    this.text = "text",
    this.width,
    required this.onTap,
    this.height,
    this.fontSize,
    this.padding,
    this.radius,
    this.textColor = RidingAppColors.activeColor,
    this.isDisabled = false,
    this.bgColor,
    this.borderColor = RidingAppColors.activeColor,
    this.textWidget,
    this.fontWeight = FontWeight.w400,
    this.loading = false,
    this.centerText = false,
  });
  final Color? textColor;
  final Color? bgColor;
  final Color borderColor;
  final String? text;
  final Widget? textWidget;
  final double? width;
  final double? fontSize, radius;
  final FontWeight? fontWeight;
  final EdgeInsets? padding;
  final double? height;
  final void Function()? onTap;
  final bool isDisabled;
  final bool loading;
  final bool centerText;
  @override
  Widget build(BuildContext context) {
    final isDarkMode =
        MediaQuery.of(context).platformBrightness == Brightness.dark;
    return GestureDetector(
      onTap: isDisabled
          ? null
          : loading
              ? null
              : onTap,
      child: Container(
        padding: padding ?? const EdgeInsets.symmetric(horizontal: 10),
        decoration: BoxDecoration(
          border: Border.all(
            width: bgColor != null ? 1 : 0,
            color: bgColor == null ? borderColor : borderColor,
          ),
          borderRadius: BorderRadius.circular(radius ?? 4),
          color: isDisabled
              ? RidingAppColors.activeColor.withOpacity(0.2)
              : bgColor ?? RidingAppColors.activeColor,
        ),
        height: height ?? 40,
        width: width,
        child: loading
            ? LoadingWidget(
                color: bgColor != null
                    ? RidingAppColors.primaryColor
                    : RidingAppColors.white,
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: textWidget != null
                    ? centerText == true
                        ? MainAxisAlignment.center
                        : MainAxisAlignment.start
                    : MainAxisAlignment.center,
                children: [
                  textWidget ?? const SizedBox.shrink(),
                  textWidget != null
                      ? Text(
                          text!,
                          style: TextStyle(
                            fontSize: fontSize ?? 16,
                            color: textColor ??
                                (isDarkMode
                                    ? isDisabled
                                        ? RidingAppColors.white.withOpacity(0.5)
                                        : RidingAppColors.white
                                    : bgColor != null
                                        ? RidingAppColors.activeColor
                                        : RidingAppColors.white),
                            fontWeight: FontWeight.w500,
                          ),
                        )
                      : Center(
                          child: Text(
                            text!,
                            style: TextStyle(
                              fontSize: fontSize ?? 16,
                              color: textColor ??
                                  (isDarkMode
                                      ? isDisabled
                                          ? RidingAppColors.white
                                              .withOpacity(0.5)
                                          : RidingAppColors.white
                                      : bgColor != null
                                          ? RidingAppColors.activeColor
                                          : RidingAppColors.white),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                ],
              ),
      ),
    );
  }
}

Divider buildDivider(BuildContext context, {Color? color}) {
  return Divider(
    thickness: 1,
    color: color ?? Theme.of(context).dividerColor,
    // height: 0,
  );
}
