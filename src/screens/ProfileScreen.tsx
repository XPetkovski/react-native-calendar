// src/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { styles } from './ProfileScreen.styles';
import { ProfileTextInput } from '../components/ProfileTextInput';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { isValidEmail } from '../utils/utils.ts';

export const ProfileScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('Hristijan');
  const [lastName, setLastName] = useState('Petkovski');
  const [email, setEmail] = useState('hristijan@example.com');
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
    // Will hook up to Firebase later
    console.log('Profile Updated!');
  };

  // --- Modal Actions ---
  const confirmLogout = () => {
    setLogoutModalVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

  const confirmDeactivate = () => {
    setDeactivateModalVisible(false);
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>{firstName + " " + lastName}</Text>

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

        {/* Instead of Alert, we just toggle the state to true! */}
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
