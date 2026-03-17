import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { styles } from './SignInScreen.styles';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog.tsx';
import { BankLogo } from '../assets/icons/BankLogo.tsx';
import signInController from '../controllers/SignInController';

export const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const validateAndSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInController.loginWithEmail(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInController.loginWithBiometrics();
    } catch (err: any) {
      if (err.message === 'BIOMETRICS_NOT_SUPPORTED') {
        setDialogConfig({
          visible: true,
          title: 'Not Supported',
          message: 'Biometrics are not available or enrolled on this device.',
        });
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.logoContainer}>
          <BankLogo width={90} height={90} color="#0052cc" />
        </View>

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
