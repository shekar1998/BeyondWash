import React, { useState, useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Dimensions,
  Linking,
  SafeAreaView,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, { Marker } from "react-native-maps";
import ActionSheetAddAddr from "./ActionSheetAddAddr";
import { useDispatch } from "react-redux";
import { selectedMarkerLocation } from "../../hooks/Slice";
import { Platform } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_KEY } from "@env";
import { useRef } from "react";

const { width, height } = Dimensions.get("window");

const requestLocationPermission = async () => {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === "granted") {
        return true;
      } else {
        console.log("You cannot use Geolocation");
        return false;
      }
    } else if (Platform.OS === "ios") {
      const permission = await Geolocation.requestAuthorization("whenInUse"); // or 'always'

      if (permission === "granted") {
        console.log("Location permission granted");
        // Proceed with using geolocation services
        return true;
      } else {
        console.log("Location permission denied");
        return false;
      }
    }
  } catch (err) {
    console.log("requestLocationPermission => ", err);
    return false;
  }
};

// Geocoder.init('AIzaSyA5h89xWUf3JA7Diag87KZ__4PCHyTNQpo'); // Replace 'YOUR_API_KEY' with your actual API key

const App = () => {
  const [locationLoded, setlocationLoded] = useState(false);
  const [location, setLocation] = useState();
  const [Markercoordinate, setMarkercoordinate] = useState();
  const [showAddress, setShowAdress] = useState(false);

  const dispatch = useDispatch();

  let regionData = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
    latitudeDelta: 0.0148089182622968,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    getLocation();
    console.log(API_KEY);
  }, []);

  const getLocation = () => {
    const result = requestLocationPermission();
    result
      .then((res) => {
        if (res) {
          Geolocation.getCurrentPosition(
            (position) => {
              setlocationLoded(true);
              setLocation(position);
              setMarkercoordinate({
                latitude: position?.coords.latitude,
                longitude: position?.coords.longitude,
              });
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
              setlocationLoded(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      })
      .catch((err) => console.log("err", err));
  };

  const [selectedPoi, setSelectedPoi] = useState(null);

  const handlePoiClick = (event) => {
    setMarkercoordinate(event.nativeEvent.coordinate);
    setSelectedPoi(event.nativeEvent.coordinate);
    dispatch(
      selectedMarkerLocation(
        event.nativeEvent.name.replace(/\.{3,}|\s{3,}/g, "")
      )
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(0, 0, 0, 0.7)",
          "rgba(0, 0, 0, 0.4)",
          "rgba(0, 0, 0, 0.2)",
          "rgba(0, 0, 0, 0.1)",
          "transparent",
        ]}
        style={[styles.gradient, styles.gradientTop]}
      />
      <SafeAreaView>
        <GooglePlacesAutocomplete
          placeholder="Type a place"
          onPress={(data, details = null) => console.log(data, details)}
          query={{ key: API_KEY, components: "country:in" }}
          fetchDetails={true}
          onFail={(error) => console.log(error)}
          onNotFound={() => console.log("no results")}
          textInputProps={{
            onFocus: () => setShowAdress(!showAddress),
          }}
          styles={{
            textInput: {
              color: "#000",
            },
            container: {
              flex: 0,
              width: width - 40,
              marginHorizontal: 20,
              top: height * 0.05,
              zIndex: 10,
            },
            description: {
              color: "#000",
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: "#3caf50",
            },
          }}
        />
      </SafeAreaView>
      <View style={[styles.content, { top: -400 }]}>
        {locationLoded ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapStyle}
              region={regionData}
              showsUserLocation={true}
              mapType="standard"
              loadingEnabled={true}
              zoomTapEnabled={true}
              zoomEnabled={true}
              showsCompass={true}
              toolbarEnabled={true}
              pitchEnabled={true}
              showsMyLocationButton={true}
              paddingAdjustmentBehavior="automatic"
              showsIndoorLevelPicker={true}
              onPoiClick={handlePoiClick}
              mapPadding={{
                top: 85,
                bottom: 220,
              }}
              showsBuildings={true}
              showsPointsOfInterest={true}
            >
              {selectedPoi && (
                <Marker style={styles.pinStyle} coordinate={selectedPoi} />
              )}
            </MapView>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      {!showAddress && (
        <View style={styles.AddressSheet}>
          <ActionSheetAddAddr location={Markercoordinate} />
        </View>
      )}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(0, 0, 0, 0.1)",
          "rgba(0, 0, 0, 0.2)",
          "rgba(0, 0, 0, 0.4)",
          "rgba(0, 0, 0, 0.7)",
        ]}
        style={[styles.gradient, styles.gradientBottom]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1, // Add this line to ensure the gradient is visible
  },
  gradientTop: {
    top: 0,
    height: height / 8,
  },
  gradientBottom: {
    bottom: 0,
    height: 0, // Add this line to match the height of the top gradient
  },
  mapContainer: {
    flex: 1,
    top: -200,
    zIndex: -1,
  },
  mapStyle: {
    width: width,
    height: height / 1.2,
  },
  pinStyle: {
    width: 4,
    height: 45,
    backgroundColor: "red",
    // top: -(height / 1.879),
    // right: -(width / 2.222),
  },
});

export default App;
