// src/screens/DashboardScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components & Icons
import { QCalendar } from '../components/calendar/QCalendar';
import { EventModal, CalendarEvent } from '../components/calendar/EventModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { OnboardingModal } from '../components/profile/OnboardingModal';
import { TrashIcon } from '../assets/icons/TrashIcon';

// Services
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import EventService from '../services/EventService';

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

  // Cloud Data State
  const [eventsData, setEventsData] = useState<Record<string, CalendarEvent[]>>(
    {},
  );
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // --- Date Logic ---
  const formattedActiveDate = activeDate.toISOString().split('T')[0];
  const formattedToday = new Date().toISOString().split('T')[0];

  // A date is considered "past" if it is strictly before today's date string
  const isPastDate = formattedActiveDate < formattedToday;

  const todaysEvents = eventsData[formattedActiveDate] || [];

  // 1. Profile Check (Onboarding)
  useEffect(() => {
    const checkUserProfile = async () => {
      const user = AuthService.getCurrentUser();
      if (user) {
        try {
          const profile = await UserService.getUserProfile(user.uid);
          if (!profile) setOnboardingVisible(true);
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };
    checkUserProfile();
  }, []);

  // 2. Real-time Firebase Listener
  useEffect(() => {
    setIsLoadingEvents(true);
    const unsubscribe = EventService.subscribeToEvents(data => {
      setEventsData(data);
      setIsLoadingEvents(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Handlers ---

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

  const handleSaveEvent = async (savedEvent: CalendarEvent) => {
    try {
      if (editingEvent) {
        await EventService.updateEvent(savedEvent.id, {
          title: savedEvent.title,
          time: savedEvent.time,
          description: savedEvent.description,
        });
      } else {
        await EventService.createEvent(
          {
            title: savedEvent.title,
            time: savedEvent.time,
            description: savedEvent.description,
          },
          formattedActiveDate,
        );
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const triggerDelete = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await EventService.deleteEvent(eventToDelete);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
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

          {/* Hide ADD button if the date is in the past */}
          {!isPastDate && (
            <TouchableOpacity onPress={openCreateModal}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dataContainer}>
          {isLoadingEvents ? (
            <ActivityIndicator
              size="small"
              color="#0052cc"
              style={{ paddingVertical: 20 }}
            />
          ) : todaysEvents.length === 0 ? (
            <Text style={styles.dataPlaceholder}>No meetings scheduled.</Text>
          ) : (
            todaysEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                // Only allow editing if it's NOT a past date
                onPress={() => !isPastDate && openEditModal(event)}
                activeOpacity={isPastDate ? 1 : 0.2}
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

                {/* Hide DELETE button if the date is in the past */}
                {!isPastDate && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => triggerDelete(event.id)}
                  >
                    <TrashIcon />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modals */}
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

      <OnboardingModal
        visible={isOnboardingVisible}
        onSave={handleOnboardingSave}
      />
    </SafeAreaView>
  );
};
