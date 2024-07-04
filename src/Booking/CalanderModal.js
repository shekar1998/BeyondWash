import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { CurrentYearReducer, bookingModalReducer } from "../../hooks/Slice";
import { Text } from "react-native";
import { FlatList } from "react-native";
import CustomButton from "../components/Button/CustomButton";

const { width, height } = Dimensions.get("window");

const CalanderModal = ({ mondayDate }) => {
  const [selectedDay, setSelectedDay] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [nextMonthDays, setNextMonthDays] = useState({});
  const [nextMonthDaysArray, setNextMonthDaysArray] = useState([]);
  const modalView = useSelector((state) => state.globalStore.bookingModal);
  const dateYear = useSelector((state) => state.globalStore.currentYear);
  const selectedPlan = useSelector((state) => state.globalStore.selectedPlan);
  let incrementDays, noOfDays;

  const dispatch = useDispatch();
  const selectLoopValue = () => {
    if (selectedPlan === "Monthly") {
      return {
        incrementDays: 1,
        noOfDays: 26,
      };
    } else if (selectedPlan === "Weekly") {
      return {
        incrementDays: 1,
        noOfDays: 4,
      };
    } else {
      return {
        incrementDays: 2,
        noOfDays: 12,
      };
    }
  };
  const AutoSelectBookingDate = async (selectedDate) => {
    const autoSelectdDays = [];
    let modifiedDay = selectedDate;
    console.log("Enterting", autoSelectdDays);

    if (selectedPlan === "Weekly") {
      while (autoSelectdDays.length < 4) {
        console.log(
          moment(modifiedDay).format("YYYY-MM-DD"),
          moment(modifiedDay).day(),
          autoSelectdDays.length
        );
        if (moment(modifiedDay).day() === 0) {
          console.log(moment(modifiedDay), "Adding Sunday");

          autoSelectdDays.push({
            date: moment(modifiedDay).format("YYYY-MM-DD"),
            status: "Pending",
          }); // Add the Sunday to the result array
        }
        console.log(
          moment(modifiedDay).format("YYYY-MM-DD"),
          "Adding Days to reach Sunday"
        );
        modifiedDay = moment(modifiedDay).add(1, "days");
      }
    } else {
      autoSelectdDays.push({
        date: moment(selectedDate).format("YYYY-MM-DD"),
        status: "Pending",
      });
      const loopValue = await selectLoopValue();
      for (let i = 0; i < loopValue.noOfDays - 1; i++) {
        if (moment(modifiedDay).day() === 1) {
          modifiedDay = moment(modifiedDay).add(2, "days");
          if (moment(modifiedDay).day() === 1) {
            modifiedDay = moment(modifiedDay).add(1, "days");
          }
          autoSelectdDays.push({
            date: moment(modifiedDay).format("YYYY-MM-DD"),
            status: "Pending",
          });
        } else {
          modifiedDay = moment(modifiedDay).add(
            loopValue.incrementDays,
            "days"
          );
          if (moment(modifiedDay).day() === 1) {
            modifiedDay = moment(modifiedDay).add(1, "days");
          }
          autoSelectdDays.push({
            date: moment(modifiedDay).format("YYYY-MM-DD"),
            status: "Pending",
          });
        }
      }
    }

    const additionalMarkedDates = Object.fromEntries(
      autoSelectdDays?.map((item) => [
        item.date,
        { selected: true, selectedColor: "#2c65e0" },
      ])
    );
    setNextMonthDaysArray(autoSelectdDays);
    setNextMonthDays(additionalMarkedDates);

    return autoSelectdDays;
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
        visible={modalView.status}
      >
        <View style={styles.modalContainer}>
          <View style={styles.SubContainer}>
            {nextMonthDaysArray <= 0 && (
              <Text style={styles.continueText}>
                <Text style={styles.Notetext}>
                  Please select a date to continue
                </Text>
              </Text>
            )}
            <Calendar
              style={styles.messageContainer}
              onMonthChange={(month) => {
                if (dateYear !== month.year) {
                  dispatch(CurrentYearReducer(month.year));
                }
              }}
              onDayPress={(day) => {
                setSelectedDay(day.dateString);
                AutoSelectBookingDate(day.dateString);
              }}
              disableAllTouchEventsForDisabledDays
              markedDates={{
                ...mondayDate,
                ...nextMonthDays,
              }}
            />
            <Text style={styles.text}>
              <Text style={styles.Notetext}>Note : </Text>
              Monday's are Holiday
            </Text>
            <Text style={styles.text}>
              <Text style={styles.Notetext}>Selected Plan : </Text>
              {selectedPlan}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.Notetext}>
                {nextMonthDaysArray.length > 0
                  ? "Selected date :"
                  : "Current date : "}
              </Text>
              {selectedDay}
            </Text>
            {nextMonthDaysArray.length > 0 && (
              <View>
                <Text style={styles.text}>
                  <Text style={styles.Notetext}>
                    {nextMonthDaysArray.length}
                  </Text>{" "}
                  Days got automatically selected from{" "}
                  <Text style={styles.Notetext}>"{selectedDay}"</Text>
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.Notetext}>Note : </Text>
                  You can still change the date
                </Text>
              </View>
            )}
            <View style={styles.DeleteContainer}>
              <CustomButton
                customWidth={width / 2.5}
                title={"Cancle"}
                FontSize={height * 0.016}
                customHeight={height * 0.05}
                PaddingVertical={5}
                PaddingHorizontal={0}
                onPress={() => {
                  dispatch(
                    bookingModalReducer({
                      status: false,
                      dateSelected: {},
                    })
                  );
                }}
              />
              <CustomButton
                customWidth={width / 2.5}
                title={"Confirm"}
                FontSize={height * 0.016}
                customHeight={height * 0.05}
                PaddingVertical={5}
                PaddingHorizontal={0}
                onPress={() => {
                  dispatch(
                    bookingModalReducer({
                      status: false,
                      dateSelected: nextMonthDaysArray,
                    })
                  );
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  SubContainer: {
    backgroundColor: "#fff",
    width: "95%",
    height: "auto",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  messageContainer: {
    borderRadius: 20,
    width: width - 20,
    height: "auto",
    margin: 15,
    justifyContent: "flex-end",
  },
  text: {
    fontSize: height * 0.018,
    color: "#000",
    zIndex: 100,
    width: width - 40,
    margin: 3,
  },
  Notetext: {
    fontSize: height * 0.018,
    color: "#000",
    fontWeight: "700",
  },
  AutoSelectContainer: {
    margin: 7,
    marginHorizontal: 7,
    padding: 5,
    backgroundColor: "#b2f2bb",
    borderRadius: 10,
  },
  AutoSelectedText: {
    color: "#000",
    fontWeight: "900",
  },
  continueText: {
    padding: 10,
    backgroundColor: "#ffe6e5",
    fontWeight: "900",
    marginTop: 10,
    borderRadius: 10,
    textAlign: "center",
  },
  DeleteContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: width - 20,
    margin: 15,
  },
});

export default CalanderModal;

// {
//   "02-04-2024": {"disabled": true},
//   "03-04-2024": {"disabled": true},
//   "04-04-2024": {"disabled": true},
//   "05-04-2024": {"disabled": true},
//   "06-04-2024": {"disabled": true},
//   "07-04-2024": {"disabled": true},
//   "09-04-2024": {"disabled": true},
//   "10-04-2024": {"disabled": true},
//   "11-04-2024": {"disabled": true},
//   "12-04-2024": {"disabled": true},
//   "13-04-2024": {"disabled": true},
//   "14-04-2024": {"disabled": true},
//   "16-04-2024": {"disabled": true},
//   "17-04-2024": {"disabled": true},
//   "18-04-2024": {"disabled": true},
//   "19-04-2024": {"disabled": true},
//   "20-04-2024": {"disabled": true},
//   "21-04-2024": {"disabled": true},
//   "23-03-2024": {"disabled": true},
//   "23-04-2024": {"disabled": true},
//   "24-03-2024": {"disabled": true},
//   "24-04-2024": {"disabled": true},
//   "25-04-2024": {"disabled": true},
//   "26-03-2024": {"disabled": true},
//   "26-04-2024": {"disabled": true},
//   "27-03-2024": {"disabled": true},
//   "28-03-2024": {"disabled": true},
//   "29-03-2024": {"disabled": true},
//   "30-03-2024": {"disabled": true},
//   "31-03-2024": {"disabled": true}
// }
