import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const BookingCountDetails = ({ AllEmployeeDataCount }) => {
  const navigation = useNavigation();

  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );

  const handleClick = () => {
    navigation.dispatch(DrawerActions.openDrawer());
    StatusBar.setBarStyle("dark-content");
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.ImageStyle}
        source={require("../../../assets/Carousel/radiant.png")}
      />
      <View style={styles.TopContainer}>
        <TouchableOpacity onPress={handleClick}>
          <View style={styles.NotifyContainer}>
            <View style={[styles.IconStyle, { width: width / 18 }]} />
            <View style={[styles.IconStyle, { width: width / 23, left: -2 }]} />
            <View style={[styles.IconStyle, { width: width / 20 }]} />
          </View>
        </TouchableOpacity>
        <View style={styles.NameContainer}>
          <Text style={styles.NameText}>Hello {loggedInUser.displayName}</Text>
          <Text style={styles.WelcomeText}>Welcome Back!</Text>
        </View>
      </View>
      <View style={styles.JobContainer}>
        <Text style={styles.JobTextHeading}>Daily Clening Job</Text>
        <View style={styles.PendingJobContainer}>
          <View style={styles.PendingIconJobContainer}>
            <View style={styles.PendingTopContainerIconCount}>
              <Image
                style={styles.IconImageStyle}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/3559/3559930.png",
                }}
              />
              <Text style={styles.PendingJobTextCount}>
                {AllEmployeeDataCount.vehicleCount}
              </Text>
            </View>
            <Text style={styles.PendingJobTextHeading}>No. Vehicles</Text>
          </View>
          <View style={styles.PendingIconJobContainer}>
            <View style={styles.PendingTopContainerIconCount}>
              <Image
                style={styles.IconImageStyle}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/10833/10833490.png",
                }}
              />
              <Text style={styles.PendingJobTextCount}>
                {AllEmployeeDataCount.pending}
              </Text>
            </View>
            <Text style={styles.PendingJobTextHeading}>Not Completed</Text>
          </View>
          <View style={styles.PendingIconJobContainer}>
            <View style={styles.PendingTopContainerIconCount}>
              <Image
                style={styles.IconImageStyle}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/9463/9463914.png",
                }}
              />
              <Text style={styles.PendingJobTextCount}>
                {AllEmployeeDataCount.completedLength}
              </Text>
            </View>
            <Text style={styles.PendingJobTextHeading}>Completed</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingCountDetails;

const styles = StyleSheet.create({
  container: {},
  ImageStyle: {
    width: width,
    height: height / 5,
    resizeMode: "cover",
    top: -height / 20,
  },
  TopContainer: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    top: -height / 6.2,
    paddingHorizontal: 15,
    padding: 5,
  },
  NotifyContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff10",
  },
  NameContainer: {
    marginTop: 7,
  },
  IconStyle: {
    borderWidth: 0.7,
    borderColor: "#fff",
    marginVertical: 3,
  },
  NameText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: height * 0.025,
  },
  WelcomeText: {
    fontWeight: "300",
    color: "#fff",
    fontSize: 14,
    textAlign: "right",
  },
  JobContainer: {
    paddingHorizontal: 15,
    top: -height * 0.099,
  },
  JobTextHeading: {
    fontSize: height * 0.021,
    color: "#000",
    fontWeight: "600",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  PendingJobContainer: {
    flexDirection: "row",
  },
  PendingIconJobContainer: {
    borderRadius: 10,
    backgroundColor: "#ffff",
    padding: 15,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      // Shadow properties for Android
      android: {
        elevation: 4,
      },
    }),
  },
  IconImageStyle: {
    width: height * 0.035,
    height: height * 0.035,
    backgroundColor: "#f5f8fd",
    borderRadius: 30,
  },
  PendingJobTextHeading: {
    fontSize: height * 0.02,
    color: "#000",
  },
  PendingJobTextCount: {
    fontSize: height * 0.025,
    color: "#2A2A2A",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "700",
    paddingVertical: 5,
  },
  PendingTopContainerIconCount: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
