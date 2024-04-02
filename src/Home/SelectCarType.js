import React, { useState, useRef } from "react";
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
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { SelectedCarType } from "../../hooks/Slice";

const { width, height } = Dimensions.get("window");

const SelectCarType = () => {
  const [showSheet, setShowSheet] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const list = [
    {
      id: 1,
      carImage:
        "https://www.pngmart.com/files/22/Toyota-Fortuner-PNG-Photo.png",
      carType: "Hatch back",
      carExample: "Alto, I10, I20 etc...",
    },
    {
      id: 2,
      carImage: "https://www.pngmart.com/files/22/Sedan-PNG-Clipart.png",
      carType: "Sedan",
      carExample: "Ford, Toyota, Corolla, Honda, Civic etc...",
    },
    {
      id: 3,
      carImage:
        "https://www.pngmart.com/files/22/Mercedes-Benz-AMG-Vision-PNG-Clipart.png",
      carType: "Luxury",
      carExample: "BMW, Audi, Mercedes etc...",
    },
    {
      id: 4,
      carImage: "https://www.pngmart.com/files/22/Kia-Soul-EV-PNG-Image.png",
      carType: "Mid-SUV",
      carExample: "That, Kia, Seltos, Rea, Xuv 300 etc..",
    },
    {
      id: 5,
      carImage:
        "https://www.pngmart.com/files/22/Toyota-Fortuner-PNG-Photo.png",
      carType: "SUV",
      carExample: "Kia, Carnival, Fortuner, Tat, Hexa etc...",
    },
  ];

  const sheetAnimation = useRef(new Animated.Value(0)).current;

  const showSheetFunction = () => {
    setShowSheet(true);
    Animated.timing(sheetAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideSheet = () => {
    Animated.timing(sheetAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSheet(false);
    });
  };

  const sheetTranslateY = sheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
  });

  function handleNav(carType) {
    dispatch(SelectedCarType(carType));
    hideSheet();
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent");
    }
    navigation.navigate("SubscribePlan");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showSheetFunction}
        activeOpacity={0.9}
        style={styles.buttonContainer}
      >
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonText}>Starting From</Text>
          <Text style={styles.buttonText}>&#x20B9;400/Month</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={showSheet} transparent>
        <View style={styles.overlay}>
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
            {list.map((data) => {
              return (
                <TouchableOpacity
                  key={data.id}
                  activeOpacity={0.9}
                  onPress={() => handleNav(data)}
                >
                  <View style={styles.carContainer}>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={{
                          uri: data.carImage,
                        }}
                      />
                    </View>
                    <View style={styles.carDetailsContainer}>
                      <Text style={styles.carTypeText}>{data.carType}</Text>
                      <View style={styles.carExampleContainer}>
                        <Text style={styles.carExampleText}>
                          {data.carExample}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
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
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
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
    width: width - 30,
    height: height / 7.5,
    borderRadius: 20,
    elevation: 15,
    shadowColor: "#adadadc9",
    backgroundColor: "#fff",
    flexDirection: "row",
    marginVertical: 5,
  },
  imageContainer: {
    width: "35%",
    height: "100%",
    marginHorizontal: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  carDetailsContainer: {
    width: "60%",
    padding: 10,
  },
  carTypeText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "MPLUSRounded1c-Black",
  },
  carExampleContainer: {
    flexDirection: "row",
    height: "30%",
    flex: 0.9,
    flexWrap: "wrap",
    marginVertical: 5,
  },
  carExampleText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "MPLUSRounded1c-Light",
  },
});

export default SelectCarType;
