import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const FeedbackDetails = () => {
  const route = useRoute(); // Use useRoute to access the route object

  function renderItem({ item }) {
    return (
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.ContactContainer}>
          {/* <View style={styles.contactContainer}>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: `https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Users%2F${item?.photoURL}`,
              }}
            />
          </View> */}
          <View style={styles.detailsContainer}>
            <Text style={styles.nameText}>{item.type} Issue</Text>
            <Text style={styles.detailsText}>
              {item.phoneNumer} | {item.email}
            </Text>
            <Text style={styles.CommentsText}>{item.comment}</Text>
            <Text style={styles.DateText}>{item.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Header headerText={"User List"} />
      {route?.params?.FeedbackDetails?.length === 0 ? (
        <View style={styles.EmptyImageContainer}>
          <Image
            style={styles.Image}
            source={{
              uri: "https://img.freepik.com/premium-vector/no-data-concept-illustration_86047-488.jpg?w=740",
            }}
          />
        </View>
      ) : (
        <FlatList
          style={styles.renderItem}
          data={route?.params?.FeedbackDetails}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default FeedbackDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textContact: {
    marginHoroizontal: 24,
    fontSize: 18,
    fontWeight: "bold",
  },
  textContac2t: {
    fontSize: 18,
    color: "red",
  },
  ContactContainer: {
    backgroundColor: "#fff",
    width: "97%",
    height: height / 8,
    marginVertical: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    flexDirection: "row",
    alignSelf: "flex-end",
    elevation: 15,
    shadowColor: "#adadadc9",
    // opacity: 0.1,
  },
  EmptyImageContainer: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    resizeMode: "contain",
    alignItems: "center",
  },
  Image: {
    width: "80%",
    height: "80%",
    alignContent: "center",
  },
  contactContainer: {
    flexDirection: "row",
    width: "20%",
    // alignContent: "flex-star",
    justifyContent: "flex-end",
    paddingLeft: 10,
    // backgroundColor: "white",
  },
  tinyLogo: {
    width: width / 7.5,
    height: width / 7.5,
    borderRadius: 80,
    alignSelf: "center",
    resizeMode: "contain",
  },
  ImageContainer: {
    width: width / 12,
    height: width / 12,
    padding: 10,
  },
  detailsContainer: {
    width: "80%",
    alignSelf: "center",
    height: "80%",
    marginHorizontal: 15,
    // backgroundColor: "white",
    // alignItems:'center',
    justifyContent: "center",
  },
  nameText: {
    fontSize: height * 0.015,
    fontWeight: "800",
    paddingVertical: 5,
    color: "#000",
    borderBottomWidth: 1,
  },
  detailsText: {
    fontSize: height * 0.015,
    fontWeight: "500",
    paddingVertical: 3,
    color: "#000",
  },
  CommentsText: {
    fontSize: height * 0.02,
    fontWeight: "400",
    paddingVertical: height * 0.01,
    color: "#000",
  },
  DateText: {
    fontSize: height * 0.015,
    fontWeight: "800",
    paddingVertical: height * 0.01,
    color: "#000",
  },
  renderItem: {
    height: "80%",
  },
  InputBox: {
    width: width - 50,
    alignItems: "center",
    borderWidth: 0.3,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 12,
    borderColor: "#a8a8a8",
    paddingHorizontal: 15,
    color: "#000",
  },
});
