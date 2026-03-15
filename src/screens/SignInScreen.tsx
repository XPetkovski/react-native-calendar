// src/screens/SignInScreen.tsx
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Separated styles and utilities
import { styles } from './SignInScreen.styles';
import { isValidEmail } from '../utils/utils.ts';

// Custom components and services
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { authenticateWithBiometrics } from '../services/biometricService';

export const SignInScreen = ({ navigation }: any) => {
  // --- Form State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- Unified Dialog State ---
  const [dialogConfig, setDialogConfig] = useState({
    visible: false,
    title: '',
    message: '',
    isSuccess: false, // Tracks if we need to navigate after closing
  });

  // --- Standard Email/Password Sign In ---
  const validateAndSignIn = () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Later: This is where Firebase signInWithEmailAndPassword will go!
    setDialogConfig({
      visible: true,
      title: 'Success!',
      message: `Ready to authenticate ${email} with Firebase!`,
      isSuccess: false,
    });
  };

  // --- Biometric Sign In ---
  const handleBiometricLogin = async () => {
    // Call our clean, separated service
    const result = await authenticateWithBiometrics();

    if (result.isNotSupported) {
      setDialogConfig({
        visible: true,
        title: 'Not Supported',
        message: 'Biometrics are not available on this device.',
        isSuccess: false,
      });
      return;
    }

    if (result.success) {
      setDialogConfig({
        visible: true,
        title: 'Success',
        message: 'Biometric match verified!',
        isSuccess: true, // Set to true so we navigate on close!
      });
    } else if (result.error) {
      // Only show dialog if it's an actual error (not just the user hitting cancel)
      setDialogConfig({
        visible: true,
        title: 'Authentication Failed',
        message: result.error,
        isSuccess: false,
      });
    }
  };

  // --- Handle Dialog Close ---
  const handleDialogConfirm = () => {
    setDialogConfig(prev => ({ ...prev, visible: false }));

    // If it was a successful login, route them to the app
    if (dialogConfig.isSuccess) {
      navigation.navigate('MainApp');
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Text style={styles.headerTitle}>Welcome Back</Text>

        {/* Inline form error for missing/bad fields */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={validateAndSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricLogin}
        >
          <Text style={styles.biometricButtonText}>Log In with Biometrics</Text>
        </TouchableOpacity>

        {/* DEVELOPER BYPASS BUTTON */}
        <TouchableOpacity
          style={styles.tempButton}
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text style={styles.buttonText}>TEMP: Bypass to App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* --- Render the Unified Custom Dialog --- */}
      <ConfirmationDialog
        visible={dialogConfig.visible}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText="OK"
        onConfirm={handleDialogConfirm}
        // Notice we omit onCancel here, so it only shows the "OK" button
      />
    </SafeAreaProvider>
  );
};
