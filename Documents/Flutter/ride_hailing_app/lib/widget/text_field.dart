import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:sizer/sizer.dart';

import '../res/colors.dart';
import '../res/ui_constants.dart';

class RidingAppTextField extends StatefulWidget {
  final String? label;
  final int? minLines;
  final TextInputType? keyboardType;
  final bool obscureText;
  final String? hintText;
  final List<TextInputFormatter>? formatter;
  final TextCapitalization? textCapitalization;
  final Function(String)? onChanged;
  final Function(String?)? onSaved;
  final Function()? onTap;
  final Function()? onFieldTap;
  final int? maxLength;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final bool shouldReadOnly;
  final double? minWidth;
  final Widget? suffixIcon;
  final Widget? prefixIcon;
  final TextStyle? labelStyle;
  final bool enabled, showSuggestions;
  final TextStyle? hintStyle;
  final FocusNode? focusNode;
  final int? maxLines;
  final TextInputAction? textInputAction;
  final bool isDescription;
  final EdgeInsets? padding;
  final double? height;
  final TextAlign? textAlign;
  final bool showPrimaryBorder;
  final bool showBorder;

  /// formats the textfeild to a password version
  final bool isPassword;

  const RidingAppTextField(
      {super.key,
      this.label,
      this.minLines,
      this.onChanged,
      this.onTap,
      this.keyboardType,
      this.formatter,
      this.onSaved,
      this.obscureText = false,
      this.showSuggestions = false,
      this.hintText,
      this.maxLength,
      this.controller,
      this.validator,
      this.textCapitalization,
      this.shouldReadOnly = false,
      trailing,
      this.suffixIcon,
      this.enabled = true,
      this.minWidth,
      this.prefixIcon,
      this.labelStyle,
      this.hintStyle,
      this.focusNode,
      this.isPassword = false,
      this.maxLines = 1,
      this.textInputAction,
      this.padding,
      this.height,
      this.textAlign,
      this.showBorder = true,
      this.showPrimaryBorder = false,
      this.isDescription = false,
      this.onFieldTap});

  @override
  State<RidingAppTextField> createState() => _VWidgetsLoginTextFieldState();
}

class _VWidgetsLoginTextFieldState extends State<RidingAppTextField> {
  FocusNode? focusNodeZZZ;
  String? errorMessage;

  late final controller = widget.controller ?? TextEditingController();

  late bool obscureText = widget.isPassword;

  @override
  void initState() {
    if (widget.focusNode == null) {
      focusNodeZZZ = FocusNode();
      focusNodeZZZ?.addListener(addListenerToFocusNode);
      focusNodeZZZ?.addListener(() {
        if (!focusNodeZZZ!.hasFocus) {
          // Optionally hide the keyboard if focus is lost
          FocusScope.of(context).unfocus();
        }
      });
    } else {
      widget.focusNode?.addListener(addListenerToFocusNodeWidget);
    }
    super.initState();
  }

  void addListenerToFocusNode() async {
    setState(() {});
  }

  void addListenerToFocusNodeWidget() async {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    bool showGradient =
        widget.focusNode?.hasFocus ?? focusNodeZZZ?.hasFocus ?? false;
    return Column(children: [
      Container(
        padding: const EdgeInsets.all(2),
        decoration: BoxDecoration(
          borderRadius: widget.showBorder ? BorderRadius.circular(8) : null,
        ),
        constraints: BoxConstraints(
          minHeight: widget.minLines != null
              ? widget.minLines! * 20.0
              : widget.height ?? 50.0,
          maxHeight:
              widget.minLines != null ? double.infinity : widget.height ?? 50.0,
        ),
        child: GestureDetector(
          onTap: widget.onTap,
          child: Container(
            // height: maxLength != null ? 6.h : 6.h,
            width: widget.minWidth ?? 100.0.w,

            decoration: BoxDecoration(
              borderRadius: widget.showBorder ? BorderRadius.circular(8) : null,
              color: Theme.of(context).scaffoldBackgroundColor,
            ),
            child: TextFormField(
              textInputAction: widget.textInputAction,
              autocorrect: widget.showSuggestions,
              textAlign: widget.textAlign ?? TextAlign.start,
              enableSuggestions: widget.showSuggestions,
              minLines: widget.minLines ?? 1,
              controller: widget.controller,
              maxLength: widget.maxLength,
              onTap: widget.onFieldTap,
              maxLines: widget.maxLines,
              onSaved: widget.onSaved,
              enabled: widget.enabled,
              cursorHeight: 15,
              textCapitalization:
                  widget.textCapitalization ?? TextCapitalization.none,

              focusNode: widget.focusNode ?? focusNodeZZZ,
              onChanged: (text) {
                // Remove profanity automatically
                setState(() {
                  controller.text = text;
                  controller.selection = TextSelection.fromPosition(
                    TextPosition(offset: controller.text.length),
                  );
                });

                if (widget.onChanged != null) widget.onChanged!(text);
              },
              cursorColor: Theme.of(context).primaryColor,
              keyboardType: widget.keyboardType,
              obscureText: obscureText,
              obscuringCharacter: '*',
              inputFormatters: widget.isDescription
                  ? []
                  : widget.formatter ??
                      [FilteringTextInputFormatter.singleLineFormatter],
              // onFieldSubmitted: (value) {
              //   if (widget.textInputAction != TextInputAction.newline) {
              //     widget.focusNode?.unfocus();
              //     focusNodeZZZ?.unfocus();
              //   }
              // },
              maxLengthEnforcement: MaxLengthEnforcement.enforced,
              autovalidateMode: AutovalidateMode.onUserInteraction,
              // validator: widget.validator,
              validator: (val) {
                if (widget.validator == null) return;
                if (val == null || val.isEmpty) {
                  errorMessage = errorMessage =
                      widget.validator != null ? widget.validator!(val) : '';
                } else {
                  errorMessage = widget.validator != null
                      ? widget.validator!(val)
                      : 'Enter text';
                }

                WidgetsFlutterBinding.ensureInitialized()
                    .addPostFrameCallback((_) {
                  setState(() {});
                });
                return null;
              },
              style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                    fontSize: 14,
                  ),
              readOnly: widget.shouldReadOnly,
              decoration: UIConstants.instance
                  .inputDecoration(
                      labelText: widget.label,
                      labelStyle: widget.labelStyle,
                      context,
                      hasFocus: widget.focusNode?.hasFocus ??
                          focusNodeZZZ?.hasFocus ??
                          false,
                      hintText: widget.hintText,
                      showBorder: widget.showBorder,
                      showPrimaryBorder: widget.showPrimaryBorder,
                      suffixIcon: widget.suffixIcon,
                      contentPadding: widget.padding)
                  .copyWith(
                    focusedBorder: widget.showBorder
                        ? showGradient
                            ? OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide(
                                    color: RidingAppColors.primaryColor,
                                    width: 1.25),
                              )
                            : null
                        : InputBorder.none,
                    suffixIcon: !widget.isPassword
                        ? widget.suffixIcon
                        : IconButton(
                            padding: EdgeInsets.zero,
                            onPressed: () =>
                                setState(() => obscureText = !obscureText),
                            icon: Icon(
                              obscureText
                                  ? Icons.visibility_rounded
                                  : Icons.visibility_off_rounded,
                            ),
                          ),
                  ),
            ),
          ),
        ),
      ),
      if (errorMessage != null && errorMessage!.isNotEmpty)
        Align(
          alignment: Alignment.centerLeft,
          child: Text(
            "$errorMessage",
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.error,
                ),
          ),
        )
    ]);
  }
}

class UpperCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    return TextEditingValue(
      text: capitalize(newValue.text),
      selection: newValue.selection,
    );
  }
}

String capitalize(String value) {
  if (value.trim().isEmpty) return "";

  // Split the input into words
  List<String> words = value.split(' ');

  // Process each word
  for (int i = 0; i < words.length; i++) {
    words[i] = _capitalizeWord(words[i]);
  }

  // Join the words back into a single string
  return words.join(' ');
}

String _capitalizeWord(String word) {
  // If the word is empty, return it as is
  if (word.isEmpty) return word;

  // Capitalize the first letter
  String result = word[0].toUpperCase();
  int capCount = 1;

  // Process the rest of the word
  for (int i = 1; i < word.length; i++) {
    // If we have less than 3 consecutive capitalized letters, capitalize this letter
    if (capCount < 2 && word[i].toUpperCase() == word[i]) {
      result += word[i].toUpperCase();
      capCount++;
    } else {
      result += word[i].toLowerCase();
    }
  }

  return result;
}
