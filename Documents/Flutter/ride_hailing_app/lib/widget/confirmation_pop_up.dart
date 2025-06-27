import 'package:flutter/material.dart';

import '../res/colors.dart';
import '../res/gap.dart';
import 'app_button.dart';

class RidingAppConfirmationPopUp extends StatelessWidget {
  final String? popupTitle;
  final String? popupDescription;
  final VoidCallback? onPressedYes;
  final VoidCallback? onPressedNo;
  final String? firstButtonText;
  final String? secondButtonText;
  final Color? yesButtonColor;
  final bool usePop;

  const RidingAppConfirmationPopUp(
      {required this.popupTitle,
      required this.popupDescription,
      required this.onPressedYes,
      required this.onPressedNo,
      this.firstButtonText,
      this.secondButtonText,
      this.yesButtonColor,
      this.usePop = false,
      super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      // backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      backgroundColor: Theme.of(context).bottomSheetTheme.backgroundColor,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(10.0))),
      title: Center(
        child: Text(popupTitle ?? "",
            style: Theme.of(context).textTheme.bodyLarge!.copyWith(
                  fontWeight: FontWeight.w600,
                  color: Theme.of(context).primaryColor,
                )),
      ),
      titleTextStyle: Theme.of(context).textTheme.headlineSmall,
      content: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          Text(popupDescription!,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                    fontWeight: FontWeight.w500,
                    color: Theme.of(context).primaryColor,
                  )),
          addVerticalSpacing(20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Flexible(
                child: AppButton(
                  width: MediaQuery.of(context).size.width / 1.8,
                  onTap: () {
                    onPressedYes!();
                    if (usePop) {
                      Navigator.of(context).pop();
                    }
                  },
                  text: firstButtonText ?? "Yes",
                  bgColor: yesButtonColor,
                ),
              ),
              addHorizontalSpacing(6),
              Flexible(
                child: AppButton(
                    width: MediaQuery.of(context).size.width / 1.8,
                    onTap: () {
                      onPressedNo!();
                      if (usePop) {
                        Navigator.of(context).pop();
                      }
                    },
                    text: secondButtonText ?? "No",
                    bgColor: RidingAppColors.primaryColor.withOpacity(0.3),
                    borderColor: RidingAppColors.primaryColor.withOpacity(0.3)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
