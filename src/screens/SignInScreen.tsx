import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthService from '../services/AuthService';
import SecureStoreService from '../services/SecureStoreService';
import { authenticateWithBiometrics } from '../services/biometricService';
import { styles } from './SignInScreen.styles';
import { isValidEmail } from '../utils/utils';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog.tsx';

export const SignInScreen = ({ navigation }: any) => {
  // left some screens with classic simpler way of coding useStates for view purpose
  // to demonstrate Atomic State management in contrast to
  // the Unified State pattern used in the Dashboard screens.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({
    visible: false,
    title: '',
    message: '',
  });

  // Manual Email/Password Sign In
  const validateAndSignIn = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.login(email, password);
      await SecureStoreService.saveCredentials(email, password);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
      setIsLoading(false);
    }
  };

  // Biometric Sign In
  const handleBiometricLogin = async () => {
    setError('');

    // First, check if biometrics are hardware-supported
    const bioCheck = await authenticateWithBiometrics();

    if (bioCheck.isNotSupported) {
      setDialogConfig({
        visible: true,
        title: 'Not Supported',
        message: 'Biometrics are not available or enrolled on this device.',
      });
      return;
    }

    // 2. If supported, try to retrieve vaulted credentials
    const credentials = await SecureStoreService.getStoredCredentials();

    if (credentials) {
      try {
        setIsLoading(true);
        // Auto log in with retrieved email/pass
        await AuthService.login(credentials.email, credentials.password);
      } catch (err: any) {
        setError(err);
        setIsLoading(false);
      }
    } else {
      setError('Please sign in manually once to enable biometrics.');
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Text style={styles.headerTitle}>Welcome Back</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={validateAndSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricLogin}
          disabled={isLoading}
        >
          <Text style={styles.biometricButtonText}>Log In with Biometrics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('SignUp')}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <ConfirmationDialog
        visible={dialogConfig.visible}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText="OK"
        onConfirm={() => setDialogConfig(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaProvider>
  );
};
