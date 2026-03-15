// src/services/EventService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { CalendarEvent } from '../components/calendar/EventModal';

class EventService {
  private collectionName = 'events';

  // --- 1. Real-time Listener ---
  subscribeToEvents(
    callback: (events: Record<string, CalendarEvent[]>) => void,
  ) {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {}; // Return empty un-subscriber if no user

    // Query: Only get events that belong to the logged-in user
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
    );

    // onSnapshot listens for LIVE changes. If you add/delete, this fires automatically!
    return onSnapshot(q, snapshot => {
      const eventsMap: Record<string, CalendarEvent[]> = {};

      snapshot.forEach(document => {
        const data = document.data();
        const dateKey = data.date; // The 'YYYY-MM-DD' string

        const event: CalendarEvent = {
          id: document.id, // The unique Firebase document ID
          title: data.title,
          time: data.time,
          description: data.description,
        };

        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }
        eventsMap[dateKey].push(event);
      });

      // Send the grouped events back to the Dashboard
      callback(eventsMap);
    });
  }

  // --- 2. Create ---
  async createEvent(event: Omit<CalendarEvent, 'id'>, date: string) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Must be logged in to create events.');

    await addDoc(collection(db, this.collectionName), {
      ...event,
      date,
      userId,
      createdAt: new Date().toISOString(),
    });
  }

  // --- 3. Update ---
  async updateEvent(eventId: string, eventData: Partial<CalendarEvent>) {
    const eventRef = doc(db, this.collectionName, eventId);
    await updateDoc(eventRef, { ...eventData });
  }

  // --- 4. Delete ---
  async deleteEvent(eventId: string) {
    const eventRef = doc(db, this.collectionName, eventId);
    await deleteDoc(eventRef);
  }
}

export default new EventService();
