import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../Header";
import { useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import ImageModal from "react-native-image-modal";

const { width, height } = Dimensions.get("window");

const BookingDetailsForDates = () => {
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(true);

  const images = [
    {
      url: "http://scimg.jb51.net/allimg/160815/103-160Q509544OC.jpg",
    },
    {
      url: "http://img.sc115.com/uploads1/sc/jpgs/1508/apic22412_sc115.com.jpg",
    },
    {
      url: "http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      console.log("En");
      setLoading(false);
    }, 1500);
  }, [route?.params?.item?.CurrentScheduledDate]);

  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(modal ? "rgba(0, 0, 0, 0.5)" : "#fff");
    }
  }, [modal]);

  function renderImageItem({ item }) {
    console.log(item);
    return (
      <View style={{ flex: 1 }}>
        {loading && (
          <ActivityIndicator
            size={"large"}
            color={"#2c65e0"}
            style={{
              width: width / 4,
              height: height / 9,
              alignItems: "center",
            }}
          />
        )}
        {!loading && (
          <TouchableOpacity activeOpacity={0.6}>
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="transparent"
              style={{
                width: width / 3,
                aspectRatio: 1,
              }}
              source={{
                uri: `https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Bookings%2F${item}?alt=media&token=undefined`,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
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
        data={route?.params?.item?.CurrentScheduledDate}
        renderItem={renderItem}
      />
      {/* <Modal animationType="slide" transparent={true} visible={modal}>
        <ImageViewer
          style={{
            width: "100%",
            height: "100%",
          }}
          imageUrls={[
            {
              url: "https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Bookings%2F1712831643870.jpg?alt=media&token=undefined",
              backgroundColor: "transparent",
              freeHeight: true,
            },
            {
              url: "https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Bookings%2F1712831643870.jpg?alt=media&token=undefined",
              backgroundColor: "transparent",
            },
            {
              url: "https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Bookings%2F1712831643870.jpg?alt=media&token=undefined",
              backgroundColor: "transparent",
            },
          ]}
        />
      </Modal> */}
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
  ModalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
  ModalImageContainer: {
    width: "90%",
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "red",
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

//const [imageData, setImageData] = useState(); // State to store image data
// const fetchImageData = async (img) => {
//   try {
//     const res = await axios.get(
//       `https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Bookings%2F${img}`
//     );
//     const parseData = JSON.parse(res.request.response);
//     setImageData(parseData.downloadTokens);
//   } catch (error) {
//     console.log(error);
//   }
// };
// console.log(route?.params?.item?.CurrentScheduledDate[0]?.images[0]);
// fetchImageData(
//   typeof route?.params?.item?.CurrentScheduledDate[0]?.images[0] ===
//     "undefined"
//     ? ""
//     : route?.params?.item?.CurrentScheduledDate[0]?.images[0]
// );
