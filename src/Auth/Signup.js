import React, { useEffect, useState } from "react";
import {
  Dimensions,
  LogBox,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "react-native-elements";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import { isEmpty } from "../../utilities/utils";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { googleSignIn, signup } from "./AuthProvider";
import { useDispatch } from "react-redux";
import LoadingButton from "../components/Button/LoadingButton";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const SCREENWIDTH = Dimensions.get("window").width;

const SignUp = () => {
  const [userName, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);
  const [isGoogleData, setIsGoogleData] = useState({});

  const [showPassword, setShowPassword] = useState({
    password: false,
    confrimPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    userName: "",
    email: "",
    password: "",
    confrimPassword: "",
    phone: "",
  });
  const navigation = useNavigation();

  const handlePassword = (password) => {
    setPassword(password);
  };
  const dispatch = useDispatch();

  const performAsyncAction = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(300);
    if (Platform.OS === "ios") {
      StatusBar.setBarStyle("dark-content");
    } else {
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("black");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      performAsyncAction();
    }, [])
  );
  useEffect(() => {
    performAsyncAction();
    LogBox.ignoreAllLogs();
    return () => {
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("transparent");
      }
    };
  }, []);

  const comparePassword = (passwordValue) => {
    setConfirmPassword(passwordValue);
    if (password !== passwordValue) {
      setErrorMessage({
        ...errorMessage,
        confrimPassword: "Password does not match",
      });
    } else {
      setErrorMessage({
        ...errorMessage,
        confrimPassword: "",
      });
    }
  };

  const handleShowPassword = (passwordType) => {
    if (passwordType === "password") {
      setShowPassword({ ...showPassword, password: !showPassword?.password });
    } else {
      setShowPassword({
        ...showPassword,
        confrimPassword: !showPassword?.confrimPassword,
      });
    }
  };

  const isPasswordInvalid = (password) => {
    let errorString = "";
    if (password?.length < 8) {
      errorString += "8 Characters ";
    }
    if (password?.search(/[a-z]/i) < 0) {
      errorString += "1 letter ";
    }
    if (password?.search(/[0-9]/) < 0) {
      errorString += "1 digit ";
    }
    return errorString?.length > 0
      ? "Password must contain " + errorString
      : false;
  };

  const handleSignUp = () => {
    const errorMessages = {
      phone: "",
      email: "",
      userName: "",
      password: "",
    };
    if (!/^[0-9]{10}$/.test(phone)) {
      errorMessages.phone = "Enter valid mobile number";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMessages.email = "Enter valid email";
    }
    if (!/^([a-zA-Z ]){2,30}$/.test(userName)) {
      errorMessages.userName = "Enter valid user name";
    }
    if (isPasswordInvalid(password)) {
      errorMessages.password = isPasswordInvalid(password);
    }
    setErrorMessage({
      ...errorMessage,
      ...errorMessages,
    });
    if (
      isEmpty(errorMessages?.phone) &&
      isEmpty(errorMessages?.email) &&
      isEmpty(errorMessages?.userName) &&
      isEmpty(errorMessages?.password) &&
      isEmpty(errorMessage?.confrimPassword)
    ) {
      signup(email, password, userName, phone, dispatch);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        clearTimeout();
      }, 2000);
    }
  };

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    try {
      await GoogleSignin.configure({
        scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
        webClientId:
          "722209382173-pdet7klhutl4cnb99e6ron99tv6dmk8a.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: "", // specifies a hosted domain restriction
        loginHint: "", // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
        accountName: "", // [Android] specifies an account name on the device that should be used
        iosClientId:
          "722209382173-pdet7klhutl4cnb99e6ron99tv6dmk8a.apps.googleusercontent.com", // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      }); // <-- Add this
      // Get the users ID token

      const userInfo = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );
      // Sign-in the user with the credential
      const userData = await auth().signInWithCredential(googleCredential);
      setIsGoogleData(userData.user);
      setIsGoogle(true);
      return userData;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("SIGN_IN_CANCELLED", error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("IN_PROGRESS", error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("PLAY_SERVICES_NOT_AVAILABLE", error);
      } else {
        console.log("DIFFIRENT_ERROR", error);
      }
    }
  }

  const HandleGoogleSignIn = () => {
    const errorMessages = {
      phone: "",
      email: "",
      userName: "",
      password: "",
    };
    if (!/^[0-9]{10}$/.test(phone)) {
      errorMessages.phone = "Enter valid mobile number";
    }
    setErrorMessage({
      ...errorMessage,
      ...errorMessages,
    });
    if (isEmpty(errorMessages?.phone)) {
      googleSignIn(isGoogleData, Number(phone), dispatch);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        clearTimeout();
      }, 2000);
    }
  };

  const redirectToSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.signUpContainer}>
      <View style={styles.headingSection}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          BeyondWash - Let's Get the Car Shined !
        </Text>
      </View>
      {!isGoogle ? (
        <ScrollView>
          <View style={styles.formSection}>
            <View style={styles.signUpFields}>
              <View style={styles.inputField}>
                <Text style={styles.label}>User Name</Text>
                <TextInput
                  style={styles.input}
                  value={userName}
                  onChangeText={(userName) => setUserName(userName)}
                  placeholder={"Enter your user name"}
                  placeholderTextColor={"#ded8d7"}
                  textContentType="none"
                />
                <Text style={styles.errorMessage}>{errorMessage.userName}</Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(email) => setEmail(email)}
                  placeholder={"Enter your email"}
                  placeholderTextColor={"#ded8d7"}
                  textContentType="none"
                />
                <Text style={styles.errorMessage}>{errorMessage.email}</Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(phone) => setPhone(phone)}
                  placeholder={"Enter your mobile number"}
                  placeholderTextColor={"#ded8d7"}
                  keyboardType="numeric"
                  textContentType="none"
                />
                <Text style={styles.errorMessage}>{errorMessage?.phone}</Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  placeholder={"Enter your password"}
                  placeholderTextColor={"#ded8d7"}
                  onChangeText={handlePassword}
                  textContentType="none"
                  secureTextEntry={showPassword.password ? false : true}
                />
                <TouchableOpacity
                  style={styles.passwordEye}
                  onPress={() => handleShowPassword("password")}
                >
                  {showPassword?.password ? (
                    <Ionicons name={"eye-off"} size={20} color={"#2c65e0"} />
                  ) : (
                    <Ionicons name={"eye"} size={20} color={"#2c65e0"} />
                  )}
                </TouchableOpacity>
                <Text style={styles.errorMessage}>
                  {errorMessage?.password}
                </Text>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  placeholder={"Enter your password again"}
                  placeholderTextColor={"#ded8d7"}
                  onChangeText={comparePassword}
                  textContentType="none"
                  secureTextEntry={showPassword.confrimPassword ? false : true}
                />
                <TouchableOpacity
                  style={styles.passwordEye}
                  onPress={() => handleShowPassword("confirmPassword")}
                >
                  {showPassword?.confrimPassword ? (
                    <Ionicons name={"eye-off"} size={20} color={"#2c65e0"} />
                  ) : (
                    <Ionicons name={"eye"} size={20} color={"#2c65e0"} />
                  )}
                </TouchableOpacity>
                <Text style={styles.errorMessage}>
                  {errorMessage?.confrimPassword}
                </Text>
              </View>
            </View>
            <View style={styles.buttonSection}>
              <LoadingButton
                loadingProp={loading}
                handleSignIn={handleSignUp}
                text={"Sign Up"}
              />

              <View style={styles.outerLineBox}>
                <View style={styles.boxSide} />
                <View>
                  <Text style={styles.centerText}>Or Sign Up With</Text>
                </View>
                <View style={styles.boxSide} />
              </View>
              <TouchableOpacity
                onPress={() =>
                  onGoogleButtonPress().then(() =>
                    console.log("Signed in with Google!")
                  )
                }
                activeOpacity={0.7}
                style={[
                  styles.button,
                  {
                    backgroundColor: "#fff",
                    borderColor: "#ded8d7",
                    borderWidth: 1,
                    elevation: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  },
                ]}
              >
                <Image
                  style={styles.google}
                  source={require("../../assets/images/google-logo.png")}
                />
                <Text style={[styles.buttonText, { color: "#2c65e0" }]}>
                  Google
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.signInSection}>
            <Text style={styles.signInText}>Already have an account ? </Text>
            <TouchableOpacity onPress={redirectToSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          <View style={styles.formSection}>
            <View style={styles.signUpFields}>
              <View style={styles.inputField}>
                <Text style={styles.label}>
                  Enter your phone number to continue!
                </Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(phone) => setPhone(phone)}
                  placeholder={"Enter your mobile number"}
                  placeholderTextColor={"#ded8d7"}
                  keyboardType="numeric"
                  textContentType="none"
                />
                <Text style={styles.errorMessage}>{errorMessage?.phone}</Text>
              </View>
            </View>
            <View style={styles.buttonSection}>
              <LoadingButton
                loadingProp={loading}
                handleSignIn={HandleGoogleSignIn}
                text={"Sign Up"}
              />

              <View style={styles.outerLineBox}>
                <View style={styles.boxSide} />
                <View>
                  <Text style={[styles.centerText, { width: 45 }]}>Or</Text>
                </View>
                <View style={styles.boxSide} />
              </View>
              <TouchableOpacity
                onPress={() => setIsGoogle(false)}
                activeOpacity={0.7}
                style={[
                  styles.button,
                  {
                    backgroundColor: "#fff",
                    borderColor: "#ded8d7",
                    borderWidth: 1,
                    elevation: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={[styles.buttonText, { color: "#2c65e0" }]}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.signInSection}>
            <Text style={styles.signInText}>Already have an account ? </Text>
            <TouchableOpacity onPress={redirectToSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
  },
  headingSection: {
    marginLeft: 26,
    marginTop: 55,
    marginBottom: 15,
  },
  formSection: {},
  signUpFields: {},
  title: {
    color: "#000",
    fontSize: 28,
    marginBottom: 2,
    fontFamily: "AlongSansExtraBold",
    fontWeight: "700",
  },
  subtitle: {
    color: "grey",
    fontSize: 14,
    fontWeight: "500",
  },
  label: {
    color: "#000",
    marginLeft: 26,
    marginBottom: 2,
    fontFamily: "AlongSansExtraBold",
    fontWeight: "700",
  },
  inputField: {
    margin: 2,
  },
  input: {
    color: "#000",
    height: 37,
    marginLeft: 25,
    marginRight: 25,
    borderWidth: 1.2,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ded8d7",
  },
  errorMessage: {
    color: "red",
    marginLeft: 26,
  },
  passwordEye: {
    position: "absolute",
    top: 27,
    right: 35,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2c65e0",
    shadowColor: "#2c65e0",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    alignSelf: "center",
    width: SCREENWIDTH - 48,
    height: 42,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: 5,
  },
  outerLineBox: {
    marginTop: 20,
    marginLeft: 26,
    marginRight: 26,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  boxSide: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#aba8a7",
  },
  centerText: {
    width: 110,
    textAlign: "center",
    color: "#8f8585",
    fontWeight: "700",
  },
  google: {
    resizeMode: "contain",
    width: 20,
    height: 20,
    marginRight: 7,
  },
  signInSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    color: "#8f8585",
    fontWeight: "500",
    fontSize: 16,
  },
  signInLink: {
    color: "#2c65e0",
    fontWeight: "700",
    fontSize: 16,
  },
});
