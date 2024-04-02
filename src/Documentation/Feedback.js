import {
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import DropDownPicker from "react-native-dropdown-picker";
import CustomButton from "../components/Button/CustomButton";
import { Platform } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import LoadingButton from "../components/Button/LoadingButton";
import moment from "moment";

const { width, height } = Dimensions.get("window");

const Feedback = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [commentText, setCommentText] = useState();
  const [items, setItems] = useState([
    { label: "Customer Care", value: "Customer Care" },
    { label: "Expert Cleaner", value: "Expert Cleaner" },
  ]);
  const [DropDownValue, setDropDownValue] = useState();
  const loggedInUser = useSelector(
    (state) => state.globalStore.LoggedInUserData
  );
  const navigation = useNavigation();
  const handleConfirm = (data) => {
    setDropDownValue(data.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const userDocRef = firestore()
      .collection("userFeedback")
      .doc(loggedInUser.email);
    await userDocRef.set({
      email: loggedInUser.email,
      phoneNumer: loggedInUser.mobileNumber,
      image: loggedInUser.photoURL,
      type: DropDownValue,
      comment: commentText,
      date: moment(new Date()).format("DD-MMM-YYYY HH:mm:ss").toString(),
    });
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Feedback updated successfully🙂",
      visibilityTime: 2000,
      style: {
        backgroundColor: "green",
      },
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header headerText={"Feedback"} />
      <View style={styles.DropdownContainer}>
        <Text style={styles.LableText}>Add an Type*</Text>
        <DropDownPicker
          open={open}
          value={value}
          placeholder="Select a type"
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          mode="BADGE"
          style={styles.DropDownStyle}
          zIndex={11}
          textStyle={styles.textColor}
          extendableBadgeContainer={true}
          placeholderStyle={styles.placeHolderText}
          ArrowDownIconComponent={() => (
            <EvilIcons
              style={styles.Icon}
              name="chevron-down"
              size={30}
              color={"#2c65e0"}
            />
          )}
          ArrowUpIconComponent={() => (
            <EvilIcons
              style={styles.Icon}
              name="chevron-up"
              size={30}
              color={"#2c65e0"}
            />
          )}
          onSelectItem={handleConfirm}
          dropDownContainerStyle={styles.dropDownContainerStyle}
        />
        <Text style={styles.LableText}>Tell us more details.</Text>
        <TextInput
          style={styles.input}
          placeholder={"Type here..."}
          placeholderTextColor="#AAAAAA"
          multiline
          numberOfLines={7}
          value={commentText}
          onChangeText={(text) => setCommentText(text)}
        />
        <LoadingButton
          handleSignIn={handleSubmit}
          loadingProp={Loading}
          text={"Submit"}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  image: {
    width: width / 1.2,
    height: width / 1.2,
    alignSelf: "center",
    justifyContent: "flex-start",
    resizeMode: "contain",
    top: -70,
  },
  DropDownStyle: {
    borderBottomWidth: 0.3,
    borderLeftWidth: 0.3,
    borderRightWidth: 0.3,
    borderTopWidth: 0.3,
    borderColor: "#a8a8a8",
  },
  LableText: {
    color: "#000",
    textAlign: "left",
    paddingHorizontal: 10,
    fontSize: 15,
    paddingVertical: 15,
    fontWeight: "400",
  },
  DropdownContainer: {},
  dropDownContainerStyle: {
    borderWidth: 0,
    elevation: 10,
    backgroundColor: "#fff",
  },
  placeHolderText: { color: "#a8a8a8" },
  textColor: {
    color: "#000",
  },
  input: {
    marginLeft: 10,
    color: "#000",
    fontWeight: "400",
    borderWidth: 0.3,
    borderRadius: 10,
    right: 7,
    width: "98%",
    borderColor: "#a8a8a8",
    marginBottom: 50,
    height: "20%",
    padding: 20,
  },
});
