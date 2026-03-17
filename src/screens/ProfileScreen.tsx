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
import { ProfileTextInput } from '../components/common/ProfileTextInput.tsx';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog.tsx';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

export const ProfileScreen = () => {
  const currentUser = AuthService.getCurrentUser();

  const [savedName, setSavedName] = useState({ firstName: '', lastName: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  // left some screens with classic simpler way of coding useStates for view purpose
  // to demonstrate Atomic State management in contrast to
  // the Unified State pattern used in the Dashboard screens.
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isDeactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalConfig, setErrorModalConfig] = useState({
    visible: false,
    message: '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          const profile = await UserService.getUserProfile(currentUser.uid);
          if (profile) {
            setSavedName({
              firstName: profile.firstName,
              lastName: profile.lastName,
            });
            setFormData({
              firstName: profile.firstName,
              lastName: profile.lastName,
              position: profile.position,
            });
          }
        } catch (error) {
          console.error('Failed to load profile', error);
        }
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    setIsUpdating(true);
    try {
      await UserService.updateUserProfile(currentUser.uid, formData);

      setSavedName({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setSuccessModalVisible(true);
    } catch (error: any) {
      setErrorModalConfig({ visible: true, message: error.message });
    }
    setIsUpdating(false);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await AuthService.logout();
    } catch (error: any) {
      setErrorModalConfig({ visible: true, message: error.message });
    }
  };

  const confirmDeactivate = async () => {
    setDeactivateModalVisible(false);
    if (!currentUser) return;

    try {
      setIsUpdating(true);
      await UserService.deleteUserProfile(currentUser.uid);
      await AuthService.deleteAccount();
    } catch (error: any) {
      setIsUpdating(false);
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
      <View style={[styles.safeArea, styles.activityIndicator]}>
        <ActivityIndicator size="large" color="#0052cc" />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>
          {savedName.firstName
            ? `${savedName.firstName} ${savedName.lastName}`
            : 'My Profile'}
        </Text>

        <View style={styles.formContainer}>
          <ProfileTextInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(val: string) => handleInputChange('firstName', val)}
          />
          <ProfileTextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(val: string) => handleInputChange('lastName', val)}
          />
          <ProfileTextInput
            label="Email Address"
            value={currentUser?.email || ''}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <ProfileTextInput
            label="Position"
            value={formData.position}
            onChangeText={(val: string) => handleInputChange('position', val)}
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
        message="Are you sure? This will delete your account and return you to the sign-in screen."
        confirmText="Deactivate"
        isDestructive={true}
        onCancel={() => setDeactivateModalVisible(false)}
        onConfirm={confirmDeactivate}
      />

      <ConfirmationDialog
        visible={isSuccessModalVisible}
        title="Success"
        message="Profile updated successfully!"
        confirmText="OK"
        onConfirm={() => setSuccessModalVisible(false)}
      />

      <ConfirmationDialog
        visible={errorModalConfig.visible}
        title="Error"
        message={errorModalConfig.message}
        confirmText="OK"
        isDestructive={true}
        onConfirm={() => setErrorModalConfig({ visible: false, message: '' })}
      />
    </SafeAreaProvider>
  );
};
