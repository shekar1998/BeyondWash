import Header from "../components/Header";
import { StyleSheet, View, Dimensions, Image, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AddCar from "./AddCar";
import CustomButton from "../components/Button/CustomButton";
import firestore from "@react-native-firebase/firestore";
import { LoginReducerUpdate, SelectedVehicleUpdate } from "../../hooks/Slice";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const CarDetails = () => {
  const [showAddCar, setShowAddCar] = useState(false);
  const [value, setValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Add Car", value: "Car" },
    { label: "Add Bike", value: "Bike" },
  ]);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const isAuth = useSelector((state) => state.globalStore);
  const navigation = useNavigation();

  useEffect(() => {
    if (loggedInUser?.carDetails && loggedInUser?.carDetails.length >= 1) {
      setShowAddCar(false);
    } else {
      setShowAddCar(true);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setValue([]);
    }, [])
  );

  const handleDelete = async (item) => {
    let filteredDeletedData = loggedInUser?.carDetails?.filter(
      (data) => data?.VehicleModal !== item.VehicleModal
    );
    if (filteredDeletedData?.length === 0) {
      setShowAddCar(true);
    }

    await firestore()
      .collection("Users")
      .doc(loggedInUser.uid)
      .update({
        carDetails: filteredDeletedData,
      })
      .then(async () => {
        const lastLoginTimestamp = await AsyncStorage.getItem(
          "@last_login_timestamp"
        );
        const parsedData = JSON.parse(lastLoginTimestamp);
        const userData = {
          userDetails: {
            ...parsedData.userDetails,
            carDetails: filteredDeletedData,
          },
          isAuthenticated: isAuth.isAuthenticated,
        };
        dispatch(LoginReducerUpdate(userData));
        AsyncStorage.setItem("@last_login_timestamp", JSON.stringify(userData)); // Set the initial timestamp
      });
    Toast.show({
      type: "error",
      text1: "error",
      text2: "Successfully deleted🙂",
      visibilityTime: 2000,
      style: {
        backgroundColor: "green",
      },
    });
  };

  return (
    <View style={styles.container}>
      {showAddCar ? (
        <View style={styles.CarContainer}>
          <AddCar SelectedVehicleType={value} />
        </View>
      ) : (
        <View>
          <Header headerText={"Car Selection"} />
          {loggedInUser?.carDetails && loggedInUser?.carDetails.length >= 1 ? (
            <View style={styles.AddCarButton}>
              {!showAddCar && (
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="Add Vehicle"
                  style={styles.DropDownStyle}
                  textStyle={styles.textColor}
                  zIndex={100}
                  multiple={false}
                  extendableBadgeContainer={true}
                  dropDownDirection="BOTTOM"
                  placeholderStyle={styles.placeHolderText}
                  onSelectItem={() => {
                    navigation.navigate("AddCar");
                    dispatch(SelectedVehicleUpdate(value));
                  }}
                  ArrowDownIconComponent={() => (
                    <EvilIcons
                      onPress={() => setOpen(true)}
                      style={styles.Icon}
                      name="chevron-down"
                      size={30}
                      color={"#fff"}
                    />
                  )}
                  selectedItemLabelStyle={{ color: "#000", fontWeight: "800" }}
                  labelStyle={{ color: "#fff", fontWeight: "800" }}
                  ArrowUpIconComponent={() => (
                    <EvilIcons
                      onPress={() => setOpen(false)}
                      style={styles.Icon}
                      name="chevron-up"
                      size={30}
                      color={"#fff"}
                    />
                  )}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                />
              )}
            </View>
          ) : null}
          {loggedInUser?.carDetails?.map((item, index) => (
            <View key={index}>
              <View style={styles.ContactContainer}>
                <View style={styles.contactContainer}>
                  <Image
                    style={styles.tinyLogo}
                    source={{
                      uri: item?.VehicleImage,
                    }}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <View style={styles.TextContainer}>
                    <Text style={styles.nameText}>{item?.VehicleBrand}</Text>
                    <Text style={styles.detailsText}>
                      {item?.VehicleModal} | {item?.VehicleType}
                    </Text>
                    <Text style={styles.addressText}>
                      {item?.VehicleNumber}
                    </Text>
                  </View>
                  <View style={styles.deleteContainer}>
                    <CustomButton
                      customWidth={width / 5}
                      backgroundColor={"#FF3232"}
                      title={"Delete"}
                      FontSize={height * 0.015}
                      customHeight={height * 0.04}
                      PaddingVertical={5}
                      PaddingHorizontal={0}
                      onPress={() => handleDelete(item)}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CarDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVerticalTop: 20,
    backgroundColor: "#fff",
  },
  ContactContainer: {
    backgroundColor: "#fff",
    width: "97%",
    height: height / 8.9,
    marginVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
    elevation: 15,
    shadowColor: "#adadadc9",
  },
  DropDownStyle: {
    borderColor: "#a8a8a8",
    backgroundColor: "#2c65e0",
    marginTop: 0,
    width: width / 3.2,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    shadowColor: "#2c65e0",
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  textColor: {
    color: "#000",
  },
  placeHolderText: { color: "#fff" },
  dropDownContainerStyle: {
    borderWidth: 0,
    elevation: 10,
    backgroundColor: "#F8F8F8",
    zIndex: 100,
    width: width / 3.2,
    color: "#000",
  },
  textContact: {
    marginHoroizontal: 24,
    fontSize: 18,
    fontWeight: "bold",
  },
  AddCarButton: {
    alignSelf: "flex-end",
    marginHorizontal: 20,
  },
  textContac2t: {
    fontSize: 18,
    color: "red",
  },
  contactContainer: {
    width: width / 5,
    height: width / 5,
    borderRadius: 15,
    backgroundColor: "#f1f1f5",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: width * 0.01,
  },
  tinyLogo: {
    width: width / 5.5,
    height: width / 5.5,
    resizeMode: "contain",
    alignSelf: "center",
  },
  ImageContainer: {
    width: width / 9,
    height: width / 9,
    // borderWidth: 2,
    padding: 10,
  },
  detailsContainer: {
    width: "75%",
    alignSelf: "center",
    height: "70%",
    marginHorizontal: 15,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  deleteContainer: {
    width: width / 2.5,
    alignSelf: "flex-end",
  },
  nameText: {
    fontSize: height * 0.0175,
    fontWeight: "800",
    color: "#000",
  },
  addressText: {
    fontSize: height * 0.0175,
    fontWeight: "800",
    color: "#000",
  },
  detailsText: {
    fontSize: height * 0.0165,
    fontWeight: "500",
    marginBottom: 10,
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
  CarContainer: {
    flex: 1,
  },
});
