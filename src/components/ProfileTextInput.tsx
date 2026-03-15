// src/components/ProfileTextInput.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  Platform,
} from 'react-native';

// Define the exact props this component accepts
interface ProfileTextInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string; // Optional error message
}

export const ProfileTextInput = ({
  label,
  value,
  onChangeText,
  error,
  ...otherProps
}: ProfileTextInputProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, error ? styles.containerError : null]}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#aaa"
          {...otherProps}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  container: {
    height: 55,
    paddingHorizontal: 15,
    paddingTop: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  containerError: {
    borderColor: '#d71920', // Red border if there's an error
  },
  label: {
    color: '#888',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    color: '#333',
    fontSize: 16,
    padding: 0,
    marginTop: Platform.OS === 'ios' ? 4 : 0, // Fixes Android padding weirdness
  },
  errorText: {
    color: '#d71920',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});
