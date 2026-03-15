import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SignInScreen } from './src/screens/SignInScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ProfileIcon } from './src/assets/icons/Profile.tsx';
import { MobilePhoneIcon } from './src/assets/icons/MobilePhone.tsx';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Stable Icon References (Prevents ESLint re-render warnings) ---
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

// --- The Bottom Tabs for Logged-In Users ---
const MainAppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        // --- Navbar (Bottom Tabs) Styling ---
        tabBarActiveTintColor: '#0052cc',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          elevation: 5, // Android shadow
        },

        // --- Header (Top Bar) Styling ---
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

        // Custom UI element injected into the right side of the header
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

// --- Root App Wrapper ---
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Auth Screens */}
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />

          {/* Main App (Hidden behind auth barrier later) */}
          <Stack.Screen name="MainApp" component={MainAppTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  avatarButton: {
    marginRight: 15,
    backgroundColor: '#0052cc',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default App;