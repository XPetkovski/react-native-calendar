// src/screens/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components & Icons
import { QCalendar } from '../components/calendar/QCalendar';
import { EventModal, CalendarEvent } from '../components/calendar/EventModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { OnboardingModal } from '../components/profile/OnboardingModal'; // <-- IMPORT ONBOARDING
import { TrashIcon } from '../assets/icons/TrashIcon';

// Services
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

// Styles
import { styles } from './DashboardScreen.styles';

export const DashboardScreen = () => {
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  // Create/Edit Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Delete Modal State
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Onboarding State
  const [isOnboardingVisible, setOnboardingVisible] = useState(false);

  // Fake Database for Events (We will replace this with EventService next!)
  const [eventsData, setEventsData] = useState<Record<string, CalendarEvent[]>>(
    {},
  );

  const formattedActiveDate = activeDate.toISOString().split('T')[0];
  const todaysEvents = eventsData[formattedActiveDate] || [];

  // --- NEW: Check if user needs to complete profile ---
  useEffect(() => {
    const checkUserProfile = async () => {
      const user = AuthService.getCurrentUser();
      if (user) {
        try {
          const profile = await UserService.getUserProfile(user.uid);
          if (!profile) {
            setOnboardingVisible(true); // Pop the modal if no profile exists!
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };
    checkUserProfile();
  }, []);

  // --- NEW: Handle Onboarding Save ---
  const handleOnboardingSave = async (
    firstName: string,
    lastName: string,
    position: string,
  ) => {
    const user = AuthService.getCurrentUser();
    if (user) {
      await UserService.createUserProfile(user.uid, {
        firstName,
        lastName,
        position,
        email: user.email || '',
      });
      setOnboardingVisible(false);
    }
  };

  const handleDateSelected = (date: Date) => setActiveDate(date);

  const openCreateModal = () => {
    setEditingEvent(null);
    setModalVisible(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalVisible(true);
  };

  const handleSaveEvent = (savedEvent: CalendarEvent) => {
    setEventsData(prevData => {
      const existingEvents = prevData[formattedActiveDate] || [];
      const isEditing = existingEvents.some(e => e.id === savedEvent.id);

      const updatedEvents = isEditing
        ? existingEvents.map(e => (e.id === savedEvent.id ? savedEvent : e))
        : [...existingEvents, savedEvent];

      return { ...prevData, [formattedActiveDate]: updatedEvents };
    });
  };

  const triggerDelete = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      setEventsData(prevData => {
        const existingEvents = prevData[formattedActiveDate] || [];
        const filteredEvents = existingEvents.filter(
          e => e.id !== eventToDelete,
        );
        return { ...prevData, [formattedActiveDate]: filteredEvents };
      });
    }
    setDeleteModalVisible(false);
    setEventToDelete(null);
  };

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>Your Schedule</Text>
        <Text style={styles.subtitleText}>Select a date to view activity</Text>

        <QCalendar onDateSelect={handleDateSelected} />

        <View style={styles.headerRow}>
          <Text style={styles.dataTitle}>
            Activity for {activeDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={openCreateModal}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dataContainer}>
          {todaysEvents.length === 0 ? (
            <Text style={styles.dataPlaceholder}>No meetings scheduled.</Text>
          ) : (
            todaysEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => openEditModal(event)}
              >
                <Text style={styles.eventTime}>{event.time}</Text>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.description ? (
                    <Text style={styles.eventDescription}>
                      {event.description}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => triggerDelete(event.id)}
                >
                  <TrashIcon />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Calendar Modals */}
      <EventModal
        visible={isModalVisible}
        selectedDate={activeDate}
        initialEvent={editingEvent}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEvent}
      />

      <ConfirmationDialog
        visible={isDeleteModalVisible}
        title="Delete Meeting"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onCancel={() => {
          setDeleteModalVisible(false);
          setEventToDelete(null);
        }}
        onConfirm={confirmDelete}
      />

      {/* --- NEW: Onboarding Modal --- */}
      <OnboardingModal
        visible={isOnboardingVisible}
        onSave={handleOnboardingSave}
      />
    </SafeAreaView>
  );
};
