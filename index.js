/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import BookingListener from './src/Booking/BookingListener';

// Register the background task component
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Received background message:', remoteMessage.data);
  // const notification = {
  //   channelId: 'com.beyondwash.notifications', // Replace with your notification channel ID
  //   title: remoteMessage.data,
  //   message: `Done by ${remoteMessage.body.userEmail} on ${remoteMessage.body.date}`,
  //   // Add any additional data or configuration options
  // };

  // // Schedule the notification to be sent immediately
  // PushNotification.localNotification(notification);
});

if (Platform.OS === 'android') {
  PushNotification.createChannel({
    channelId: 'com.beyondwash.notifications', // Replace 'channel-id' with a unique channel ID of your choice
    channelName: 'Channel Name', // Replace 'Channel Name' with a user-friendly channel name
    channelDescription: 'A description of the notification channel',
    importance: 4, // Set the importance level (1 to 5, with 5 being the highest)
    vibrate: true, // Enable vibration when a notification is displayed
  });
}

AppRegistry.registerHeadlessTask('BookingListener', () => BookingListener);
AppRegistry.registerComponent(appName, () => App);
