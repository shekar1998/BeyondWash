import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Image,
  Text,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import { userBookingsReducer } from "../../hooks/Slice";
import BookingCard from "../components/Booking/BookingCard";
import { useRoute } from "@react-navigation/native";
import Animation from "../components/Animation";

const { width, height } = Dimensions.get("window");
const ServiceHistory = () => {
  const [UserBookings, setUserBookings] = useState([]);
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const route = useRoute(); // Use useRoute to access the route object

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const snapshot = await firestore()
          .collection("Bookings")
          .where("UserEmail", "==", route.params.email)
          .get();
        const bookings = snapshot.docs.map((doc) =>
          Object.assign(doc.data(), {
            id: doc.id,
          })
        );
        console.log("Bookinga => ", bookings.length);
        setUserBookings(bookings);
        dispatch(userBookingsReducer(bookings));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserBookings();
  }, []);

  useEffect(() => {
    performAsyncAction();
    return () => {
      StatusBar.setBarStyle("default");
    };
  }, []);

  const performAsyncAction = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(300);
    StatusBar.setBarStyle("dark-content");
  };
  return (
    <View style={styles.container}>
      <Header headerText={"Service History"} />
      {loading ? (
        <Animation />
      ) : UserBookings.length > 0 ? (
        <BookingCard
          bookingData={UserBookings}
          employeeData={[]}
          isAdmin={loggedInUser.isAdmin}
          loading={false}
        />
      ) : (
        <View style={styles.ImageContainer}>
          <Image
            style={styles.Image}
            source={{
              uri: "https://cdni.iconscout.com/illustration/premium/thumb/worker-wash-service-4706305-3937514.png",
            }}
          />
          <Text style={styles.Text}>No Services Available</Text>
        </View>
      )}
    </View>
  );
};

export default ServiceHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  ImageContainer: {
    width: width,
    height: "50%",
    justifyContent: "space-around",
  },
  Image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  Text: {
    fontSize: height * 0.025,
    color: "#000",
    fontWeight: "400",
    alignSelf: "center",
    top: -(height * 0.1),
  },
});
