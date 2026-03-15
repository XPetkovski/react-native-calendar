// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { styles } from './ProfileScreen.styles';
import { ProfileTextInput } from '../components/ProfileTextInput';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { isValidEmail } from '../utils/utils';

// --- Import the Auth Service ---
import AuthService from '../services/AuthService';

export const ProfileScreen = () => {
  // Grab the real user from Firebase!
  const currentUser = AuthService.getCurrentUser();

  const [firstName, setFirstName] = useState('Hristijan');
  const [lastName, setLastName] = useState('Petkovski');
  // Automatically populate the real email, fallback if somehow null
  const [email, setEmail] = useState(currentUser?.email || '');
  const [role, setRole] = useState('React Native Developer');
  const [emailError, setEmailError] = useState('');

  // --- Modal State ---
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isDeactivateModalVisible, setDeactivateModalVisible] = useState(false);

  const handleUpdateProfile = () => {
    setEmailError('');
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    // Will hook up to Firestore later
    console.log('Profile Updated!');
  };

  // --- Modal Actions ---
  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      // 1. Tell Firebase to destroy the session
      await AuthService.logout();
      // 2. DO NOTHING ELSE! The RootNavigator will automatically pull you to the Auth screens.
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const confirmDeactivate = () => {
    setDeactivateModalVisible(false);
    // We will wire this up to a Firebase "Delete User" function later!
    console.log('Account deactivated');
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>{firstName + ' ' + lastName}</Text>

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
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            editable={false} // Usually a good idea to prevent changing email without re-auth
          />
          <ProfileTextInput
            label="Position"
            value={role}
            onChangeText={setRole}
          />
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.updateButtonText}>Update Profile</Text>
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

      {/* --- Our Custom Modals --- */}
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
    </SafeAreaProvider>
  );
};
