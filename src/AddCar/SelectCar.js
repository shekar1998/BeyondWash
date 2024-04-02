import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { OpenActionSheet, SelectedCarType } from "../../hooks/Slice";

const { width, height } = Dimensions.get("window");

const SelectCar = () => {
  const navigation = useNavigation();

  const isActionSheetOpen = useSelector(
    (state) => state.globalStore.openActionSheet
  );
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const dispatch = useDispatch();

  const sheetAnimation = useRef(new Animated.Value(0)).current;

  const hideSheet = () => {
    Animated.timing(sheetAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(
        OpenActionSheet({
          selectedValue: "",
          openValue: false,
        })
      );
    });
  };

  const sheetTranslateY = sheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
  });

  function handleNav(item) {
    hideSheet();
    StatusBar.setBarStyle("dark-content");
    dispatch(SelectedCarType(item));
    navigation.navigate("SubscribePlan");
  }

  return (
    <View style={styles.container}>
      <Modal visible={isActionSheetOpen.openValue} transparent>
        <View
          style={[
            styles.overlay,
            { top: -(height * isActionSheetOpen?.length * 0.14) },
          ]}
        >
          <Animated.View
            style={[
              styles.sheet,
              {
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}
          >
            <TouchableOpacity style={styles.cancelButton} onPress={hideSheet}>
              <View style={styles.cancelButtonText} />
            </TouchableOpacity>
            {loggedInUser?.carDetails?.map((item, index) => {
              if (isActionSheetOpen.selectedValue === item?.VehicleMotorType) {
                return (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.carContainer}
                      activeOpacity={0.9}
                      onPress={() => handleNav(item)}
                    >
                      <View style={styles.imageContainer}>
                        <Image
                          style={styles.image}
                          source={{
                            uri: item?.VehicleImage,
                          }}
                        />
                      </View>
                      <View style={styles.carDetailsContainer}>
                        <Text style={styles.carTypeText}>
                          {item?.VehicleBrand}
                        </Text>
                        <View style={styles.carExampleContainer}>
                          <Text key={index} style={styles.carExampleText}>
                            {item?.VehicleModal} | {item?.VehicleType} |{" "}
                            {item?.VehicleNumber}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              } else {
                return null;
              }
            })}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: width - 40,
    height: 50,
    marginTop: 5,
    backgroundColor: "#2c65e0",
    borderRadius: 14,
    elevation: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextContainer: {
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "MPLUSRounded1c-Black",
    fontWeight: "700",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    borderWidth: 2,
    width: width / 7,
    borderRadius: 20,
    borderColor: "#0009",
  },
  carContainer: {
    width: width - 50,
    height: height * 0.12,
    borderRadius: 20,
    elevation: 15,
    shadowColor: "#adadadc9",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  imageContainer: {
    width: height * 0.119,
    height: height * 0.119,
    marginHorizontal: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  image: {
    width: "75%",
    height: "75%",
    resizeMode: "contain",
  },
  carDetailsContainer: {
    width: "60%",
    alignContent: "center",
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  carTypeText: {
    fontSize: height * 0.021,
    color: "#000",
    fontFamily: "MPLUSRounded1c-Black",
    fontWeight: "700",
  },
  carExampleContainer: {},
  carExampleText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "MPLUSRounded1c-Light",
  },
});

export default SelectCar;
