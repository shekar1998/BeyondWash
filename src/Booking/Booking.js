import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import CalanderModal from "./CalanderModal";
import { bookingModalReducer } from "../../hooks/Slice";
import _ from "lodash";
import LoadingButton from "../components/Button/LoadingButton";
import RazorpayCheckout from "react-native-razorpay";
import { RAZORPAY_KEY } from "./../Payment/constant";

const { width, height } = Dimensions.get("window");

const Booking = () => {
  const navigation = useNavigation();
  const reducer = useSelector((state) => state.globalStore);
  const [open, setOpen] = useState(false);
  const [mondayDate, setmondayDate] = useState([
    "2023-09-04",
    "2023-09-11",
    "2023-09-18",
    "2023-09-25",
  ]);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const [value, setValue] = useState([]);
  const [Frequencyopen, setFrequencyOpen] = useState(false);
  const [Frequencyvalue, setFrequencyValue] = useState(
    reducer?.selectedPlan.toLowerCase()
  );
  const dateYear = useSelector((state) => state.globalStore.currentYear);

  const selectedCar = useSelector((state) => state.globalStore.selectedCarType);
  const [items, setItems] = useState([
    { label: "Basic  Internal Clean", value: "Basic  Internal Clean" },
    { label: "Fabric Polish", value: "Fabric Polish" },
    { label: "Vaccume Cleaning", value: "Vaccume Cleaning" },
  ]);
  const [Frequencyitems, setFrequencyItems] = useState([
    { label: "Alternative days", value: "alternative days" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ]);
  const modalView = useSelector((state) => state.globalStore.bookingModal);

  console.log(modalView);
  const [address, setAddress] = useState("");
  const [Loading, setLoading] = useState(false);
  const [modalPrice, setModalPrice] = useState(0);

  const performAsyncAction = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(50);

    if (modalView.status) {
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
    switch (selectedCar.VehicleType.toLowerCase()) {
      case "hatchback": {
        setModalPrice(500);
        break;
      }
      case "sedan": {
        setModalPrice(600);
        break;
      }
      case "compact suv": {
        setModalPrice(700);
        break;
      }
      case "suv": {
        setModalPrice(800);
        break;
      }
      case "luxury": {
        setModalPrice(900);
        break;
      }
      default:
        break;
    }
    return () => {
      StatusBar.setBarStyle("default");
    };
  }, [modalView.status]);

  useEffect(() => {
    setmondayDate(disableMondaysForYear(dateYear));
    validateAddress(loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    setmondayDate(disableMondaysForYear(dateYear));
    console.log("Executed First");
  }, [dateYear]);

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

  const handleSelectedAddress = () => {
    navigation.navigate("AddAddress");
  };

  const showDatePicker = () => {
    console.log("WORKING");
    dispatch(
      bookingModalReducer({
        status: true,
        dateSelected: {},
      })
    );
  };

  const handleGetStarted = async () => {
    const imgURL =
      "https://m.media-amazon.com/images/I/61L5QgPvgqL._AC_UF1000,1000_QL80_.jpg";
    let options = {
      description: "Credits towards consultation",
      image: imgURL, //require('../../images.png')
      currency: "INR", //In USD - only card option will exist rest(like wallet, UPI, EMI etc) will hide
      key: RAZORPAY_KEY,
      amount: (modalPrice - (modalPrice / 100) * 10) * 100,
      name: "Beyond Wash",
      order_id: "", //Replace this with an order_id(response.data.orderId) created using Orders API.
      prefill: {
        email: reducer.LoggedInUserData.email,
        contact: reducer.LoggedInUserData.mobileNumber,
        name: reducer.LoggedInUserData.displayName,
      }, //if prefill is not provided then on razorpay screen it has to be manually entered.
      theme: { color: "#2463eb" },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        navigation.navigate("SubscribeSuccess", {
          bookingDetails: {
            AddOnService: value,
            Address: reducer.LoggedInUserData?.address,
            Coordinates: reducer.LoggedInUserData?.address.coordinates,
            BookingDate: new Date().toString(),
            CarType: selectedCar,
            CurrentScheduledDate: modalView.dateSelected,
            Frequency: Frequencyvalue,
            FutureScheduledDate: modalView.dateSelected,
            OriginalPrice: 10,
            Price: 230,
            StartsFrom: modalView.dateSelected,
            Status: "Active",
            UserEmail: reducer.LoggedInUserData.email,
            DisplayName: reducer.LoggedInUserData.displayName,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const AddOnServiceOpen = () => {
    setFrequencyOpen(false);
  };

  const FrequencyOpen = () => {
    setOpen(false);
  };

  const validateAddress = async (loggedInUserProp) => {
    let tempAdd = "";
    console.log("loggedInUserProp", loggedInUserProp?.address === "");
    if (
      loggedInUserProp?.address === "" ||
      loggedInUserProp?.address === undefined
    ) {
      tempAdd = "+ No address found click here to add one.";
      setAddress(tempAdd);
    } else {
      tempAdd = loggedInUserProp.address.address;
      tempAdd +=
        loggedInUserProp.address.parkingLocation === "N/A"
          ? ""
          : ` - ${loggedInUserProp.address.parkingLocation}`;
      tempAdd +=
        loggedInUserProp.address.parkingNumber === "N/A"
          ? ""
          : ` - ${loggedInUserProp.address.parkingNumber}`;
      setAddress(tempAdd);
    }
  };

  return (
    <View style={styles.container}>
      <Header headerText={"Subscriprion Booking"} />
      <Text style={styles.LableText}>Add on services</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        multiple={true}
        placeholder="Select a service"
        mode="BADGE"
        style={styles.DropDownStyle}
        textStyle={styles.textColor}
        extendableBadgeContainer={true}
        placeholderStyle={styles.placeHolderText}
        zIndex={12}
        ArrowDownIconComponent={() => (
          <EvilIcons
            onPress={() => {
              AddOnServiceOpen();
              setOpen(true);
            }}
            style={styles.Icon}
            name="chevron-down"
            size={height * 0.033}
            color={"#2c65e0"}
          />
        )}
        ArrowUpIconComponent={() => (
          <EvilIcons
            onPress={() => {
              AddOnServiceOpen();
              setOpen(false);
            }}
            style={styles.Icon}
            name="chevron-up"
            size={height * 0.033}
            color={"#2c65e0"}
          />
        )}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        renderBadgeItem={(item) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => +item.value}
              style={styles.ItemContainer}
            >
              <MaterialIcons
                style={styles.Icon}
                name="cancel"
                size={15}
                color={"#2c65e0"}
              />
              <Text style={styles.ItemText}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <Text style={styles.LableText}>Add an Address*</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleSelectedAddress}
        style={styles.selectDataContainer}
      >
        <Text style={styles.input}>{address}</Text>
      </TouchableOpacity>
      <Text style={styles.LableText}>Frequency*</Text>
      <DropDownPicker
        open={Frequencyopen}
        value={Frequencyvalue}
        items={Frequencyitems}
        setOpen={setFrequencyOpen}
        setValue={setFrequencyValue}
        setItems={setFrequencyItems}
        placeholder="Select an option"
        mode="BADGE"
        style={styles.DropDownStyle}
        zIndex={10}
        textStyle={styles.textColor}
        extendableBadgeContainer={true}
        placeholderStyle={styles.placeHolderText}
        ArrowDownIconComponent={() => (
          <EvilIcons
            onPress={() => {
              FrequencyOpen();
              setFrequencyOpen(true);
            }}
            style={styles.Icon}
            name="chevron-down"
            size={height * 0.033}
            color={"#2c65e0"}
          />
        )}
        ArrowUpIconComponent={() => (
          <EvilIcons
            onPress={() => {
              FrequencyOpen();
              setFrequencyOpen(false);
            }}
            style={styles.Icon}
            name="chevron-up"
            size={height * 0.033}
            color={"#2c65e0"}
          />
        )}
        dropDownContainerStyle={styles.dropDownContainerStyle}
      />
      <Text style={styles.LableText}>Starts From*</Text>
      <TouchableOpacity
        onPress={showDatePicker}
        style={styles.selectDataContainer}
      >
        <TextInput
          placeholder="Click here to select the date"
          placeholderTextColor={"#000"}
          style={styles.input}
          editable={false}
          value={modalView.dateSelected.length + " Days got selected"}
          underlineColorAndroid="transparent"
        />
      </TouchableOpacity>
      {modalView && <CalanderModal mondayDate={mondayDate} />}
      <View style={styles.MainPriceContainer}>
        <View style={styles.SelectedCarContainer}>
          <Image
            style={styles.Image}
            source={{
              uri: selectedCar.VehicleImage,
            }}
          />
          <View style={styles.SelectedCarContainerDetails}>
            <View style={styles.CarNameDetails}>
              <Text style={styles.Price}>{selectedCar?.VehicleBrand}</Text>
              <Text style={styles.GstText}>
                {selectedCar?.VehicleModal} | {selectedCar?.VehicleNumber}
              </Text>
            </View>
            <View style={styles.PriceContainer}>
              <Text style={styles.StrikePrice}>{modalPrice}</Text>
              <Text style={styles.Price}>
                {modalPrice - (modalPrice / 100) * 10}
              </Text>
              <Text style={styles.PricePerMonth}>/- Per Wash</Text>
            </View>
            <Text style={styles.GstText}>(Including Gst)</Text>
          </View>
        </View>
      </View>
      <View style={{ top: -height * 0.055 }}>
        <LoadingButton
          loadingProp={Loading}
          handleSignIn={handleGetStarted}
          text={"Get Started"}
        />
      </View>
    </View>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    justifyContent: "space-evenly",
  },
  DropDownStyle: {
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: "#a8a8a8",
    top: -5,
  },
  ItemContainer: {
    alignItems: "center",
    backgroundColor: "#e0e0e0d8",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent background with 0.5 opacity
    height: height,
  },
  ItemText: {
    color: "#000",
    paddingHorizontal: 15,
    fontWeight: "500",
  },
  dropDownContainerStyle: {
    borderWidth: 0,
    elevation: 10,
    backgroundColor: "#fff",
  },
  textColor: {
    color: "#000",
  },
  placeHolderText: { color: "#a8a8a8" },
  LableText: {
    color: "#000",
    textAlign: "left",
    paddingHorizontal: 10,
    fontSize: height * 0.019,
    paddingVertical: 5,
    marginTop: height * 0.018,
    fontWeight: "500",
  },
  AddrssListItemContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  NoAddrssListItemContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: height * 0.018,
  },
  input: {
    width: width - 30,
    borderBottomWidth: 1,
    borderColor: "#a8a8a8",
    color: "#000",
    fontWeight: "700",
    fontSize: height * 0.018,
    left: 8,
  },
  MainPriceContainer: {
    width: width - 50,
    height: height * 0.2,
    alignSelf: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#c9c9c9c9",
    backgroundColor: "#f0f0f0c9",
    top: -height * 0.055,
    paddingVertical: height * 0.019,
  },
  DailyPackage: {
    color: "#000",
    textAlign: "center",
    fontSize: height * 0.018,
    fontWeight: "800",
  },
  StrikePrice: {
    fontSize: height * 0.018,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "bottom",
    fontWeight: "600",
    textDecorationLine: "line-through",
    top: 2,
  },
  PriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  Price: {
    fontSize: height * 0.024,
    color: "#2c65e0",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    marginVertical: 10,
  },
  PricePerMonth: {
    fontSize: height * 0.018,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "bottom",
    fontWeight: "500",
  },
  GstText: {
    fontSize: height * 0.0153,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "bottom",
    fontWeight: "400",
    top: -10,
    marginBottom: height * 0.02,
  },
  Image: {
    width: "45%",
    height: "100%",
    resizeMode: "contain",
    alignSelf: "flex-start",
  },
  SelectedCarContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  SelectedCarContainerDetails: {
    height: height * 0.16,
  },
  CarNameDetails: {
    justifyContent: "space-evenly",
  },
});
