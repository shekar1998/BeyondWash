import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import FORGOT_PASSWORD from '../../assets/images/Forgot_Password.png';
import CustomButton from '../components/Button/CustomButton';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';

const {width, height} = Dimensions.get('window');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('#1d2a5f');
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Enter valid email');
    } else {
      setErrorMessage('');
      try {
        auth()
          .sendPasswordResetEmail(email)
          .then(() => {});
        Toast.show({
          type: 'success',
          text1: 'Reset Password initiated !',
          text2: 'Watch for the password reset mail in your mail box 📫',
          visibilityTime: 2000,
          style: {
            backgroundColor: 'green',
          },
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: {error},
          visibilityTime: 2000,
          style: {
            backgroundColor: 'red',
          },
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.forgotPasswordContainer}>
      <View style={styles.headingSection}>
        <Text style={styles.title}>Forgot password??</Text>
        <Text style={styles.subtitle}>
          BeyondWash - Let's Get the Car Shined !
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Image source={FORGOT_PASSWORD} style={styles.image} />
          <Text style={styles.description}>
            Enter the email associated with your account and we'll send an email
            with instructions to reset your password.
          </Text>
          <View style={styles.inputField}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={email => setEmail(email)}
              placeholder={'Enter your email'}
              placeholderTextColor={'#ded8d7'}
              textContentType="none"
            />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
          <CustomButton
            title={'Submit'}
            onPress={handleSubmit}
            customWidth={width - 75}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  forgotPasswordContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    marginLeft: 26,
  },
  image: {
    width: width - 50,
    height: height / 2.7,
    alignSelf: 'center',
    marginHorizontal: 7,
  },
  inputField: {
    margin: 2,
    marginBottom: 10,
  },
  label: {
    color: '#000',
    marginLeft: 26,
    marginBottom: 2,
    fontFamily: 'AlongSansExtraBold',
    fontWeight: '700',
  },
  title: {
    color: '#000',
    fontSize: 28,
    marginBottom: 2,
    fontFamily: 'AlongSansExtraBold',
    fontWeight: '700',
  },
  subtitle: {
    color: 'grey',
    fontSize: 14,
    fontWeight: '500',
  },
  headingSection: {
    marginLeft: 26,
    marginTop: 75,
    marginBottom: 33,
  },
  description: {
    fontWeight: '400',
    fontSize: 16,
    paddingBottom: 15,
    marginHorizontal: 5,
    color: '#000',
    width: width - 60,
  },
  input: {
    color: '#000',
    height: 37,
    marginLeft: 25,
    marginRight: 25,
    borderWidth: 1.2,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ded8d7',
    width: width - 70,
  },
});

export default ForgotPassword;
