import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';

const SCREENWIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');

const LoadingButton = ({handleSignIn, loadingProp, text}) => {
  return (
    <TouchableOpacity
      onPress={handleSignIn}
      activeOpacity={0.7}
      style={styles.button}>
      <Text style={styles.buttonText}>{text}</Text>
      {loadingProp ? <ActivityIndicator /> : null}
    </TouchableOpacity>
  );
};

export default LoadingButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2c65e0',
    shadowColor: '#2c65e0',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    alignSelf: 'center',
    width: SCREENWIDTH - 48,
    height: height * 0.053,
  },
  buttonText: {
    fontSize: height * 0.018,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 5,
  },
});
