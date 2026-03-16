import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './EventModal.styles';
import { formatTimeInput, isTimeValid } from '../../utils/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  description: string;
}

interface EventModalProps {
  visible: boolean;
  selectedDate: Date;
  initialEvent?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  selectedDate,
  initialEvent,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    description: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      setError('');
    }
  };

  const handleTimeChange = (text: string) => {
    const formatted = formatTimeInput(text);
    handleInputChange('time', formatted);
  };

  useEffect(() => {
    if (visible) {
      setFormData({
        title: initialEvent?.title || '',
        time: initialEvent?.time || '',
        description: initialEvent?.description || '',
      });
      setError('');
    }
  }, [visible, initialEvent]);

  const handleSave = () => {
    const { title, time, description } = formData;

    if (!title.trim()) {
      setError('Meeting title is required.');
      return;
    }

    if (!isTimeValid(time)) {
      setError('Please enter a valid time (00:00 - 23:59).');
      return;
    }

    const eventToSave: CalendarEvent = {
      id: initialEvent?.id || Date.now().toString(),
      title: title.trim(),
      time: time,
      description: description.trim(),
    };

    onSave(eventToSave);
    resetAndClose();
  };

  const resetAndClose = () => {
    setFormData({ title: '', time: '', description: '' });
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={resetAndClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {initialEvent ? 'Edit Meeting' : 'New Meeting'}
            </Text>
          </View>

          <Text style={styles.dateSubtitle}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Meeting Title"
            placeholderTextColor="#aaa"
            value={formData.title}
            onChangeText={val => handleInputChange('title', val)}
          />

          <TextInput
            style={styles.input}
            placeholder="Time (HH:MM)"
            placeholderTextColor="#aaa"
            value={formData.time}
            onChangeText={handleTimeChange}
            keyboardType="number-pad"
            maxLength={5}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description..."
            placeholderTextColor="#aaa"
            value={formData.description}
            onChangeText={val => handleInputChange('description', val)}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={resetAndClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
