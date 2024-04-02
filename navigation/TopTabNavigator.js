import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Brand from '../src/AddCar/Brand';
import Modal from '../src/AddCar/Modal';
import CarDetails from '../src/AddCar/CarDetails';
import React, {useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';

const Tab = createMaterialTopTabNavigator();

export const TopTabNavigator = () => {
  useFocusEffect(
    React.useCallback(() => {
      performAsyncAction();
    }, []),
  );

  useEffect(() => {
    performAsyncAction();
  }, []);

  const performAsyncAction = async () => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300);
    StatusBar.setBarStyle('dark-content');
  };

  return (
    <Tab.Navigator initialRouteName="Brand">
      <Tab.Screen
        options={{
          swipeEnabled: false,
          tabBarLabelStyle: {
            color: 'transparent',
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            shadowColor: 'transparent',
            color: '#fff',
          },
          tabBarIndicatorContainerStyle: {
            backgroundColor: 'transparent',
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'transparent',
          },
        }}
        name="Brand"
        component={Brand}
      />
      <Tab.Screen
        options={{
          swipeEnabled: false,
          tabBarLabelStyle: {
            color: 'transparent',
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            shadowColor: 'transparent',
            color: '#fff',
          },
          tabBarIndicatorContainerStyle: {
            backgroundColor: 'transparent',
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'transparent',
          },
        }}
        name="Modal"
        component={Modal}
      />
      <Tab.Screen
        options={{
          swipeEnabled: false,
          tabBarLabelStyle: {
            color: 'transparent',
          },
          tabBarStyle: {
            backgroundColor: '#fff',
            shadowColor: 'transparent',
            color: '#fff',
          },
          tabBarIndicatorContainerStyle: {
            backgroundColor: 'transparent',
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'transparent',
          },
        }}
        name="CarDetails"
        component={CarDetails}
      />
    </Tab.Navigator>
  );
};
