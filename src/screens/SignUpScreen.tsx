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
import { styles } from './SignUpScreen.styles';
import { isValidEmail, isValidPassword } from '../utils/utils';
import AuthService from '../services/AuthService';
import { BankLogo } from '../assets/icons/BankLogo.tsx';

export const SignUpScreen = ({ navigation }: any) => {
  // disclaimer: left some screens with classic simpler way of coding useStates for view purpose
  // to demonstrate Atomic State management in contrast to
  // the Unified State pattern used in the Dashboard screens.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAndSignUp = async () => {
    setError('');

    if (!email || !password) {
      setError('Both fields are required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters and include an uppercase letter, lowercase letter, number.');
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.register(email, password);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
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
          {/*Added purely for demonstrative purposes as how a company logo would fit here*/}
          <BankLogo width={90} height={90} color="#0052cc" />
        </View>

        <Text style={styles.headerTitle}>Create Account</Text>

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
          testID="email"
          accessible={true}
          accessibilityLabel="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
          testID="password"
          accessible={true}
          accessibilityLabel="password"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={validateAndSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText} testID="sign-up" accessible={true} accessibilityLabel="sign-up">Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('SignIn')}
          disabled={isLoading}
        >
          <Text style={styles.linkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};
