// src/navigation/TabNavigator.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens & Icons
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProfileIcon } from '../assets/icons/Profile';
import { MobilePhoneIcon } from '../assets/icons/MobilePhone';

// Styles
import { styles } from './TabNavigator.styles';

const Tab = createBottomTabNavigator();

// --- Stable Icon References ---
const renderDashboardIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <MobilePhoneIcon color={color} size={size} />;

const renderProfileIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => <ProfileIcon color={color} size={size} />;

// --- Custom Header Right Avatar ---
const HeaderAvatar = () => (
  <TouchableOpacity
    style={styles.avatarButton}
    onPress={() => console.log('Avatar clicked!')}
  >
    <Text style={styles.avatarText}>HP</Text>
  </TouchableOpacity>
);

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0052cc',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          elevation: 5,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 3,
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTitleAlign: 'center',
        headerRight: HeaderAvatar,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Calendar',
          tabBarIcon: renderDashboardIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};
