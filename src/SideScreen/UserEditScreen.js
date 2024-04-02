import { Platform, StyleSheet, TextInput } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { StatusBar } from "react-native";
import CustomTextInput from "../components/CustomInput";
import CustomButton from "../components/Button/CustomButton";
import firestore from "@react-native-firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../Auth/AuthProvider";
import storage from "@react-native-firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { isEmpty } from "../../utilities/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginReducerUpdate } from "../../hooks/Slice";
import Toast from "react-native-toast-message";
import axios from "axios";
import LoadingButton from "../components/Button/LoadingButton";

const { width, height } = Dimensions.get("window");

const UserEditScreen = () => {
  const [avatarSource, setavatarSource] = useState(
    "https://cdn.mos.cms.futurecdn.net/bKtcvGPKXHfBuNqtNbgsWC-1200-80.jpg"
  );
  const [Name, setName] = useState();
  const [Phone, setPhone] = useState();
  const [showSheet, setShowSheet] = useState(false);
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const reducer = useSelector((state) => state.globalStore.LoggedInUserData);

  useEffect(() => {
    // Function to fetch and set image data
    const fetchImageData = async (img) => {
      if (img.indexOf("https://firebasestorage")) {
        const res = await axios.get(
          `https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Users%2F${img}`
        );
        const parseData = JSON.parse(res.request.response);
        setavatarSource(
          `https://firebasestorage.googleapis.com/v0/b/beyondwash-c2b4f.appspot.com/o/Users%2F${img}?alt=media&token=${parseData.downloadTokens}`
        );
      } else {
        setavatarSource(reducer?.photoURL);
      }
    };
    fetchImageData(userProfileData.photoURL);
  }, [userProfileData]);

  const sheetAnimation = useRef(new Animated.Value(0)).current;
  const userProfileData = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const showSheetFunction = () => {
    setShowSheet(true);
    StatusBar.setBarStyle("light-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.8)");
    }
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
      StatusBar.setBarStyle("light-content");
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor("transparent");
      }
      setShowSheet(false);
    });
  };

  const sheetTranslateY = sheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
  });
  const handleImage = async () => {
    try {
      await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      })
        .then(async (image) => {
          await setavatarSource(image.path);
        })
        .catch((err) => {
          console.log("handleImage Error => ", err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    console.log(avatarSource);
    setLoading(true);
    let fileName1 = avatarSource.substring(avatarSource?.lastIndexOf("/") + 1);
    console.log(fileName1);
    await storage()
      .ref(`Users/${fileName1}`)
      .putFile(avatarSource)
      .then((snapshot) => {
        console.log("Upload successful:", snapshot);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
    console.log({
      displayName: isEmpty(Name) ? userProfileData.displayName : Name,
      mobileNumber: isEmpty(Phone) ? "" : Phone,
      photoURL: fileName1,
    });
    updateUserData(
      userProfileData.uid,
      {
        displayName: isEmpty(Name) ? userProfileData.displayName : Name,
        mobileNumber: isEmpty(Phone) ? "" : Phone,
        photoURL: fileName1,
      },
      true
    );
    const lastLoginTimestamp = await AsyncStorage.getItem(
      "@last_login_timestamp"
    );
    const parsedData = JSON.parse(lastLoginTimestamp);
    const userData = {
      userDetails: {
        ...parsedData.userDetails,
        displayName: isEmpty(Name) ? userProfileData.displayName : Name,
        mobileNumber: isEmpty(Phone) ? "" : Phone,
        photoURL: fileName1,
      },
      isAuthenticated: true,
    };
    dispatch(LoginReducerUpdate(userData));
    console.log(userData);
    AsyncStorage.setItem("@last_login_timestamp", JSON.stringify(userData)); // Set the initial timestamp
    hideSheet();
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
  };

  return (
    <View style={styles.MainContainer}>
      <TouchableOpacity
        style={styles.CustomEditButton}
        onPress={showSheetFunction}
      >
        <FontAwesome5 name="user-edit" size={17} color="#fff" />
        <Text style={styles.EditText}>Edit</Text>
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
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                <View style={styles.CancleContainer}>
                  <Text style={styles.heading}>Edit Profile</Text>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={hideSheet}
                  >
                    <MaterialIcons name="cancel" size={25} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.ImageEditContainer}>
                  {avatarSource ? (
                    <Image
                      source={{
                        uri: avatarSource,
                      }}
                      style={styles.avatar}
                    />
                  ) : null}
                  <TouchableOpacity
                    onPress={handleImage}
                    activeOpacity={0.7}
                    style={styles.button}
                  >
                    <FontAwesome5
                      style={styles.userEditIcon}
                      name="user-edit"
                      size={14}
                      color="#505050"
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text style={styles.addressSubHeadings}>Name</Text>
                  <TextInput
                    placeholder="Correct your name"
                    placeholderTextColor={"rgb(181, 181, 181)"}
                    style={[styles.input, { width: width - 50 }]}
                    value={Name}
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => setName(text)}
                  />
                </View>
                <View style={{ width: "100%", marginVertical: 10 }}>
                  <Text style={styles.addressSubHeadings}>Phone number</Text>
                  <TextInput
                    placeholder="Correct your number"
                    placeholderTextColor={"rgb(181, 181, 181)"}
                    style={[styles.input, { width: width - 50 }]}
                    value={Phone}
                    keyboardType="number-pad"
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => setPhone(text)}
                  />
                </View>

                <LoadingButton
                  handleSignIn={() => uploadImage()}
                  text="Confirm"
                  loadingProp={Loading}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default UserEditScreen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  CancleText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  CancleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: -8,
    left: 20,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#000",
    width: "50%",
    alignSelf: "center",
    textAlign: "right",
  },
  avatar: {
    width: height * 0.122,
    height: height * 0.122,
    borderRadius: 60,
    marginBottom: 10,
  },
  editButton: {
    width: 30,
    height: 30,
    backgroundColor: "#000",
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -35,
    left: 20,
  },
  label: {
    paddingLeft: 20,
    color: "#333",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: width,
    height: "auto",
  },
  CustomEditButton: {
    borderRadius: 70,
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ffff",
    flexDirection: "row",
  },
  EditText: {
    color: "#fff",
    paddingHorizontal: 10,
    fontWeight: "700",
  },
  ImageEditContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "auto",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#000",
    padding: 0,
  },
  addressSubHeadings: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    paddingVertical: 5,
  },
  icon: {
    marginHorizontal: 0,
  },
  userEditIcon: {
    color: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
  button: {
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: "#000",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    right: width * 0.07,
    top: width * 0.06,
  },
  uploadText: {
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    color: "#fff",
  },
});
