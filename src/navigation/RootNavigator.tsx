import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'ios_from_left',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {!user ? (
        <Stack.Group screenOptions={{ animation: 'fade' }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group screenOptions={{ animation: 'slide_from_bottom' }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
