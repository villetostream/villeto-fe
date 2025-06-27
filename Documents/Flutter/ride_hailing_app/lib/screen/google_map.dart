import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:ride_hailing_app/widget/custom_location_field.dart';
import 'package:ride_hailing_app/widget/loading_widget.dart';

import '../widget/locations.dart';

// Main widget for displaying Google Map
class GoogleMapFlutter extends StatefulWidget {
  const GoogleMapFlutter({super.key});

  @override
  State<GoogleMapFlutter> createState() => _GoogleMapFlutterState();
}

class _GoogleMapFlutterState extends State<GoogleMapFlutter> {
  late TextEditingController locationController = TextEditingController();
  LatLng myCurrentLocation = const LatLng(28.578382, 81.63359);
  bool isLoading = false;

  Future<void> getLongLat({bool showDialog = false}) async {
    // Position getPosition = await determinePosition();
    await determinePosition().then((value) {
      setState(() {
        isLoading = true;
        myCurrentLocation = LatLng(value.latitude, value.longitude);
      });
      return null;
    }).onError((error, stackTrace) async {
      if (showDialog) {
        final String newError = error.toString();

        if (newError.contains('denied')) {
          await showEnableLocationPopup(context,
              title: "Permission Access",
              description:
                  "Riding App requires permission for location access to function "
                  "while on this page.",
              positiveCallback: Geolocator.openAppSettings);
        } else if (newError.contains('disabled')) {
          await showEnableLocationPopup(context,
              title: "Location Disabled",
              description:
                  'Riding App requires location access for the proper functioning of '
                  'app. Please enable device location.',
              positiveCallback: Geolocator.openLocationSettings);
        }
      }

      // return HelperFunction.showToast(message: error.toString() as String);
    });
  }

  @override
  @override
  void initState() {
    super.initState();
    _updateCurrentLocation();
  }

  Future<void> _updateCurrentLocation() async {
    await getLongLat(showDialog: true);
    setState(() {
      isLoading = false;
    });
  }

  late GoogleMapController googleMapController;
  Set<Marker> markers = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            GoogleMap(
              myLocationButtonEnabled: false,
              fortyFiveDegreeImageryEnabled: true,

              markers: markers,
              // Setting the controller when the map is created
              onMapCreated: (GoogleMapController controller) {
                googleMapController = controller;
              },
              // Initial camera position of the map
              initialCameraPosition: CameraPosition(
                target: myCurrentLocation,
                zoom: 14,
              ),
            ),
            Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: CustomLocationField(
                    locationController: locationController)),
            if (isLoading)
              Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: BackdropFilter(
                    filter: ImageFilter.blur(
                      sigmaX: 2.0,
                      sigmaY: 2.0,
                    ),
                    child: Container(
                      color: Colors.black.withOpacity(0.3),
                      child: Center(child: LoadingWidget()),
                    ),
                  ))
          ],
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.startFloat,
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.white,
        child: const Icon(
          Icons.my_location,
          size: 30,
        ),
        onPressed: () async {
          // Getting the current position of the user
          await _updateCurrentLocation();

          // Animating the camera to the user's current position
          googleMapController.animateCamera(
            CameraUpdate.newCameraPosition(
              CameraPosition(
                target: myCurrentLocation,
                zoom: 14,
              ),
            ),
          );

          // Clearing existing markers
          markers.clear();
          // Adding a new marker at the user's current position
          markers.add(
            Marker(
              markerId: const MarkerId('currentLocation'),
              position: myCurrentLocation,
            ),
          );

          // Refreshing the state to update the UI with new markers
          setState(() {});
        },
      ),
    );
  }

  // Function to determine the user's current position
}
