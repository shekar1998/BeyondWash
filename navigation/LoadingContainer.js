import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoadingIndicator from '../src/Home/LoadingIndicator'

const Stack = createStackNavigator()

const StackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoadingIndicator"
      screenOptions={{
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen name="LoadingIndicator" component={LoadingIndicator} />
    </Stack.Navigator>
  )
}

export default StackScreen
