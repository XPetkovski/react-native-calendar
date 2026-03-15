// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens & Navigators
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { TabNavigator } from './TabNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth Screens */}
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Main App (Tab Navigator nested inside the Stack) */}
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
};
