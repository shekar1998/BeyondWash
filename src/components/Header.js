import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import Ionicons from "react-native-vector-icons/Octicons";
import { Divider } from "react-native-elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

const Header = ({ headerText }) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    console.log("back clicked");
    navigation.goBack();
  };
  const performAsyncAction = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(500);
    StatusBar.setBarStyle("dark-content");
  };

  useEffect(() => {
    performAsyncAction();
    return () => {
      clearTimeout();
    };
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      performAsyncAction();
      return () => {
        clearTimeout();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={handleGoBack}
          activeOpacity={1}
          style={styles.IconContainer}
        >
          <Ionicons
            style={styles.Icon}
            name={"chevron-left"}
            size={height * 0.0247}
            color={"#2c65e0"}
          />
        </TouchableOpacity>
        <View style={styles.TextHeaderContainer}>
          <Text style={styles.subscriptionText}>{headerText}</Text>
        </View>
      </View>
      <Divider />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.127,
    zIndex: 300,
  },
  headerContainer: {
    marginTop: height * 0.045,
    marginHorizontal: height * 0.005,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  TextHeaderContainer: {
    width: "100%",
    left: -height * 0.085,
  },
  IconContainer: {
    width: "16%",
    paddingTop: 2,
    zIndex: 100,
  },
  subscriptionText: {
    color: "#000",
    textAlign: "center",
    fontSize: height * 0.02,
    fontWeight: "600",
    fontFamily: "MPLUSRounded1c-Bold",
  },
  Icon: {
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "400",
    paddingHorizontal: height * 0.018,
  },
});
