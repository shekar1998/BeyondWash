import axios from "axios";

export const sendPushNotfication = async (email, date, userList) => {
  sendPushNotficationWhenAppIsClosed(email, date, userList);
};

const sendPushNotficationWhenAppIsClosed = async (email, date, userList) => {
  axios.post(
    "https://us-central1-beyondwash-c2b4f.cloudfunctions.net/sendAdminPushNotification/api/userDetails",
    {
      userEmail: email,
      date,
    }
  );
};

export const EmployeePushNotification = async (deviceToken, email, date) => {
  axios.post(
    "https://us-central1-beyondwash-c2b4f.cloudfunctions.net/sendAdminPushNotification/api/employeeNotification",
    {
      deviceToken,
      userEmail: email,
      date,
    }
  );
};
