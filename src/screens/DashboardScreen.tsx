import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QCalendar } from '../components/calendar/QCalendar';
import { EventModal, CalendarEvent } from '../components/calendar/EventModal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { OnboardingModal } from '../components/profile/OnboardingModal';
import { TrashIcon } from '../assets/icons/TrashIcon';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import EventService from '../services/EventService';
import { styles } from './DashboardScreen.styles';

export const DashboardScreen = () => {
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const [eventsState, setEventsState] = useState({
    data: {} as Record<string, CalendarEvent[]>,
    isLoading: true,
  });

  const [modalState, setModalState] = useState({
    onboarding: false,
    event: false,
    delete: false,
    editingEvent: null as CalendarEvent | null,
    eventToDelete: null as string | null,
  });

  // --- Date Logic ---
  const formattedActiveDate = activeDate.toISOString().split('T')[0];
  const formattedToday = new Date().toISOString().split('T')[0];
  const isPastDate = formattedActiveDate < formattedToday;

  const todaysEvents = eventsState.data[formattedActiveDate] || [];

  // Profile Check (Onboarding)
  useEffect(() => {
    const checkUserProfile = async () => {
      const user = AuthService.getCurrentUser();
      if (user) {
        try {
          const profile = await UserService.getUserProfile(user.uid);
          if (!profile) {
            setModalState(prev => ({ ...prev, onboarding: true }));
          }
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };
    checkUserProfile();
  }, []);

  // Firebase Listener
  useEffect(() => {
    setEventsState(prev => ({ ...prev, isLoading: true }));

    const unsubscribe = EventService.subscribeToEvents(fetchedData => {
      setEventsState({
        data: fetchedData,
        isLoading: false,
      });
    });

    return () => unsubscribe();
  }, []);

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
      setModalState(prev => ({ ...prev, onboarding: false }));
    }
  };

  const handleDateSelected = (date: Date) => setActiveDate(date);

  const openCreateModal = () => {
    setModalState(prev => ({ ...prev, event: true, editingEvent: null }));
  };

  const openEditModal = (event: CalendarEvent) => {
    setModalState(prev => ({ ...prev, event: true, editingEvent: event }));
  };

  const closeEventModal = () => {
    setModalState(prev => ({ ...prev, event: false, editingEvent: null }));
  };

  const handleSaveEvent = async (savedEvent: CalendarEvent) => {
    try {
      if (modalState.editingEvent) {
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
    setModalState(prev => ({ ...prev, delete: true, eventToDelete: eventId }));
  };

  const closeDeleteModal = () => {
    setModalState(prev => ({ ...prev, delete: false, eventToDelete: null }));
  };

  const confirmDelete = async () => {
    if (modalState.eventToDelete) {
      try {
        await EventService.deleteEvent(modalState.eventToDelete);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
    closeDeleteModal();
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

          {!isPastDate && (
            <TouchableOpacity onPress={openCreateModal}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dataContainer}>
          {eventsState.isLoading ? (
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

      <EventModal
        visible={modalState.event}
        selectedDate={activeDate}
        initialEvent={modalState.editingEvent}
        onClose={closeEventModal}
        onSave={handleSaveEvent}
      />

      <ConfirmationDialog
        visible={modalState.delete}
        title="Delete Meeting"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      <OnboardingModal
        visible={modalState.onboarding}
        onSave={handleOnboardingSave}
      />
    </SafeAreaView>
  );
};
