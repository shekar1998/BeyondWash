import React, {useEffect, useRef} from 'react';
import {Animated, Platform, StatusBar, StyleSheet} from 'react-native';
import {
  useDrawerStatus,
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import SideScreen from '../src/SideScreen/SideScreen';
import {useRoute} from '@react-navigation/native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import {SignInOnNoCache} from '../src/Auth/AuthProvider';
import {useDispatch} from 'react-redux';
import {useState} from 'react';
import LoadingIndicator from '../src/Home/LoadingIndicator';
const Drawer = createDrawerNavigator();
let animatedStyle;
/* drawer menu screens navigation */
const ScreensStack = () => {
  const isDrawerOpen = useDrawerStatus();
  const animation = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const OpenDrawerScaleAnimated = useRef(new Animated.Value(0)).current;
  const OpenDrawerBorderRadiusAnimated = useRef(new Animated.Value(0)).current;
  const route = useRoute();
  const activeRouteName = getFocusedRouteNameFromRoute(route);
  const [cachecheck, setCachecheck] = useState(-1);
  const dispatch = useDispatch();

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1.01, 1],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 16],
  });

  useEffect(() => {
    Animated.timing(translateX, {
      duration: 200, // Adjust the duration as needed
      useNativeDriver: true, // Add this line if you're not using the native driver
      toValue:
        isDrawerOpen === 'open' ? (Platform.OS === 'android' ? 355 : 20) : 0,
    }).start();
    Animated.timing(OpenDrawerScaleAnimated, {
      duration: 200, // Adjust the duration as needed
      useNativeDriver: true, // Add this line if you're not using the native driver
      toValue: isDrawerOpen === 'open' ? 0.9 : 1.009,
    }).start();
  }, [isDrawerOpen]);

  animatedStyle = {
    borderRadius: borderRadius,
    transform: [
      {scale: OpenDrawerScaleAnimated},
      {
        translateX: translateX,
      },
    ],
    elevation: 15,
    shadowOffset: {width: -1, height: 4},
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 3,
  };

  useEffect(() => {
    cacheCheckFunction();
    Animated.timing(animation, {
      duration: 100,
      useNativeDriver: true,
      toValue: isDrawerOpen === 'open' ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  useEffect(() => {
    scale.addListener(handleAnimationChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  const handleAnimationChange = ({value}) => {
    if (value < 1) {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
      }
    }
    if (value === 1) {
      if (activeRouteName === 'HomeScreen' || 'ProfileScreen') {
        if (activeRouteName === 'SubscribePlan') {
          StatusBar.setBarStyle('dark-content');
          if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent');
          }
        } else {
          StatusBar.setBarStyle('light-content');
          if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent');
          }
        }
      } else {
        StatusBar.setBarStyle('dark-content');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('transparent');
        }
      }
    }
  };

  const cacheCheckFunction = async () => {
    const status = await SignInOnNoCache(dispatch);
    if (status === 1) {
      StatusBar.setBarStyle('light-content');
    }
    setCachecheck(status);
  };

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: 'transparent',
          borderWidth: isDrawerOpen === 'open' ? 0 : 1,
        },
      ])}>
      {cachecheck >= 0 ? <BottomNavigation /> : <LoadingIndicator />}
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = props => {
  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{
        paddingBottom: 15,
        flex: 1,
      }}>
      <SideScreen />
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default () => {
  return (
    <Drawer.Navigator
      drawerType="slide"
      overlayColor="transparent"
      sceneContainerStyle={{backgroundColor: '#e5eaf0'}}
      screenOptions={{
        drawerActiveBackgroundColor: 'red',
        drawerActiveTintColor: 'red',
        drawerAllowFontScaling: true,
        headerStyle: {
          backgroundColor: 'red',
        },
      }}
      drawerContent={props => <DrawerContent {...props} />}
      drawerStyle={{
        flex: 1,
        width: '50%',
        borderRightWidth: 0,
        backgroundColor: 'red',
      }}>
      <Drawer.Screen
        options={{
          headerShown: false,
        }}
        name="Screens"
        component={ScreensStack}
      />
    </Drawer.Navigator>
  );
};
