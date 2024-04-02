import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../Header";
import { useRoute } from "@react-navigation/native";
import { Image } from "react-native";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const BookingDetailsForDates = () => {
  const route = useRoute();
  const [imageData, setImageData] = useState(); // State to store image data
  console.log("route?.params?.item", route?.params?.item?.ServiceDates);
  useEffect(() => {
    // Function to fetch and set image data
    const fetchImageData = async (img) => {
      try {
        const res = await axios.get(
          `https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Bookings%2F${img}`
        );
        const parseData = JSON.parse(res.request.response);
        setImageData(parseData.downloadTokens);
      } catch (error) {
        console.log(error);
      }
    };
    fetchImageData(
      typeof route?.params?.item?.ServiceDates[0]?.images[0] === "undefined"
        ? ""
        : route?.params?.item?.ServiceDates[0]?.images[0]
    );
  }, [route?.params?.item?.ServiceDates]);

  function renderImageItem({ item }) {
    return (
      <Image
        style={styles.ImageContainer}
        source={{
          uri:
            typeof item === "undefined"
              ? ""
              : `https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Bookings%2F${item}?alt=media&token=${imageData}`,
        }}
      />
    );
  }

  function renderItem({ item }) {
    return (
      <View style={styles.DateContainer}>
        <Text style={styles.DateText}>
          {" "}
          <Text style={styles.parkingLabel}>Date - </Text>
          {item?.date}
        </Text>
        <View style={styles.StatusContainer}>
          <Text style={styles.parkingLabel}>Status : </Text>
          <Text
            style={[
              styles.Lable,
              {
                backgroundColor:
                  item.status === "Pending"
                    ? "#EEEED0"
                    : item.status === "Completed"
                    ? "#E0EED0"
                    : item.status === "Active"
                    ? "#E0EED0"
                    : "#EED0D1",
              },
            ]}
          >
            <Text style={styles.Dot}>&#9679; </Text>
            {item?.status}
          </Text>
        </View>
        <FlatList
          data={item?.images}
          horizontal={true}
          renderItem={renderImageItem}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header headerText={"BookingDetailsForDates"} />
      <FlatList
        data={route?.params?.item?.ServiceDates}
        renderItem={renderItem}
      />
    </View>
  );
};

export default BookingDetailsForDates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  DateContainer: {
    padding: 10,
    width: "100%",
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  DateText: {
    fontSize: height * 0.018,
    color: "#000",
  },
  ImageContainer: {
    width: width / 3,
    height: width / 3,
    resizeMode: "contain",
    borderRadius: 10,
    marginRight: 10,
  },
  parkingLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 15,
    marginBottom: 17,
  },
  Lable: {
    marginLeft: 5,
    color: "#333", // Text color
    fontSize: 16, // Adjust the font size as needed
    fontWeight: "bold", // Adjust the font weight as needed
    borderRadius: 9, // Adjust the border radius as needed
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  Dot: {
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
  },
  StatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.007,
  },
});
