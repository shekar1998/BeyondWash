import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {isEmpty} from '../../utilities/utils';
import {login} from './AuthProvider';
import {useDispatch} from 'react-redux';
import LoadingButton from '../components/Button/LoadingButton';

const SCREENWIDTH = Dimensions.get('window').width;

const SignIn = () => {
  const [email, setEmail] = useState('shekar6803@gmail.com');
  const [password, setPassword] = useState('User@123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
  });
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const performAsyncAction = async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300);
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle('light-content');
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('#000');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      performAsyncAction();
    }, []),
  );

  useEffect(() => {
    performAsyncAction();
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, []);

  const handleSignIn = () => {
    const errorMessages = {
      email: '',
      password: '',
    };
    if (isEmpty(email)) {
      errorMessages.email = 'Enter your email';
    }
    if (isEmpty(password)) {
      errorMessages.password = 'Enter your password';
    }
    setErrorMessage({...errorMessages});
    if (isEmpty(errorMessages?.email) && isEmpty(errorMessages?.password)) {
      console.log('Entering');
      login(email, password, dispatch);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        clearTimeout();
      }, 2000);
    }
  };

  const redirectToForgotPassword = () => {
    console.log('Forgot Password');
    navigation.navigate('ForgotPassword');
  };

  const handleGoogleSignIn = () => {
    console.log('Handle Google Sign In Here');
  };

  const redirectToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.signInContainer}>
      <View style={styles.headingSection}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>
          BeyondWash - Let's Get the Car Shined !
        </Text>
      </View>
      <View style={styles.formSection}>
        <View style={styles.signUpFields}>
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
            <Text style={styles.errorMessage}>{errorMessage.email}</Text>
          </View>
          <View style={styles.inputField}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholder={'Enter your password'}
              placeholderTextColor={'#ded8d7'}
              onChangeText={password => setPassword(password)}
              textContentType="none"
              secureTextEntry={showPassword ? false : true}
            />
            <TouchableOpacity
              style={styles.passwordEye}
              onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Ionicons name={'eye-off'} size={20} color={'#2c65e0'} />
              ) : (
                <Ionicons name={'eye'} size={20} color={'#2c65e0'} />
              )}
            </TouchableOpacity>
            <Text style={styles.errorMessage}>{errorMessage?.password}</Text>
          </View>
          <View style={styles.forgotPasswordLink}>
            <TouchableOpacity onPress={redirectToForgotPassword}>
              <Text style={styles.forgotPasswordLinkText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonSection}>
          <LoadingButton
            loadingProp={loading}
            handleSignIn={handleSignIn}
            text={'Sign In'}
          />
          <View style={styles.outerLineBox}>
            <View style={styles.boxSide} />
            <View>
              <Text style={styles.centerText}>Or Sign In With</Text>
            </View>
            <View style={styles.boxSide} />
          </View>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            activeOpacity={0.7}
            style={[
              styles.button,
              {
                backgroundColor: '#fff',
                borderColor: '#ded8d7',
                borderWidth: 1,
                elevation: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              },
            ]}>
            <Image
              style={styles.google}
              source={require('../../assets/images/google-logo.png')}
            />
            <Text style={[styles.buttonText, {color: '#2c65e0'}]}>Google</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.signInSection}>
        <Text style={styles.signInText}>Do not have an account ? </Text>
        <TouchableOpacity onPress={redirectToSignUp}>
          <Text style={styles.signInLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  signInContainer: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
  },
  headingSection: {
    marginLeft: 26,
    marginTop: 75,
    marginBottom: 33,
  },
  formSection: {},
  signUpFields: {},
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
  label: {
    color: '#000',
    marginLeft: 26,
    marginBottom: 2,
    fontFamily: 'AlongSansExtraBold',
    fontWeight: '700',
  },
  inputField: {
    margin: 4,
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
  },
  errorMessage: {
    color: 'red',
    marginLeft: 26,
  },
  passwordEye: {
    position: 'absolute',
    top: 27,
    right: 35,
  },
  forgotPasswordLink: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: 30,
  },
  forgotPasswordLinkText: {
    color: 'red',
    fontFamily: 'AlongSansExtraBold',
    fontWeight: '700',
  },
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
    height: 42,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 5,
  },
  outerLineBox: {
    marginTop: 20,
    marginLeft: 26,
    marginRight: 26,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxSide: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#aba8a7',
  },
  centerText: {
    width: 110,
    textAlign: 'center',
    color: '#8f8585',
    fontWeight: '700',
  },
  google: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginRight: 7,
  },
  signInSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 180,
  },
  signInText: {
    color: '#8f8585',
    fontWeight: '500',
    fontSize: 16,
  },
  signInLink: {
    color: '#2c65e0',
    fontWeight: '700',
    fontSize: 16,
  },
});
