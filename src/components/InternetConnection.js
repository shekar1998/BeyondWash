import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const InternetConnection = () => {
  //Add this within the App component
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state?.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Internet Connection Error',
          text2: 'Please conenct to your internet connetion and try again!',
          visibilityTime: 5000,
          style: {
            backgroundColor: 'red',
          },
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return <View />;
};

export default InternetConnection;
