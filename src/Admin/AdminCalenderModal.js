import {
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { adminBookingModalReducer } from "../../hooks/Slice";
import CustomButton from "../components/Button/CustomButton";

const { width, height } = Dimensions.get("window");

const AdminCalenderModal = ({ mondayDate }) => {
  const adminModal = useSelector(
    (state) => state.globalStore.AdminBookingModal
  );
  const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState({});

  const handleDayPress = (day) => {
    const { dateString } = day;
    setSelectedDates((prevSelectedDates) => {
      const updatedSelectedDates = { ...prevSelectedDates };
      if (updatedSelectedDates[dateString]) {
        delete updatedSelectedDates[dateString];
      } else {
        updatedSelectedDates[dateString] = {
          selected: true,
          selectedColor: "#2c65e0",
        };1
      }
      return updatedSelectedDates;
    });
  };

  const handlePress = () => {
    dispatch(
      adminBookingModalReducer({
        status: false,
        dateSelected: selectedDates,
      })
    );
  };
  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("rgba(0, 0, 0, 0.5)");
    }
  }, []);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={adminModal.status}
      >
        <View style={styles.modalContainer}>
          <Calendar
            style={{
              borderRadius: 20,
              width: width - 20,
              height: height / 2.01,
              marginBottom: 20,
            }}
            markedDates={selectedDates}
            onDayPress={handleDayPress}
          />
          <View style={styles.buttonStyle}>
            <CustomButton onPress={handlePress} title={"Submit"} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminCalenderModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  messageContainer: {
    width: width - 25,
    backgroundColor: "#fff",
  },
  buttonStyle: {
    top: -height * 0.1,
  },
});
