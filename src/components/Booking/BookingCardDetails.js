import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import ImagePicker from "react-native-image-crop-picker";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomButton from "../Button/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import AdminCalenderModal from "../../Admin/AdminCalenderModal";
import { adminBookingModalReducer } from "../../../hooks/Slice";
import { StatusBar } from "react-native";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import storage from "@react-native-firebase/storage";

const requestLocationPermission = async () => {
  try {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
        return true;
      } else {
        console.log("Location permission denied");
        return false;
      }
    } else if (Platform.OS === "ios") {
      const permission = await Geolocation.requestAuthorization("whenInUse"); // or 'always'

      if (permission === "granted") {
        console.log("Location permission granted");
        // Proceed with using geolocation services
        return true;
      } else {
        console.log("Location permission denied");
        return false;
      }
    }
  } catch (error) {
    console.error("Error requesting location permission: ", error);
    return false;
  }
};

const { width, height } = Dimensions.get("window");
const BookingCardDetails = () => {
  const [location, setLocation] = useState();
  const [locationLoded, setlocationLoded] = useState(false);
  const [avatarSource, setavatarSource] = useState({
    url: "https://cdn-icons-png.flaticon.com/128/7605/7605498.png",
    uploaded: 0,
  });
  const [avatarSourceGallery, setavatarSourceGallery] = useState({
    url: "https://cdn-icons-png.flaticon.com/512/7733/7733592.png",
    uploaded: 0,
  });
  const [value, setValue] = useState([]);
  const [EmployeeValue, setEmployeeValue] = useState([]);
  const [items, setItems] = useState([
    { label: "Started", value: "Started" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
  ]);
  const [EmployeeItems, setEmployeeItem] = useState([]);
  const [open, setOpen] = useState(false);
  const [EmployeeOpen, setEmployeeOpen] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [MultipleData, setMultipleData] = useState([]);
  const [selectedExpertDropdown, setSelectedExpertDropdown] = useState([]);
  const [mondayDate, setmondayDate] = useState([
    "2023-09-04",
    "2023-09-11",
    "2023-09-18",
    "2023-09-25",
  ]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const adminModal = useSelector(
    (state) => state.globalStore.AdminBookingModal
  );

  const route = useRoute(); // Use useRoute to access the route object
  useEffect(() => {
    getLocation();
    setSelectedData(route.params.item);
    setEmployeeItem(route.params.employeeData);
    setmondayDate(disableMondaysForYear(2023));
    console.log(route.params.employeeData);
  }, []);

  const performAsyncAction = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(50);
    setMultipleData(Object.keys(adminModal.dateSelected));
    console.log("MultipleData", MultipleData);
    if (adminModal.status) {
      StatusBar.setBarStyle("dark-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.5)");
      }
    } else {
      StatusBar.setBarStyle("dark-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("transparent");
      }
    }
  };

  useEffect(() => {
    performAsyncAction();
    return () => {
      StatusBar.setBarStyle("default");
    };
  }, [adminModal.status]);

  // Use useFocusEffect to add a listener
  // Use useFocusEffect to add a listener
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (e.data.action.type === "GO_BACK") {
        dispatch(
          adminBookingModalReducer({
            status: false,
            dateSelected: {},
          })
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const disableMondaysForYear = (year) => {
    const disabledDays = [];

    // Calculate the date of the first Monday in January
    const firstDayOfYear = new Date(year, 0, 1); // January is month 0
    const dayOfWeek = firstDayOfYear.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysUntilMonday = dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    const firstMonday = new Date(year, 0, daysUntilMonday + 1);

    // Loop through the year, adding 7 days to each Monday to find all Mondays
    const currentMonday = firstMonday;
    while (currentMonday.getFullYear() === year) {
      const dateString = `${year}-${currentMonday.getMonth() < 9 ? "0" : ""}${
        currentMonday.getMonth() + 1
      }-${currentMonday.getDate() < 10 ? "0" : ""}${currentMonday.getDate()}`;
      disabledDays.push(dateString);
      currentMonday.setDate(currentMonday.getDate() + 7); // Add 7 days to find the next Monday
    }

    // Create the object with disabled dates
    const additionalMarkedDates = Object.fromEntries(
      disabledDays?.map((dateString) => [dateString, { disabled: true }])
    );

    return additionalMarkedDates;
  };

  const openDirections = (latitude, longitude) => {
    const userLat = location?.coords.latitude; // Replace with the user's current latitude
    const userLng = location?.coords.longitude; // Replace with the user's current longitude
    const destination = `${latitude},${longitude}`;

    // Construct the Google Maps URL for directions
    const mapUrl = Platform.select({
      ios: `https://maps.apple.com/maps?daddr=${destination}&saddr=${userLat},${userLng}`,
      android: `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination}`,
    });

    Linking.openURL(mapUrl).catch((error) => {
      console.error("Error opening directions:", error);
    });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "Can we access your Camera?",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === "granted") {
          console.log("You can use Camera");
          return true;
        } else {
          console.log("You cannot use Camera");
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  };

  const handleImage = async () => {
    requestCameraPermission().then(async (res) => {
      await ImagePicker.openCamera({
        width: width / 1.5,
        height: width / 1.5,
      })
        .then(async (image) => {
          await setavatarSource({
            url: Platform.OS === "ios" ? image.sourceURL : image.path,
            uploaded: 1,
          });
        })
        .catch((err) => {
          console.log("Image => ", err);
        });
    });
  };

  const handleImageGallery = async () => {
    requestCameraPermission().then(async (res) => {
      await ImagePicker.openPicker({
        width: width / 1.5,
        height: width / 1.5,
      })
        .then(async (image) => {
          await setavatarSourceGallery({
            url: Platform.OS === "ios" ? image.sourceURL : image.path,
            uploaded: 1,
          });
        })
        .catch((err) => {
          console.log("Image => ", err);
        });
    });
  };

  const getLocation = async () => {
    const result = requestLocationPermission()
      .then((res) => {
        console.log(res);
        if (res) {
          Geolocation.getCurrentPosition(
            (position) => {
              setlocationLoded(true);
              console.log("position", position);
              setLocation(position);
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
              setlocationLoded(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      })
      .catch((err) => console.log("err", err));
  };

  const showDatePicker = () => {
    console.log("Loading");
    dispatch(
      adminBookingModalReducer({
        status: true,
        dateSelected: {},
      })
    );
  };

  const handleAdminPress = async () => {
    await firestore()
      .collection("Bookings")
      .doc(selectedData.id)
      .update({
        ServiceDates: Object.keys(adminModal.dateSelected)?.map((date) => ({
          date,
          status: "Pending",
        })),
        assighedExpert: selectedExpertDropdown,
        latestServiceDate: Object.keys(adminModal.dateSelected)[0],
      });
    const EmployeeCollectionRef = firestore()
      .collection("Users")
      .doc(selectedExpertDropdown.value);
    const EmployeeQuerySnapshot = await EmployeeCollectionRef.get();
    const updatedBookings = {
      ...selectedData,
      ServiceDates: Object.keys(adminModal.dateSelected)?.map((date) => ({
        date,
        status: "Pending",
      })),
      assighedExpert: selectedExpertDropdown,
      latestServiceDate: Object.keys(adminModal.dateSelected)[0],
    };
    let d = EmployeeQuerySnapshot.data();
    d.assignedBookings.push(updatedBookings); //
    firestore().collection("Users").doc(selectedExpertDropdown.value).update({
      assignedBookings: d.assignedBookings,
    });
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Service details are updated🙂",
      visibilityTime: 2000,
      style: {
        backgroundColor: "green",
      },
    });
    navigation.goBack();
  };

  const handlUploadImage = async () => {
    try {
      if (avatarSource.uploaded === 1 && avatarSourceGallery.uploaded === 1) {
        let fileName1 = avatarSource.url.substring(
          avatarSource?.url.lastIndexOf("/") + 1
        );
        storage()
          .ref(`Bookings/${fileName1}`)
          .putFile(avatarSource.url)
          .then((snapshot) => {
            console.log("Upload successful:", snapshot);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
        let fileName2 = avatarSourceGallery.url.substring(
          avatarSourceGallery?.url.lastIndexOf("/") + 1
        );
        storage()
          .ref(`Bookings/${fileName2}`)
          .putFile(avatarSourceGallery.url)
          .then((snapshot) => {
            console.log("Upload successful:", snapshot);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
        return [fileName1, fileName2];
      } else if (avatarSource.uploaded === 1) {
        let fileName = avatarSource.url.substring(
          avatarSource?.url.lastIndexOf("/") + 1
        );
        storage()
          .ref(`/Bookings/${fileName}`)
          .putFile(avatarSource.url)
          .then((snapshot) => {})
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
        return [fileName];
      } else if (avatarSourceGallery.uploaded === 1) {
        let fileName = avatarSourceGallery.url.substring(
          avatarSourceGallery?.url.lastIndexOf("/") + 1
        );
        storage()
          .ref(`/Bookings/${fileName}`)
          .putFile(avatarSourceGallery.url)
          .then((snapshot) => {
            console.log("Upload successful:", snapshot);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
        return [fileName];
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmployeePress = async () => {
    const imageUploaded = await handlUploadImage();
    let modifiedDate = selectedData?.ServiceDates?.map((item) => {
      if (item.date === selectedData.latestServiceDate) {
        return { ...item, status: value, images: imageUploaded };
      } else {
        return item;
      }
    });
    const firstPendingItem = modifiedDate?.filter(
      (item) => item?.status === "Pending"
    );
    console.log("firstPendingItem => ", firstPendingItem);
    try {
      if (firstPendingItem.length === 0) {
        await firestore().collection("Bookings").doc(selectedData.id).update({
          Status: "Completed",
          ServiceDates: modifiedDate,
        });
      } else {
        await firestore().collection("Bookings").doc(selectedData.id).update({
          ServiceDates: modifiedDate,
          latestServiceDate: firstPendingItem[0].date,
        });
      }
    } catch (error) {
      console.log("Bookings Error => ", error);
    }

    try {
      const EmployeeCollectionRef = firestore()
        .collection("Users")
        .doc(loggedInUser.uid);
      const EmployeeQuerySnapshot = await EmployeeCollectionRef.get();
      let d = EmployeeQuerySnapshot.data();
      let modifiedBooking;
      if (firstPendingItem.length === 0) {
        modifiedBooking = d?.assignedBookings?.map((data) => {
          if (data.id === selectedData.id) {
            return {
              ...data,
              ServiceDates: modifiedDate,
              Status: "Completed",
            };
          } else {
            return data;
          }
        });
      } else {
        modifiedBooking = d?.assignedBookings?.map((data) => {
          if (data.id === selectedData.id) {
            return {
              ...data,
              ServiceDates: modifiedDate,
              latestServiceDate: firstPendingItem[0].date,
            };
          } else {
            return data;
          }
        });
      }

      firestore().collection("Users").doc(loggedInUser.uid).update({
        assignedBookings: modifiedBooking,
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Service details are updated🙂",
        visibilityTime: 2000,
        style: {
          backgroundColor: "green",
        },
      });
      navigation.goBack();
    } catch (error) {
      console.log("Users Error => ", error);
    }
  };

  const navigateToDates = () => {
    navigation.navigate("BookingDetailsForDates", {
      item: selectedData,
    });
  };

  return (
    <View style={styles.Container}>
      <Header headerText={"Subscriprion Booking"} />
      <ScrollView>
        <View style={styles.MainContainer}>
          <View style={styles.TopVehicleNumberContainer}>
            <Text style={styles.title}>{selectedData?.UserEmail}</Text>
            <Text style={styles.carName}>
              {selectedData?.CarType?.VehicleBrand} -{" "}
              {selectedData?.CarType?.VehicleModal} -{" "}
              {selectedData?.CarType?.VehicleType}
            </Text>
            <Text style={styles.carNumber}>
              {selectedData?.CarType?.VehicleNumber}
            </Text>
          </View>
          <Text style={styles.parkingLabel}>Parking Location</Text>
          <Text style={styles.parkingValue}>{selectedData?.Address?.type}</Text>
          <Text style={styles.parkingValue}>
            {selectedData?.Address?.address}
          </Text>
          {selectedData?.Address?.parkingLocation !== "N/A" ? (
            <Text style={styles.parkingValue}>
              Parking Location - {selectedData?.Address?.parkingLocation}
            </Text>
          ) : null}
          {selectedData?.Address?.parkingNumber !== "N/A" ? (
            <Text style={styles.parkingValue}>
              Parking Number - {selectedData?.Address?.parkingNumber}
            </Text>
          ) : null}
          {locationLoded ? (
            <View style={styles.MainMapContainer}>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.mapStyle}
                  initialRegion={{
                    latitude: selectedData?.Coordinates?.latitude, // Replace with the same coordinates as in regionData
                    longitude: selectedData?.Coordinates?.longitude,
                    latitudeDelta: 0.0148089182622968,
                    longitudeDelta: 0.0421,
                  }}
                  zoomControlEnabled={false}
                  zoomEnabled={false}
                  scrollEnabled={false}
                  pitchEnabled={true}
                  rotateEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: selectedData?.Coordinates?.latitude,
                      longitude: selectedData?.Coordinates?.longitude,
                    }}
                    style={styles.customMarker}
                  >
                    <Image
                      style={styles.IconImageStyle}
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/9800/9800512.png",
                      }}
                    />
                  </Marker>
                </MapView>
              </View>
              <TouchableOpacity
                onPress={() =>
                  openDirections(
                    selectedData?.Coordinates?.latitude,
                    selectedData?.Coordinates?.longitude
                  )
                }
                style={styles.NavigateToContainer}
              >
                <Image
                  style={styles.MapsIconImageStyle}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/1946/1946781.png",
                  }}
                />
                <Image
                  style={styles.MapsIconImageStyle}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/128/2335/2335353.png",
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator />
          )}
          <Text style={styles.parkingLabel}>Add On Services</Text>
          <Text style={styles.parkingValue}>
            {selectedData?.AddOnService?.length > 0
              ? selectedData?.AddOnService?.map((data, index) => {
                  if (index === selectedData?.AddOnService?.length - 1) {
                    return data;
                  } else {
                    return data + " -- ";
                  }
                })
              : "No add on services seleted"}
          </Text>
          <Text style={styles.parkingLabel}>Booking Date</Text>
          <Text style={styles.parkingValue}>
            {selectedData?.BookingDate?.slice(0, 16)}
          </Text>
          {loggedInUser.isEmployee &&
            (selectedData?.Status === "Completed" ? null : (
              <View>
                <Text style={styles.parkingLabel}>Upload Image</Text>
                <View style={styles.uploadImage}>
                  <TouchableOpacity
                    onPress={() => handleImage()}
                    activeOpacity={0.9}
                  >
                    <Image
                      style={styles.ImageIconImageStyle}
                      source={{ uri: avatarSource.url }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.parkingLabel}>Or</Text>
                  <TouchableOpacity
                    onPress={() => handleImageGallery()}
                    activeOpacity={0.9}
                  >
                    <Image
                      style={styles.ImageIconImageStyle}
                      source={{ uri: avatarSourceGallery.url }}
                    />
                  </TouchableOpacity>
                  <CustomButton
                    onPress={handlUploadImage}
                    customWidth={width / 4}
                    title={"Upload"}
                    customHeight={50}
                  />
                </View>
              </View>
            ))}
          {loggedInUser.isAdmin && (
            <Text style={styles.parkingLabel}>Select Booking Dates</Text>
          )}
          {loggedInUser.isAdmin ? (
            selectedData?.ServiceDates?.length > 0 ||
            selectedData?.ServiceDates !== undefined ? (
              <TouchableOpacity
                activeOpacity={0.4}
                style={styles.dateContainer}
              >
                <Text
                  onPress={() => navigateToDates(selectedData)}
                  style={[
                    styles.parkingValue,
                    {
                      borderWidth: 0,
                      borderRadius: 10,
                      padding: 10,
                      marginVertical: 12,
                      backgroundColor: "#E0EED0",
                      color: "#000",
                      fontWeight: "700",
                    },
                  ]}
                >
                  Click here to see the details for individual dates{" "}
                </Text>
              </TouchableOpacity>
            ) : loggedInUser.isAdmin &&
              Object.keys(adminModal.dateSelected).length === 0 ? (
              <Text onPress={showDatePicker} style={styles.parkingValue}>
                Click here to select date
              </Text>
            ) : (
              <View style={styles.dateContainer}>
                {MultipleData?.map((dateKey, index) => (
                  <Text key={index} style={styles.dateText}>
                    {moment(dateKey).format("DD-MMM-YYYY")}
                  </Text>
                ))}
              </View>
            )
          ) : null}
          {loggedInUser.isAdmin
            ? adminModal?.status && (
                <AdminCalenderModal mondayDate={mondayDate} />
              )
            : null}
          {loggedInUser.isEmployee && (
            <Text
              style={[
                styles.parkingLabel,
                {
                  fontSize: selectedData?.Status === "Completed" ? 26 : 17,
                  color:
                    selectedData?.Status === "Completed"
                      ? "#009255"
                      : "#333333",
                  alignSelf:
                    selectedData?.Status === "Completed"
                      ? "center"
                      : "flex-start",
                },
              ]}
            >
              {" "}
              {loggedInUser.isAdmin
                ? selectedData?.Status === "Completed"
                  ? "Completed"
                  : "Assign an Expert"
                : selectedData?.Status === "Completed"
                ? "Completed"
                : "Select Status"}
            </Text>
          )}

          {loggedInUser.isAdmin ? (
            selectedData?.Status === "Completed" ? null : (
              <DropDownPicker
                open={EmployeeOpen}
                value={EmployeeValue}
                items={EmployeeItems}
                setOpen={setEmployeeOpen}
                setValue={setEmployeeValue}
                setItems={setEmployeeItem}
                placeholder="Assign an expert"
                style={styles.DropDownStyle}
                textStyle={styles.textColor}
                badgeDotColors={"red"}
                mode="BADGE"
                multiple={false}
                dropDownDirection="TOP"
                extendableBadgeContainer={true}
                placeholderStyle={styles.placeHolderText}
                onChangeValue={() => setEmployeeOpen(false)}
                onSelectItem={(item) => setSelectedExpertDropdown(item)}
                ArrowDownIconComponent={() => (
                  <EvilIcons
                    onPress={() => setEmployeeOpen(true)}
                    style={styles.Icon}
                    name="chevron-down"
                    size={30}
                    color={"#2c65e0"}
                  />
                )}
                ArrowUpIconComponent={() => (
                  <EvilIcons
                    onPress={() => setEmployeeOpen(false)}
                    style={styles.Icon}
                    name="chevron-up"
                    size={30}
                    color={"#2c65e0"}
                  />
                )}
                dropDownContainerStyle={styles.dropDownContainerStyle}
              />
            )
          ) : loggedInUser.isEmployee ? (
            selectedData?.Status === "Completed" ? null : (
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Status of the Job"
                style={styles.DropDownStyle}
                textStyle={styles.textColor}
                zIndex={100}
                multiple={false}
                extendableBadgeContainer={true}
                dropDownDirection="TOP"
                placeholderStyle={styles.placeHolderText}
                onChangeValue={() => setOpen(false)}
                ArrowDownIconComponent={() => (
                  <EvilIcons
                    onPress={() => setOpen(true)}
                    style={styles.Icon}
                    name="chevron-down"
                    size={30}
                    color={"#2c65e0"}
                  />
                )}
                ArrowUpIconComponent={() => (
                  <EvilIcons
                    onPress={() => setOpen(false)}
                    style={styles.Icon}
                    name="chevron-up"
                    size={30}
                    color={"#2c65e0"}
                  />
                )}
                dropDownContainerStyle={styles.dropDownContainerStyle}
              />
            )
          ) : null}
        </View>
        <View style={styles.ButtonContainer}>
          {loggedInUser.isAdmin ? (
            selectedData?.Status === "Completed" ? null : (
              <CustomButton onPress={handleAdminPress} title={"Submit"} />
            )
          ) : loggedInUser.isEmployee ? (
            selectedData?.Status === "Completed" ? null : (
              <CustomButton
                onPress={() => handleEmployeePress()}
                title={"Submit"}
              />
            )
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingCardDetails;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#f5f8fd",
  },
  MainMapContainer: {
    top: 10,
  },
  mapContainer: {
    borderRadius: 25, // Adjust the border radius as needed
    top: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#EAEAEA",
        shadowOffset: { width: 1, height: 4 },
        shadowOpacity: 2.5,
        shadowRadius: 2,
      },
      // Shadow properties for Android
      android: {
        elevation: 2,
        shadowOffset: 0.2,
        shadowColor: "#EAEAEA",
      },
    }),
  },
  mapStyle: {
    width: width - 30,
    height: height / 8,
    alignSelf: "flex-start",
    borderRadius: 20,
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#EAEAEA",
        shadowOffset: { width: 1, height: 4 },
        shadowOpacity: 2.5,
        shadowRadius: 2,
      },
      // Shadow properties for Android
      android: {
        elevation: 2,
        shadowOffset: 0.2,
        shadowColor: "#EAEAEA",
      },
    }),
  },
  MainContainer: {
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  TopVehicleNumberContainer: {
    backgroundColor: "#BECFF7",
    padding: 5,
    width: width - 10,
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c65e0",
  },
  carName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 10,
  },
  carNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#424242",
    marginTop: 5,
  },
  parkingLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 15,
  },
  parkingValue: {
    fontSize: 15,
    fontWeight: "normal",
    color: "#999999",
  },
  customMarker: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  markerText: {
    fontWeight: "bold",
    color: "blue",
  },
  IconImageStyle: {
    width: height * 0.07,
    height: height * 0.04,
    resizeMode: "contain",
  },
  MapsIconImageStyle: {
    width: height * 0.03,
    height: height * 0.03,
    resizeMode: "contain",
  },
  ImageIconImageStyle: {
    width: height * 0.065,
    height: height * 0.065,
    resizeMode: "contain",
  },
  NavigateToContainer: {
    flexDirection: "row",
    alignContent: "center",
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    top: "-10.5%",
    left: "-10%",
    justifyContent: "space-between",
    alignItems: "center",
    width: "20%",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  NavigateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  DropDownStyle: {
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: "#a8a8a8",
    backgroundColor: "transparent",
    marginTop: 0,
  },
  textColor: {
    color: "#000",
  },
  placeHolderText: { color: "#a8a8a8" },
  dropDownContainerStyle: {
    borderWidth: 0,
    elevation: 10,
    backgroundColor: "#F8F8F8",
    zIndex: 100,
  },
  ButtonContainer: {
    marginTop: 30,
    zIndex: 2,
  },
  dateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateText: {
    fontSize: 16,
    color: "#a8a8a8",
    paddingHorizontal: 5,
  },
  uploadImage: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "70%",
  },
});
