import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { handleLogout } from "../Auth/AuthProvider";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginReducerUpdate } from "../../hooks/Slice";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";

const { width, height } = Dimensions.get("window");

const SideScreen = () => {
  let BgClr, fontWeight;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  function handleNav(screenName) {
    StatusBar.setBarStyle("light-content");
    navigation.navigate(`${screenName}`, {
      email: loggedInUser?.email,
    });
  }

  let screen = [
    {
      id: 1,
      icon: require("../../assets/icons/home3.png"),
      screenName: "HomeScreen",
      iconName: "Home",
    },
    {
      id: 2,
      icon: require("../../assets/icons/profile3x.png"),
      screenName: "ProfileScreen",
      iconName: "Profile",
    },
    {
      id: 4,
      icon: require("../../assets/icons/articles3x.png"),
      screenName: "ServiceHistory",
      iconName: "Service History",
    },
    {
      id: 5,
      icon: require("../../assets/icons/profile3x.png"),
      screenName: "Feedback",
      iconName: "Feedback",
    },
    {
      id: 6,
      icon: require("../../assets/icons/tire.png"),
      screenName: "CarDetails",
      iconName: "Car Details",
    },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      await auth().signOut();
      const userData = {
        userDetails: {},
        isAuthenticated: false,
      };
      navigation.dispatch(DrawerActions.closeDrawer());
      await AsyncStorage.removeItem("@last_login_timestamp"); // Set the initial timestamp
      dispatch(LoginReducerUpdate(userData));
      setLoading(false);
    } catch (error) {
      console.error("Error while logging out:", error);
      return 0;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.LogoContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/images/CarWashFinal2.png")}
        />
      </View>
      <View style={styles.MenuContainer}>
        {screen.map((data) => {
          BgClr =
            data.iconName === "Home" ? styles.PrimaryBg : styles.SecondaryBg;
          fontWeight =
            data.iconName === "Home"
              ? styles.PrimaryFont
              : styles.SecondaryFont;
          return (
            <View
              onTouchStart={() => handleNav(data.screenName)}
              key={data.id}
              style={styles.MenuSubCotntainer}
            >
              <View style={[styles.IconImageContainer, BgClr]}>
                <Image style={styles.IconImage} source={data.icon} />
              </View>
              <Text style={[styles.IconText, fontWeight]}>{data.iconName}</Text>
            </View>
          );
        })}
        <View
          onTouchStart={() => handleNav("Support")}
          style={styles.MenuSubCotntainer}
        >
          <View style={[styles.IconImageContainer, styles.SecondaryBg]}>
            <Image
              style={styles.SupportIconImage}
              source={require("../../assets/icons/customer-service.png")}
            />
          </View>
          <Text style={[styles.IconText, styles.SecondaryFont]}>Support</Text>
        </View>
        {loggedInUser.isAdmin ? (
          <View
            onTouchStart={() => handleNav("Admin")}
            style={styles.MenuSubCotntainer}
          >
            <View style={[styles.IconImageContainer, styles.SecondaryBg]}>
              <Image
                style={styles.SupportIconImage}
                source={require("../../assets/icons/admin.png")}
              />
            </View>
            <Text style={[styles.IconText, styles.SecondaryFont]}>Admin</Text>
          </View>
        ) : null}
        <View style={styles.Divider} />
        <View
          onTouchStart={() => handleNav("PrivacyPolicyScreen")}
          style={styles.MenuSubCotntainer}
        >
          <View style={[styles.IconImageContainer, styles.SecondaryBg]}>
            <Image
              style={styles.IconImage}
              source={require("../../assets/icons/documentation3x.png")}
            />
          </View>
          <Text style={[styles.IconText, styles.SecondaryFont]}>
            Documentation
          </Text>
        </View>
      </View>
      <View style={styles.LogoutCotntainer}>
        <TouchableOpacity
          onPress={() => handleLogout()}
          activeOpacity={0.7}
          style={[styles.button]}
        >
          <Image
            source={require("../../assets/icons/logout.png")}
            style={styles.Image}
          />
          <Text style={styles.buttonText}>Logout</Text>
          {Loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.buttonText}>...</Text>
              <ActivityIndicator color={"#000"} size={"small"} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SideScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  LogoContainer: {
    flexDirection: "row",
    height: "10%",
  },
  image: {
    alignSelf: "center",
    width: width / 1.21,
    height: width / 1.6,
    marginHorizontal: 0,
    // top: -50,
    left: -height * 0.0175,
    resizeMode: "contain",
  },
  infoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    color: "#000",
    fontFamily: "MPLUSRounded1c-Medium",
    paddingVertical: 3,
  },
  TextContainer: {
    top: height * 0.045,
    left: height * 0.035,
  },
  text: {
    color: "#000",
    fontWeight: "700",
    fontSize: height * 0.035,
  },
  MenuContainer: { height: "80%", paddingHorizontal: width * 0.025 },
  MenuSubCotntainer: {
    flexDirection: "row",
    marginVertical: height * 0.012,
    alignContent: "center",
    alignItems: "center",
  },
  LogoutCotntainer: {
    marginBottom: height * 0.035,
    flexDirection: "row",
    paddingVertical: height * 0.009,
    width: width / 2.1,
    justifyContent: "center",
    alignSelf: "center",
  },
  LogOutIconImageContainer: {
    justifyContent: "center",
    alignSelf: "center",
  },
  IconImage: {
    width: width * 0.035,
    height: width * 0.035,
  },
  SupportIconImage: {
    width: width * 0.037,
    height: width * 0.037,
  },
  LogOutIconImage: {
    width: width * 0.035,
    height: width * 0.035,
  },
  IconImageContainer: {
    width: height * 0.053,
    height: height * 0.053,
    resizeMode: "contain",
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  PrimaryBg: { backgroundColor: "#2c65e0" },
  SecondaryBg: { backgroundColor: "#fff" },
  PrimaryFont: { fontWeight: "700" },
  SecondaryFont: { fontWeight: "400" },
  Divider: {
    borderWidth: Platform.OS === "android" ? 0.15 : 0.24,
    width: width / 2.1,
    alignSelf: "center",
    marginVertical: height * 0.01,
    overflow: "hidden",
  },
  IconText: {
    fontSize: height * 0.018,
    paddingHorizontal: height * 0.0175,
    textAlignVertical: "center",
    color: "#000",
  },
  button: {
    borderRadius: 6,
    backgroundColor: "#fff",
    shadowColor: "#969696",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    alignSelf: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: height * 0.018,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  Image: {
    width: height * 0.023,
    height: height * 0.023,
  },
  loadingContainer: {
    flexDirection: "row",
  },
});
