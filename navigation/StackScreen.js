import React, { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import HomeScreen from "../src/Home/HomeScreen";
import ProfileScreen from "../src/SideScreen/ProfileScreen";
import AddAddress from "../src/Address/AddAddress";
import SubscribePlan from "../src/Subscribe/SubscribePlan";
import Booking from "../src/Booking/Booking";
import SelectedPackage from "../src/Services/SelectedPackage";
import Feedback from "../src/Documentation/Feedback";
import Support from "../src/Documentation/Support";
import Admin from "../src/Admin/Admin";
import ServiceHistory from "../src/Services/ServiceHistory";
import CarDetails from "../src/AddCar/CarDetails";
import SubscribeSuccess from "../src/Subscribe/SubscribeSuccess";
import BookingCardDetails from "../src/components/Booking/BookingCardDetails";
import AdminBookingDetails from "../src/Admin/AdminBookingDetails";
import ContactDetails from "./../src/Admin/ContactDetails";
import BookingDetailsForDates from "../src/components/Booking/BookingDetailsForDates";
import PrivacyPolicyScreen from "../src/SideScreen/Documentation";
import FeedbackDetails from "../src/Documentation/FeedbackDetails";
import { createStackNavigator } from "@react-navigation/stack";
import Payment from "../src/Payment/Payment";
import AddCar from "../src/AddCar/AddCar";

const Stack = createStackNavigator();

const StackScreen = () => {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        "463737243616-5aqbu90qb3vafv98n1lnbrdj56m4h105.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: "", // specifies a hosted domain restriction
      loginHint: "", // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: "", // [Android] specifies an account name on the device that should be used
      iosClientId:
        "463737243616-5aqbu90qb3vafv98n1lnbrdj56m4h105.apps.googleusercontent.com", // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddCar" component={AddCar} />
      <Stack.Screen
        options={{
          title: "Profile",
          headerStyle: {
            backgroundColor: "blue", // Set the background color of the header
          },
          headerTintColor: "red", // Set the color of the header text and icons
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
        name="SubscribePlan"
        component={SubscribePlan}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
        name="Booking"
        component={Booking}
      />
      <Stack.Screen name="SelectedPackage" component={SelectedPackage} />
      <Stack.Screen name="ServiceHistory" component={ServiceHistory} />
      <Stack.Screen name="FeedbackDetails" component={FeedbackDetails} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="CarDetails" component={CarDetails} />
      <Stack.Screen name="SubscribeSuccess" component={SubscribeSuccess} />
      <Stack.Screen name="BookingCardDetails" component={BookingCardDetails} />
      <Stack.Screen name="Payment" component={Payment} />

      <Stack.Screen
        name="AdminBookingDetails"
        component={AdminBookingDetails}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen name="ContactDetails" component={ContactDetails} />
      <Stack.Screen
        name="BookingDetailsForDates"
        component={BookingDetailsForDates}
      />
    </Stack.Navigator>
  );
};

export default StackScreen;
