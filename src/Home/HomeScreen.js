import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import CustomCarousel from "./CustomCarousel";
import { useDispatch, useSelector } from "react-redux";
import Employee from "./../Employee/Employee";
import { useFocusEffect } from "@react-navigation/native";
import {
  CurrentYearReducer,
  OpenActionSheet,
  SelectedCarType,
} from "../../hooks/Slice";
import moment from "moment";
import InternetConnection from "../components/InternetConnection";
import SelectCar from "../AddCar/SelectCar";
import { CarConstants } from "../AddCar/Constants";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const NewHomeScreen = () => {
  const navigation = useNavigation();
  const navigationRef = useRef(null);
  const dispatch = useDispatch();
  navigationRef.current = navigation;
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  useEffect(() => {
    notifationCheck();

    async function notifationCheck() {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: "Geolocation Permission",
            message: "Can we access your location?",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === "granted") {
          return true;
        } else {
          console.log("You cannot use Geolocation");
          return false;
        }
      } else if (Platform.OS === "ios") {
      }
    }
  }, []);

  const performAsyncAction = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(500);
    StatusBar.setBarStyle("light-content");
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  };

  useEffect(() => {
    dispatch(CurrentYearReducer(moment().year()));
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

  const BasicData = [
    {
      id: 1,
      Type: "Car Wash",
      TimeTaken: "30 mins",
      Description: "Complete car exterior cleaning",
      ImageUrl: CarConstants.CarImage,
      Price: 400,
    },
    {
      id: 2,
      Type: "Bike Wash",
      TimeTaken: "30 mins",
      Description: "Complete bike washing and polishing",
      ImageUrl: CarConstants.BikeImage,
      Price: 300,
    },
  ];

  const carSelectedNavigate = (type) => {
    let finalType = type === "Car Wash" ? "Car" : "Bike";
    let finalVehicle = loggedInUser?.carDetails?.filter(
      (data) => data?.VehicleMotorType === finalType
    );
    if (finalVehicle?.length === 0 || finalVehicle === undefined) {
      navigation.navigate("CarDetails");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Please add ${finalType} to continue booking🙂`,
        visibilityTime: 4000,
        style: {
          backgroundColor: "green",
        },
      });
    } else {
      if (finalVehicle?.length > 1) {
        dispatch(
          OpenActionSheet({
            selectedValue: finalType,
            openValue: true,
            length: finalVehicle?.length,
          })
        );
      } else {
        dispatch(SelectedCarType(finalVehicle[0]));
        navigation.navigate("SubscribePlan");
      }
    }
  };

  const handleClick = () => {
    navigation.dispatch(DrawerActions.openDrawer());
    StatusBar.setBarStyle("dark-content");
  };

  const renderListItem = ({ item }) => {
    return (
      <View style={styles.MainContentContainer}>
        <View style={styles.ContentContainer}>
          <View style={styles.PackageTypeImageStyleContainer}>
            <Image
              style={styles.PackageTypeImageStyle}
              source={{
                uri: item?.ImageUrl,
              }}
            />
          </View>
          <View style={styles.DetailsContainer}>
            <Text style={styles.BasicText}>{item?.Type}</Text>
            <Text style={styles.BasicDescription}>{item?.Description}</Text>
          </View>
        </View>
        <View style={styles.TimeContainer}>
          <Ionicons
            style={styles.TimeImageStyle}
            name={"clock-time-five"}
            size={height * 0.02}
            color={"#2463eb"}
          />
          <Text style={styles.MinutesText}> {item?.TimeTaken}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.1}>
          <TouchableOpacity
            onPress={() => carSelectedNavigate(item?.Type)}
            activeOpacity={0.9}
            style={styles.buttonContainer}
          >
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>Starting From</Text>
              <Text style={styles.buttonText}>
                <Text style={styles.PriceText}>&#x20B9;{item?.Price}</Text>
                /Month
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.MainContainer}>
      <InternetConnection />
      {loggedInUser.isEmployee ? (
        <Employee />
      ) : (
        <>
          <Image
            style={styles.ImageStyle}
            source={require("../../assets/Carousel/radiant.png")}
          />
          <View style={styles.TopContainer}>
            <TouchableOpacity onPress={handleClick}>
              <View style={styles.NotifyContainer}>
                <View style={[styles.IconStyle, { width: width / 18 }]} />
                <View
                  style={[styles.IconStyle, { width: width / 23, left: -2 }]}
                />
                <View style={[styles.IconStyle, { width: width / 20 }]} />
              </View>
            </TouchableOpacity>
            <View style={styles.NameContainer}>
              <Text style={styles.NameText}>
                Hello {loggedInUser.displayName}
              </Text>
              <Text style={styles.WelcomeText}>Welcome Back!</Text>
            </View>
          </View>

          <View style={styles.CarouselContainer}>
            <CustomCarousel />
          </View>
          <View style={styles.PackageSection}>
            <View style={styles.PackageContainer}>
              <Text style={styles.PackageText}>Packages</Text>
              <Text style={styles.BenefitsText}>
                {" "}
                (Get Exclusive & Unlimited Benefits!)
              </Text>
            </View>
            <FlatList
              data={BasicData}
              horizontal={false}
              scrollEnabled={true}
              style={styles.FlatListStyle}
              renderItem={renderListItem}
            />
          </View>
          <SelectCar />
        </>
      )}
    </View>
  );
};

export default NewHomeScreen;

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: "#f5f8fd",
    flex: 1,
  },
  TopContainer: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    top: -height / 4.2,
    paddingHorizontal: 15,
    padding: 5,
  },
  NotifyContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff10",
  },
  NameContainer: {
    marginTop: 7,
  },
  PackageSection: {
    paddingHorizontal: 18,
    top: -height / 4.5,
    paddingBottom: 10,
  },
  CarouselContainer: {
    top: -height / 5.3,
    justifyContent: "center",
    height: height / 4.1,
  },
  MainContentContainer: {
    backgroundColor: "#ffffff",
    width: width - 35,
    alignSelf: "center",
    borderRadius: 12,
    padding: 18,
    marginVertical: 10,
    shadowOffset: { width: -1, height: 1 },
    shadowColor: "rgb(155, 155, 155)",
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
  },
  ContentContainer: {
    flexDirection: "row",
  },
  TimeContainer: {
    width: 60,
    flexDirection: "row",
    margin: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  MainPriceContainer: {
    backgroundColor: "#f1f1f5",
    marginTop: 8,
    borderRadius: 12,
    padding: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  PriceText: {
    color: "#0fcc66",
    fontWeight: "900",
  },
  ContainerDivider: {
    borderTopWidth: 0.8,
    width: width - width / 8.5,
    alignSelf: "center",
    borderColor: "#00000056",
  },
  ImageStyle: {
    width: width,
    height: height / 3.5,
    resizeMode: "cover",
    top: -height / 15,
  },
  PackageTypeImageStyleContainer: {
    width: width / 6.8,
    height: width / 6.8,
    borderRadius: 15,
    backgroundColor: "#f1f1f5",
    alignItems: "center",
    justifyContent: "center",
  },
  PackageTypeImageStyle: {
    width: width / 7.5,
    height: width / 7.5,
    resizeMode: "contain",
    alignSelf: "center",
  },
  PackageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  TimeImageStyle: {
    width: height * 0.022,
    height: height * 0.022,
    alignSelf: "center",
    resizeMode: "contain",
  },
  PremiumPackageTypeImageStyle: {
    width: width / 8,
    height: width / 8,
    resizeMode: "contain",
    alignSelf: "center",
  },
  NameText: {
    fontWeight: "400",
    color: "#fff",
    fontSize: height * 0.019,
    textAlign: "right",
  },
  WelcomeText: {
    fontWeight: "300",
    color: "#fff",
    fontSize: height * 0.016,
    textAlign: "right",
  },
  MinutesText: {
    color: "#577fd5",
    fontWeight: "700",
    fontSize: height * 0.018,
  },
  IconStyle: {
    borderWidth: 0.7,
    borderColor: "#fff",
    marginVertical: 1,
  },
  PackageText: {
    color: "#322e2e",
    fontSize: height * 0.023,
    fontFamily: "MPLUSRounded1c-Black",
    paddingVertical: 10,
  },
  DetailsContainer: {
    justifyContent: "space-around",
    marginHorizontal: 12,
    paddingVertical: 2,
    width: width / 1.78,
  },
  BasicText: {
    color: "#000000ec",
    fontSize: height * 0.018,
    fontWeight: "800",
  },
  BasicDescription: {
    color: "#00000089",
    fontSize: height * 0.017,
    fontFamily: "MPLUSRounded1c-Medium",
  },
  BenifitsText: {
    color: "#00000089",
    fontSize: height * 0.025,
    fontFamily: "MPLUSRounded1c-Medium",
    alignSelf: "center",
    top: 2.5,
  },
  FlatListStyle: {
    height: "57%",
    marginBottom: 50,
  },
  buttonContainer: {
    width: width - 70,
    height: height * 0.053,
    marginTop: 5,
    backgroundColor: "#2c65e0",
    borderRadius: 8,
    elevation: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextContainer: {
    flexDirection: "row",
  },
  buttonText: {
    fontSize: height * 0.016,
    color: "#fff",
    fontFamily: "MPLUSRounded1c-Black",
    fontWeight: "700",
  },
});
