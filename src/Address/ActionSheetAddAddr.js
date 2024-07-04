import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  TextInput,
} from "react-native";
import CustomButton from "../components/Button/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import _ from "lodash";
import { LoginReducerUpdate } from "../../hooks/Slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import LoadingButton from "../components/Button/LoadingButton";

const { width, height } = Dimensions.get("window");

let addrType = [
  {
    id: 0,
    type: "Appartment",
  },
  {
    id: 1,
    type: "Home",
  },
  {
    id: 2,
    type: "Other",
  },
];

const ActionSheetAddAddr = ({ location, selecedLcation }) => {
  const [addressTypeId, setaddressTypeId] = useState(0);
  const [selectedAddrType, setselectedAddrType] = useState("Appartment");
  const [selectedFinalAddrType, setselectedFinalAddrType] =
    useState("Appartment");
  const [completeAddress, setcompleteAddress] = useState();
  const [parkingLocation, setparkingLocation] = useState();
  const [parkingNumber, setparkingNumber] = useState();
  const [pinCode, setpinCode] = useState();
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const reducer = useSelector((state) => state.globalStore);
  const navigation = useNavigation();

  const handleAddressTypeId = (data) => {
    setaddressTypeId(data.id);
    setselectedAddrType(data.type);
    setselectedFinalAddrType(data.type);
  };

  async function checkForEmptyValues(...values) {
    let emptyValues = "";
    await values.reduce((acc, value, index) => {
      if (!value || _.isEmpty(value)) {
        if (index === 0) {
          emptyValues = emptyValues.concat("Address"); // Assign the result back to emptyValues
        } else if (index === 1) {
          emptyValues = emptyValues.concat("-Pincode");
        } else if (index === 2) {
          emptyValues = emptyValues.concat("-Parking location");
        } else if (index === 3) {
          emptyValues = emptyValues.concat("-Parking number");
        }
      }
    }, []);

    return emptyValues;
  }

  const handlePress = async () => {
    let emptyValues;
    setLoading(true);
    if (selectedAddrType !== "Appartment") {
      emptyValues = await checkForEmptyValues(completeAddress, pinCode);
    } else {
      emptyValues = await checkForEmptyValues(
        completeAddress,
        pinCode,
        parkingLocation,
        parkingNumber
      );
    }
    if (emptyValues.length > 1) {
      Toast.show({
        type: "error",
        text1: `${emptyValues} are empty!`,
        text2: "Fill these to continue🙂",
        visibilityTime: 5000,
        style: {
          backgroundColor: "green",
        },
      });
    } else {
      await firestore()
        .collection("Users")
        .doc(reducer.LoggedInUserData.uid)
        .update({
          assignedBookings: [],
          address: {
            coordinates: location,
            type: selectedFinalAddrType,
            address: completeAddress + pinCode,
            parkingLocation:
              selectedAddrType !== "Appartment" ? "N/A" : parkingLocation,
            parkingNumber:
              selectedAddrType !== "Appartment" ? "N/A" : parkingNumber,
          },
        })
        .then(async () => {
          const lastLoginTimestamp = await AsyncStorage.getItem(
            "@last_login_timestamp"
          );
          const parsedData = JSON.parse(lastLoginTimestamp);
          const userData = {
            userDetails: {
              ...parsedData.userDetails,
              address: {
                coordinates: location,
                type: selectedFinalAddrType,
                address: completeAddress + " - " + pinCode,
                parkingLocation:
                  selectedAddrType !== "Appartment" ? "N/A" : parkingLocation,
                parkingNumber:
                  selectedAddrType !== "Appartment" ? "N/A" : parkingNumber,
              },
            },
            isAuthenticated: reducer.isAuthenticated,
          };
          dispatch(LoginReducerUpdate(userData));
          AsyncStorage.setItem(
            "@last_login_timestamp",
            JSON.stringify(userData)
          ); // Set the initial timestamp
          navigation.goBack();
        });
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Your vehicle is added successfully🙂",
        visibilityTime: 2000,
        style: {
          backgroundColor: "green",
        },
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.ContentContainer}>
        <Text style={styles.heading}>
          You have two options to set the location. You can either click on the
          map or manually enter the location in the input box below
        </Text>
        <Text style={styles.addressSubHeadings}>Save address as</Text>
        <View style={styles.rowContainer}>
          <View style={styles.addressTypeContainer}>
            {addrType.map((data) => {
              return (
                <TouchableOpacity
                  key={data.id}
                  activeOpacity={0.8}
                  onPress={() => handleAddressTypeId(data)}
                >
                  <Text
                    key={data.id}
                    style={
                      addressTypeId === data.id
                        ? styles.SelectedAddressTypeText
                        : styles.NonSelectedAddressTypeText
                    }
                  >
                    {data.type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedAddrType === "Other" ? (
            <TextInput
              placeholder="Save as                                   "
              placeholderTextColor={"#ccc"}
              style={[styles.input, styles.typePadding]}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setselectedFinalAddrType(text)}
            />
          ) : null}
        </View>
        <Text style={styles.addressSubHeadings}>Complete address *</Text>
        <TextInput
          placeholder="House no / Flate Name and addresss"
          placeholderTextColor={"#ccc"}
          style={styles.input}
          value={completeAddress}
          onChangeText={(text) => setcompleteAddress(text)}
          underlineColorAndroid="transparent"
        />
        {selectedAddrType === "Appartment" ? (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.addressSubHeadings}>Parking Location *</Text>
              <TextInput
                placeholder="If no then type na or N/A"
                placeholderTextColor={"#ccc"}
                style={[styles.input, { width: width / 2 }]}
                value={parkingLocation}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setparkingLocation(text)}
              />
            </View>
            <View>
              <Text style={styles.addressSubHeadings}>Parking no *</Text>
              <TextInput
                placeholder="If no then type na or N/A"
                placeholderTextColor={"#ccc"}
                style={[styles.input, { width: width / 2.6 }]}
                value={parkingNumber}
                underlineColorAndroid="transparent"
                onChangeText={(text) => setparkingNumber(text)}
              />
            </View>
          </View>
        ) : null}

        <Text style={styles.addressSubHeadings}>Pin code *</Text>
        <TextInput
          placeholder="Pin code"
          placeholderTextColor={"#ccc"}
          style={styles.input}
          value={pinCode}
          underlineColorAndroid="transparent"
          keyboardType="number-pad"
          onChangeText={(number) => setpinCode(number)}
        />
      </View>
      <LoadingButton
        handleSignIn={handlePress}
        text={"Add address"}
        loadingProp={Loading}
      />
    </View>
  );
};

export default ActionSheetAddAddr;

const styles = StyleSheet.create({
  container: {
    width: width,
    paddingVertical: 10,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 8,
    backgroundColor: "#fff",
  },
  overlay: {
    backgroundColor: "red",
  },
  sheet: {
    backgroundColor: "#fff",
  },
  ContentContainer: {
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  heading: {
    fontSize: height * 0.015,
    fontWeight: "500",
    color: "#000",
    textAlign: "left",
    padding: 10,
    borderWidth: 0.4,
    borderRadius: 15,
    overflow: "hidden",
  },
  addressSubHeadings: {
    fontSize: 14,
    fontWeight: "300",
    color: "#000",
    paddingVertical: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addressTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  SelectedAddressTypeText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "300",
    backgroundColor: "#2c65e0",
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginHorizontal: 5,
    borderRadius: 9,
    overflow: "hidden",
  },
  NonSelectedAddressTypeText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "300",
    backgroundColor: "#ffff",
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginHorizontal: 5,
    borderRadius: 9,
    elevation: 5,
    shadowColor: "#000",
  },
  input: {
    width: "auto",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#000",
    padding: 0,
  },
  typePadding: {
    marginHorizontal: 10,
  },
});
