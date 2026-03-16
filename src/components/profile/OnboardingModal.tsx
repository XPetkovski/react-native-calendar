import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { styles } from './OnboardingModal.styles';

interface OnboardingModalProps {
  visible: boolean;
  onSave: (
    firstName: string,
    lastName: string,
    position: string,
  ) => Promise<void>;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
  };

  const handleSave = async () => {
    const { firstName, lastName, position } = formData;

    if (!firstName || !lastName || !position) {
      setError('Please fill out all fields.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(firstName, lastName, position);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Welcome to Quipu!</Text>
          <Text style={styles.subtitle}>
            Let's get to know you before we start.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={val => handleInputChange('firstName', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={val => handleInputChange('lastName', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Position (e.g. Developer)"
            value={formData.position}
            onChangeText={val => handleInputChange('position', val)}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};