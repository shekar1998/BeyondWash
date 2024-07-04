import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import BookingCountDetails from "../components/Booking/BookingCountDetails";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import Animation from "../components/Animation";

const { height } = Dimensions.get("window");

let details = [
  {
    text: "Booking Details",
    navigationFileName: "AdminBookingDetails",
    imageUrl:
      "https://images.unsplash.com/photo-1548152461-2368a4c4c350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGJsdWUlMjBjYXIlMjB3YXNofGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  },
  {
    text: "User details",
    navigationFileName: "ContactDetails",
    imageUrl:
      "https://images.unsplash.com/photo-1608506375591-b90e1f955e4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    text: "User Feedback",
    navigationFileName: "FeedbackDetails",
    imageUrl:
      "https://images.pexels.com/photos/6873008/pexels-photo-6873008.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];
const Admin = () => {
  const [AllBookingData, setAllBookingData] = useState([]);
  const [AllEmployeeData, setAllEmployeeData] = useState([]);
  const [AllUserFeedback, setAllUserFeedback] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [AllEmployeeDataCount, setAllEmployeeDataCount] = useState({});

  const navigation = useNavigation();

  const handleClick = (navigationFileName) => {
    navigation.navigate(navigationFileName, {
      AllBookingData: AllBookingData,
      AllEmployeeData: AllEmployeeData,
      Loading: Loading,
      FeedbackDetails: AllUserFeedback,
    });
  };

  async function getData() {
    try {
      const bookingsCollectionRef = firestore().collection("Bookings");
      const querySnapshot = await bookingsCollectionRef.get();
      const bookings = querySnapshot.docs.map((doc) =>
        Object.assign(doc.data(), {
          id: doc.id,
        })
      );
      const vehicleCount = querySnapshot.docs.length;
      let completed = 0;
      const completedLength = await querySnapshot.docs.reduce(
        (accumulator, currentItem) => {
          console.log("Completed Status =>", currentItem._data.Status);
          if (currentItem._data.Status === "Completed") {
            return completed + 1;
          }
          return accumulator;
        },
        0
      );
      setAllEmployeeDataCount({
        vehicleCount,
        completedLength,
        pending: vehicleCount - completedLength,
      });
      const EmployeeCollectionRef = firestore()
        .collection("Users")
        .where("isEmployee", "==", true);
      const EmployeeQuerySnapshot = await EmployeeCollectionRef.get();
      const Employee = EmployeeQuerySnapshot.docs.map((doc) => {
        return {
          label: doc.data().displayName,
          value: doc.data().uid,
          email: doc.data().email,
        };
      });
      const userFeedbackDetails = firestore().collection("userFeedback");
      const userFeedbackDetailsSnapshot = await userFeedbackDetails.get();
      const userFeedback = userFeedbackDetailsSnapshot.docs.map((doc) => {
        console.log(doc.data().date);
        return {
          email: doc.data().email,
          phoneNumer: doc.data().phoneNumer,
          image: doc.data().image,
          type: doc.data().type,
          comment: doc.data().comment,
          date: doc.data().date,
        };
      });
      setAllUserFeedback(userFeedback);
      setAllBookingData(bookings);
      setAllEmployeeData(Employee);
      setLoading(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching documents",
        text2: error,
        visibilityTime: 5000,
        style: {
          backgroundColor: "red",
        },
      });
      throw error;
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <BookingCountDetails AllEmployeeDataCount={AllEmployeeDataCount} />
      {Loading ? (
        <Animation />
      ) : (
        <View style={styles.OtherDetails}>
          <Text style={styles.DetailsText}>Details Screen</Text>
          {details.map((data) => (
            <TouchableOpacity
              key={data.navigationFileName}
              onPress={() => handleClick(data.navigationFileName)}
              activeOpacity={0.9}
              style={styles.NavigationContainer}
            >
              <ImageBackground
                source={{
                  uri: data.imageUrl,
                }} // Replace with your image source
                style={styles.backgroundImage}
              >
                <View style={styles.overlay}>
                  <Text style={styles.text}>{data.text}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  OtherDetails: {
    top: -height * 0.079,
    paddingHorizontal: 10,
  },
  DetailsText: {
    color: "#000",
    fontSize: height * 0.02,
    textAlign: "auto",
    fontWeight: "600",
  },
  NavigationContainer: {
    width: "100%",
    height: "20%",
    overflow: "hidden",
    borderRadius: 15,
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark opacity background color
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "300",
  },
});
