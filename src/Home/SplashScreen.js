import React, { useRef, useEffect } from "react";
import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";
import Video from "react-native-video";

const SplashScreen = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBarStyle("light-content");
      StatusBar.setTranslucent(true);
    }
  }, []);

  const onBuffer = (error) => {
    console.log("Error", error);
  };

  const videoError = (error) => {
    console.log("Video Loaded", error);
  };

  return (
    <Video
      ref={videoRef}
      source={require("../../assets/images/CrystalWaterOpenerfree.mp4")}
      onBuffer={onBuffer}
      onError={videoError}
      style={styles.video}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: Dimensions.get("window").width, // Adjust width to fit screen
    height: Dimensions.get("window").height, // Adjust height to fit screen
  },
});

export default SplashScreen;
