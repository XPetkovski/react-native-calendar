// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { styles } from './ProfileScreen.styles';
import { ProfileTextInput } from '../components/ProfileTextInput';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

// Services
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

export const ProfileScreen = () => {
  const currentUser = AuthService.getCurrentUser();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [position, setPosition] = useState('');

  // Loading & Updating States
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Modal States ---
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isDeactivateModalVisible, setDeactivateModalVisible] = useState(false);

  // NEW: Success and Error Modal States
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalConfig, setErrorModalConfig] = useState({
    visible: false,
    message: '',
  });

  // --- 1. Fetch Profile on Load ---
  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          const profile = await UserService.getUserProfile(currentUser.uid);
          if (profile) {
            setFirstName(profile.firstName);
            setLastName(profile.lastName);
            setPosition(profile.position);
          }
        } catch (error) {
          console.error('Failed to load profile', error);
        }
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [currentUser]);

  // --- 2. Update Profile ---
  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    setIsUpdating(true);
    try {
      await UserService.updateUserProfile(currentUser.uid, {
        firstName,
        lastName,
        position,
      });
      // Replace Alert with our custom modal
      setSuccessModalVisible(true);
    } catch (error: any) {
      // Replace Alert with our custom modal
      setErrorModalConfig({ visible: true, message: error.message });
    }
    setIsUpdating(false);
  };

  // --- Modal Actions ---
  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await AuthService.logout();
    } catch (error: any) {
      setErrorModalConfig({ visible: true, message: error.message });
    }
  };

  const confirmDeactivate = async () => {
    setDeactivateModalVisible(false); // Hide the confirmation dialog

    if (!currentUser) return;

    try {
      setIsUpdating(true); // Show the loading spinner on the screen

      // 1. Wipe their profile data from the database
      await UserService.deleteUserProfile(currentUser.uid);

      // 2. Destroy their Firebase Auth account
      await AuthService.deleteAccount();

      // 3. DO NOTHING ELSE! RootNavigator will automatically route to SignIn
    } catch (error: any) {
      setIsUpdating(false);

      // Handle Firebase's strict security rule
      if (error.code === 'auth/requires-recent-login') {
        setErrorModalConfig({
          visible: true,
          message:
            'For security reasons, please log out and log back in before deleting your account.',
        });
      } else {
        setErrorModalConfig({ visible: true, message: error.message });
      }
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#0052cc" />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>
          {firstName ? `${firstName} ${lastName}` : 'My Profile'}
        </Text>

        <View style={styles.formContainer}>
          <ProfileTextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <ProfileTextInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <ProfileTextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <ProfileTextInput
            label="Position"
            value={position}
            onChangeText={setPosition}
          />
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deactivateButton}
          onPress={() => setDeactivateModalVisible(true)}
        >
          <Text style={styles.deactivateButtonText}>Deactivate Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- Action Modals --- */}
      <ConfirmationDialog
        visible={isLogoutModalVisible}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        isDestructive={true}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />

      <ConfirmationDialog
        visible={isDeactivateModalVisible}
        title="Deactivate Account"
        message="Are you sure? This will soft-delete your account and return you to the sign-in screen."
        confirmText="Deactivate"
        isDestructive={true}
        onCancel={() => setDeactivateModalVisible(false)}
        onConfirm={confirmDeactivate}
      />

      {/* --- NEW: Success & Error Modals (No Cancel Button) --- */}
      <ConfirmationDialog
        visible={isSuccessModalVisible}
        title="Success"
        message="Profile updated successfully!"
        confirmText="OK"
        onConfirm={() => setSuccessModalVisible(false)}
        // Omit onCancel so only the OK button shows
      />

      <ConfirmationDialog
        visible={errorModalConfig.visible}
        title="Error"
        message={errorModalConfig.message}
        confirmText="OK"
        isDestructive={true} // Makes the OK button red to signify an error
        onConfirm={() => setErrorModalConfig({ visible: false, message: '' })}
        // Omit onCancel
      />
    </SafeAreaProvider>
  );
};
