import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";

import BookingCard from "../components/Booking/BookingCard";
import BookingCountDetails from "../components/Booking/BookingCountDetails";
import { useEffect } from "react";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const Employee = () => {
  const [AllBookingData, setAllBookingData] = useState([]);
  const [AllEmployeeDataCount, setAllEmployeeDataCount] = useState({});
  const isFocused = useIsFocused();

  const [Loading, setLoading] = useState(true);
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  async function getData() {
    try {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const EmployeeCollectionRef = firestore()
        .collection("Users")
        .doc(loggedInUser.uid);
      const EmployeeQuerySnapshot = await EmployeeCollectionRef.get();
      setAllBookingData(EmployeeQuerySnapshot._data.assignedBookings);
      EmployeeCollectionRef.get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const filteredBookings = userData.assignedBookings.filter(
              (booking) => {
                const serviceDate = new Date(booking.latestServiceDate); // Convert string to Date
                return serviceDate >= today && serviceDate < tomorrow;
              }
            );

            console.log("Filtered Bookings:", filteredBookings);
          } else {
            console.log("User not found");
          }
        })
        .catch((error) => {
          console.error("Error getting user document: ", error);
        });
      setLoading(false);

      const vehicleCount = EmployeeQuerySnapshot._data.assignedBookings.length;
      const completedLength =
        EmployeeQuerySnapshot._data.assignedBookings.reduce(
          (accumulator, currentItem) => {
            if (currentItem.status === "Completed") {
              return accumulator + 1;
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
      setLoading(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching documents!",
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
    return () => {};
  }, []);

  useEffect(() => {
    if (isFocused) {
      console.log("Focused");
      getData();
    }
  }, [isFocused]);
  return (
    <View style={styles.Container}>
      <BookingCountDetails AllEmployeeDataCount={AllEmployeeDataCount} />
      <View style={styles.AssignedJobsContainer}>
        <Text style={styles.AssignedJobs}>Assigned Job</Text>
        <BookingCard
          bookingData={AllBookingData}
          employeeData={[]}
          isAdmin={loggedInUser.isAdmin}
          loading={Loading}
        />
      </View>
    </View>
  );
};

export default Employee;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  AssignedJobs: {
    fontSize: height * 0.021,
    color: "#000",
    fontWeight: "600",
    paddingHorizontal: 15,
  },
  AssignedJobsContainer: {
    top: -height * 0.07,
    height: height,
    width: width,
  },
});
