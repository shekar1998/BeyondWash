/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import React, {useEffect} from 'react';
import {Dimensions, Image, Platform, StyleSheet} from 'react-native';
import StackScreen from './StackScreen';
import {styles} from '../src/components/Button/CustomButton';
import Menu from '../src/Home/Menu';
import ProfileScreen from '../src/SideScreen/ProfileScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SignUp from '../src/Auth/Signup';
import SignIn from '../src/Auth/SignIn';
import ForgotPassword from '../src/Auth/ForgotPassword';
import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();
const {height} = Dimensions.get('window');

export default function BottomNavigation() {
  const isAuthenticated = useSelector(
    state => state.globalStore.isAuthenticated,
  );
  return (
    <Tab.Navigator
      initialRouteName="SignUp"
      barStyle={{paddingBottom: 48}}
      screenOptions={({route, navigation}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? require('../assets/images/homeOpen.png')
              : require('../assets/images/homeClose.png');
          } else if (route.name === 'ProfileScreen') {
            iconName = focused
              ? require('../assets/images/UserSelected.png')
              : require('../assets/images/UserDeSelected.png');
          } else if (route.name === 'Settings') {
            iconName = focused
              ? require('../assets/images/homeOpen.png')
              : require('../assets/images/homeClose.png');
          } else if (route.name === 'Settings12') {
            iconName = focused
              ? require('../assets/images/homeOpen.png')
              : require('../assets/images/homeClose.png');
          }

          return <Image style={customStyle.IconImage} source={iconName} />;
        },
        tabBarActiveTintColor: '#2463eb',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
          paddingVertical: 5,
          height: height / 12,
          shadowOffset: {width: 4, height: 4},
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 31,
          elevation: 22,
        },
        tabBarLabelStyle: {paddingBottom: 3},
        tabBarIconStyle: {
          top: 0,
        },
      })}>
      {isAuthenticated === true ? (
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarVisible: false,
          }}
          name="Home"
          component={StackScreen}
        />
      ) : (
        <>
          <Tab.Screen
            name="SignUp"
            options={{
              headerShown: false,
              tabBarStyle: {display: 'none'},
            }}
            component={SignUp}
          />
          <Tab.Screen
            options={{
              headerShown: false,
              tabBarVisible: false,
              tabBarStyle: {display: 'none'},
            }}
            name="SignIn"
            component={SignIn}
          />
          <Tab.Screen
            options={{
              headerShown: false,
              tabBarVisible: false,
              tabBarStyle: {display: 'none'},
            }}
            name="ForgotPassword"
            component={ForgotPassword}
          />
        </>
      )}
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarVisible: false,
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

const customStyle = StyleSheet.create({
  IconImage: {
    width: Platform.OS === 'android' ? '45%' : '100%',
    height: Platform.OS === 'android' ? '45%' : '100%',
    resizeMode: 'contain',
  },
});
