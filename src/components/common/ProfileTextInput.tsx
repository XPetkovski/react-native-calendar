import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from 'react-native';
import { styles } from './ProfileTextInput.styles.ts';

interface ProfileTextInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
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
