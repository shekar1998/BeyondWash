import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Header from "../components/Header";
import { Dimensions } from "react-native";
import BookingCard from "../components/Booking/BookingCard";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const AdminBookingDetails = () => {
  const dataList = ["All Items", "Active", "Completed", "Pending"]; // Your list of data
  const [selectedItem, setSelectedItem] = useState("All Items");
  const [BookingItem, setBookingItem] = useState([]);
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const route = useRoute(); // Use useRoute to access the route object

  const handleItemPress = (item) => {
    setSelectedItem(item);
    if (item === "All Items") {
      setBookingItem(route.params.AllBookingData);
    } else {
      setBookingItem(
        route.params.AllBookingData.filter((data) => data.Status === item)
      );
    }
  };

  useEffect(() => {
    setBookingItem(route.params.AllBookingData);
  }, []);

  return (
    <View style={styles.container}>
      <Header headerText={"User List"} />
      <View style={styles.SelectableList}>
        {dataList.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.9}
            key={index}
            style={[
              styles.item,
              selectedItem === item && styles.selectedItem, // Apply selected style
            ]}
            onPress={() => handleItemPress(item)}
          >
            <Text
              style={[
                styles.itemText,
                selectedItem === item && styles.selectedItemText, // Apply selected style
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <BookingCard
        bookingData={BookingItem}
        employeeData={route.params.AllEmployeeData}
        isAdmin={loggedInUser.isAdmin}
        loading={false}
      />
    </View>
  );
};

export default AdminBookingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tinyLogo: {
    width: height * 0.03,
    height: height * 0.03,
    borderRadius: 80,
    alignSelf: "center",
    resizeMode: "contain",
  },
  SelectableList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    marginBottom: 20,
    marginHorizontal: 10,
    paddingHorizontal: width * 0.015,
    paddingVertical: 7,
    borderColor: "gray",
    borderRadius: 8,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#EAEAEA",
        shadowOffset: { width: 1, height: 4 },
        shadowOpacity: 2.5,
        shadowRadius: 2,
      },
      // Shadow properties for Android
      android: {
        elevation: 2,
        shadowOffset: 0.2,
        shadowColor: "#000",
      },
    }),
  },
  selectedItem: {
    backgroundColor: "#2c65e0", // Change background color when selected
  },
  itemText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});
