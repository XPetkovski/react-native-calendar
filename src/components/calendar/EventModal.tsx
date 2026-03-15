// src/components/calendar/EventModal.tsx
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

// Define what a Meeting/Event looks like
export interface CalendarEvent {
  id: string;
  title: string;
  time: string; // e.g., "14:00"
  description: string;
}

interface EventModalProps {
  visible: boolean;
  selectedDate: Date;
  initialEvent?: CalendarEvent | null; // If provided, we are Editing. If null, we are Creating.
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
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  // When the modal opens, check if we are editing or creating
  useEffect(() => {
    if (visible) {
      if (initialEvent) {
        // Edit Mode: Fill inputs with existing data
        setTitle(initialEvent.title);
        setTime(initialEvent.time);
        setDescription(initialEvent.description);
      } else {
        // Create Mode: Clear inputs
        setTitle('');
        setTime('');
        setDescription('');
      }
    }
  }, [visible, initialEvent]);

  const handleSave = () => {
    if (!title.trim()) return; // Don't save if title is empty

    const newEvent: CalendarEvent = {
      id: initialEvent ? initialEvent.id : Date.now().toString(), // Generate a fake ID for new events
      title,
      time,
      description,
    };

    onSave(newEvent);
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
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Time (e.g. 14:00)"
            placeholderTextColor="#aaa"
            value={time}
            onChangeText={setTime}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description..."
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
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
