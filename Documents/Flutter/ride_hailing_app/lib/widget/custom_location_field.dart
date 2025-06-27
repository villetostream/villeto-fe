import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../res/network.dart';
import '../res/utils.dart';
import 'locations.dart';
import 'text_field.dart';

class CustomLocationField extends StatefulWidget {
  final TextEditingController locationController;
  const CustomLocationField({super.key, required this.locationController});

  @override
  State<CustomLocationField> createState() => _CustomLocationFieldState();
}

class _CustomLocationFieldState extends State<CustomLocationField> {
  final String? apiKey = dotenv.env["LOCATION_API_KEY"];
  List<AutocompletePrediction> placePredictions = [];

  void placeAutoComplete(String query) async {
    Uri uri =
        Uri.https("maps.googleapis.com", "maps/api/place/autocomplete/json", {
      "input": query,
      "key": apiKey,
    });
    String? response = await NetworkUtility.fetchUrl(uri);

    if (response != null) {
      PlaceAutocompleteResponse result =
          PlaceAutocompleteResponse.parseAutocompleteResult(response);

      if (result.predictions != null) {
        setState(() {
          placePredictions = result.predictions!;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(mainAxisAlignment: MainAxisAlignment.start, children: [
        buildAuthTextField(
          context,
          label: 'Location',
          hintText: 'e.g. Exter, United Kingdom',
          controller: widget.locationController,
          onChanged: (value) {
            placeAutoComplete(value);
          },
        ),
        if (placePredictions.isNotEmpty) ...[
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: placePredictions.length,
            itemBuilder: (context, index) => LocationListTile(
              press: () {
                setState(() {
                  widget.locationController.text =
                      placePredictions[index].description!;
                  placePredictions = [];
                });
              },
              location: placePredictions[index].description!,
            ),
          ),
        ],
      ]),
    );
  }
}

Widget buildAuthTextField(
  BuildContext context, {
  required String label,
  required String hintText,
  void Function(String)? onChanged,
  TextEditingController? controller,
  Function(String?)? onSaved,
  Function()? onTap,
  bool enabled = true,
  isDescription = false,
  bool showBorder = true,
  int? minLines,
  int? maxLength,
  int? maxLines,
  TextInputAction? textInputAction = TextInputAction.done,
  TextInputType? keyboardType,
}) {
  return RidingAppTextField(
    onTap: onTap,
    label: label,
    labelStyle: _labelStyle(context),
    hintText: hintText,
    hintStyle: _hintStyle(context),
    onChanged: onChanged,
    controller: controller,
    enabled: enabled,
    minLines: minLines,
    maxLength: maxLength,
    maxLines: maxLines,
    textInputAction: textInputAction,
    keyboardType: keyboardType,
    showBorder: showBorder,
    isDescription: isDescription,
    onSaved: (value) {
      dismissKeyboard();
    },
  );
}

TextStyle? _labelStyle(BuildContext context) {
  return Theme.of(context)
      .textTheme
      .bodyMedium
      ?.copyWith(fontWeight: FontWeight.w400, fontSize: 16);
}

TextStyle? _hintStyle(BuildContext context) {
  return Theme.of(context)
      .textTheme
      .bodyMedium
      ?.copyWith(fontWeight: FontWeight.w400, fontSize: 16);
}
