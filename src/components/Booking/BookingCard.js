// This is a React Native code for a parking app

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Divider } from "react-native-elements";
import Animation from "../Animation";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");
const BookingCard = ({ isAdmin, bookingData, loading, employeeData }) => {
  const navigation = useNavigation();
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("BookingCardDetails", {
            item: item,
            employeeData: employeeData,
          })
        }
      >
        <View style={styles.header}>
          <View style={styles.NameNavigateContainer}>
            <Text style={styles.title}>{item?.DisplayName}</Text>
            <Image
              style={styles.IconImageStyle}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/10628/10628855.png",
              }}
            />
          </View>
          <View style={styles.DetailsPriceContainer}>
            <View style={styles.DetailsContainer}>
              <Text style={styles.carName}>{item.CarType?.VehicleBrand}</Text>
              <Text style={styles.carName}>
                {item?.CarType?.VehicleModal} - {item?.CarType?.VehicleType}
              </Text>
              <Text style={styles.carNumber}>
                {item?.CarType?.VehicleNumber}
              </Text>
            </View>
            <View style={styles.PriceContainer}>
              <Text style={styles.PriceText}>&#x20B9; 500</Text>
              <Text style={styles.BookedText}>Booked</Text>
            </View>
          </View>
          <Text style={styles.parkingLabel}>Add On Service</Text>
          <Text style={styles.parkingValue}>
            {item?.AddOnService?.map((data, index) => {
              if (index === item.AddOnService.length - 1) {
                return data;
              } else {
                return data + " | ";
              }
            })}
          </Text>
          <Divider
            color="#000012"
            style={{ borderWidth: 0.196, marginTop: 10 }}
          />
          <View style={styles.StatusContainer}>
            <Text
              style={[
                styles.Lable,
                {
                  backgroundColor:
                    item.Status === "Pending"
                      ? "#EEEED0"
                      : item.Status === "Completed"
                      ? "#E0EED0"
                      : item.Status === "Active"
                      ? "#EED0D1"
                      : "#E0EED0",
                },
              ]}
            >
              <Text style={styles.Dot}>&#9679; </Text>
              {item.Status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <Animation />}
      <FlatList
        style={[
          styles.AssignedJobs,
          {
            marginBottom: isAdmin
              ? 0
              : loggedInUser.isEmployee
              ? height * 0.37
              : 0,
          },
        ]}
        data={bookingData}
        horizontal={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.019,
    paddingVertical: width * 0.01,
  },
  header: {
    backgroundColor: "#FEFEFE",
    justifyContent: "center",
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
    padding: height * 0.018,
    borderRadius: 15,
  },
  AssignedJobs: {
    flex: 1,
  },
  NameNavigateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  StatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.007,
  },
  Lable: {
    marginLeft: 5,
    color: "#333", // Text color
    fontSize: 16, // Adjust the font size as needed
    fontWeight: "bold", // Adjust the font weight as needed
    borderRadius: 9, // Adjust the border radius as needed
    overflow: "hidden",
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 4,
  },
  Dot: {
    fontSize: height * 0.023,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: height * 0.023,
    fontWeight: "bold",
    color: "#2c65e0",
  },
  body: {
    flex: 1,
    padding: height * 0.02,
    alignItems: "center",
  },
  carImage: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  carName: {
    fontSize: height * 0.02,
    fontWeight: "bold",
    color: "#333333",
  },
  carNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#999999",
    marginTop: 5,
  },
  parkingInfo: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  parkingLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 15,
  },
  parkingValue: {
    fontSize: 15,
    fontWeight: "normal",
    color: "#999999",
  },
  note: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  noteValue: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#FF0000",
    marginBottom: 10,
  },
  DropDownStyle: {
    borderColor: "#a8a8a8",
    borderWidth: 0,
    margin: 0,
  },
  textColor: {
    color: "#000",
  },
  placeHolderText: { color: "#a8a8a8" },
  dropDownContainerStyle: {
    borderWidth: 0,
    elevation: 10,
    backgroundColor: "#fff",
    zIndex: 12,
  },
  DetailsPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  PriceContainer: {
    top: 8,
    alignContent: "flex-end",
    alignSelf: "flex-end",
  },
  PriceText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333333",
  },
  BookedText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "green",
  },
  IconImageStyle: {
    width: height * 0.035,
    height: height * 0.035,
    backgroundColor: "#f5f8fd",
    borderRadius: 30,
  },
});

export default BookingCard;
