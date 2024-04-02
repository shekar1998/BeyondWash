import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Image, Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { sendPushNotfication } from "./../Booking/BookingListener";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const SubscribeSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [Loading, setLoading] = useState(false);
  const reducer = useSelector((state) => state.globalStore);
  const [modalPrice, setModalPrice] = useState(0);

  useEffect(() => {
    performAsyncAction();
    handleSaving();
    switch (reducer.selectedCarType?.VehicleBrand.toLowerCase()) {
      case "hatchback": {
        setModalPrice(500);
        break;
      }
      case "sedan": {
        setModalPrice(600);
        break;
      }
      case "compact suv": {
        setModalPrice(700);
        break;
      }
      case "suv": {
        setModalPrice(800);
        break;
      }
      case "luxury": {
        setModalPrice(900);
        break;
      }
      default:
        setModalPrice(900);
        break;
    }
    // handleSaving();

    return () => {
      StatusBar.setBarStyle("default");
    };
  }, []);

  const handleSaving = async () => {
    let usersList;
    try {
      usersList = await firestore()
        .collection("Users")
        .where("isAdmin", "==", true)
        .get();
    } catch (error) {
      console.log("Admin", err);
    }

    console.log("Users", {
      AddonService: route?.params?.bookingDetails?.AddOnService,
    });

    try {
      await firestore()
        .collection("Bookings")
        .add({
          AddOnService: route?.params?.bookingDetails?.AddOnService,
          Address: reducer?.LoggedInUserData?.address,
          Coordinates: reducer?.LoggedInUserData?.address.coordinates,
          BookingDate: new Date().toString(),
          CarType: reducer.selectedCarType,
          CurrentScheduledDate:
            route?.params?.bookingDetails?.CurrentScheduledDate,
          Frequency: route?.params?.bookingDetails?.Frequency,
          FutureScheduledDate:
            route?.params?.bookingDetails?.FutureScheduledDate,
          OriginalPrice: route?.params?.bookingDetails?.OriginalPrice,
          Price: modalPrice - (modalPrice / 100) * 10,
          StartsFrom: route?.params?.bookingDetails?.StartsFrom,
          Status: route?.params?.bookingDetails?.Status,
          UserEmail: reducer?.LoggedInUserData?.email,
          DisplayName: reducer?.LoggedInUserData?.displayName,
        })
        .then(async (res) => {
          console.log("res", res);
          await firestore()
            .collection("Users")
            .doc(reducer.LoggedInUserData.uid)
            .update({
              lastBookingDate: new Date(),
            })
            .catch((err) => {
              console.log("Users", err);
            });
          sendPushNotfication(
            reducer.LoggedInUserData.email,
            new Date(),
            usersList
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log("Bookings", err);
        });
    } catch (error) {
      console.log("Bookings", err);
    }
  };

  const performAsyncAction = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(300);
    StatusBar.setBarStyle("dark-content");
  };
  const onPress = () => {
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.successCheck}>
      {Loading ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <View style={styles.successCheck}>
          <Image
            source={require("../../assets/gifs/SuccessfullyDone.gif")}
            style={styles.successIcon}
          />
          <Text style={styles.successText}>
            Payment of{" "}
            <Text
              style={[
                styles.successText,
                { color: "green", fontWeight: "700" },
              ]}
            >
              &#x20B9;{modalPrice - (modalPrice / 100) * 10}
            </Text>
            {" Was Success"}
          </Text>
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
          <Image
            style={styles.carImage}
            source={require("../../assets/images/Car_Wash_Daily.png")}
          />
        </View>
      )}
    </View>
  );
};

export default SubscribeSuccess;

const styles = StyleSheet.create({
  successCheck: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    marginTop: 20,
    width: width * 0.63,
    height: height * 0.23,
  },
  successText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "#000",
    fontSize: 28,
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2c65e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#2c65e0",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    alignSelf: "center",
    marginTop: 30,
    width: width * 0.43,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  carImage: {
    resizeMode: "contain",
    width: width * 0.9,
    height: height * 0.4,
    top: height / 50,
    shadowColor: "#2c65e0",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
});
