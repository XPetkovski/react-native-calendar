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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (visible) {
      setFormData({
        title: initialEvent?.title || '',
        time: initialEvent?.time || '',
        description: initialEvent?.description || '',
      });
    }
  }, [visible, initialEvent]);

  const handleSave = () => {
    const { title, time, description } = formData;

    if (!title.trim()) return;

    const eventToSave: CalendarEvent = {
      id: initialEvent?.id || Date.now().toString(),
      title: title.trim(),
      time: time.trim(),
      description: description.trim(),
    };

    onSave(eventToSave);

    setFormData({ title: '', time: '', description: '' });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
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
            placeholder="Time (e.g. 14:00)"
            placeholderTextColor="#aaa"
            value={formData.time}
            onChangeText={val => handleInputChange('time', val)}
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
              onPress={() => {
                setFormData({ title: '', time: '', description: '' });
                onClose();
              }}
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
