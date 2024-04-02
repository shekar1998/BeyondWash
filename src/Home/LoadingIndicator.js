import { StyleSheet, View, ActivityIndicator } from "react-native";
import React from "react";

const LoadingIndicator = () => {
  return (
    <View style={styles.header}>
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
});
