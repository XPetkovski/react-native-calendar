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

  // Real-time Listener
  subscribeToEvents(
    callback: (events: Record<string, CalendarEvent[]>) => void,
  ) {
    const userId = auth.currentUser?.uid;
    if (!userId) return () => {};

    // Query: Only get events that belong to the logged-in user
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
    );

    return onSnapshot(q, snapshot => {
      const eventsMap: Record<string, CalendarEvent[]> = {};

      snapshot.forEach(document => {
        const data = document.data();
        const dateKey = data.date;

        const event: CalendarEvent = {
          id: document.id,
          title: data.title,
          time: data.time,
          description: data.description,
        };

        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }
        eventsMap[dateKey].push(event);
      });

      callback(eventsMap);
    });
  }

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

  async updateEvent(eventId: string, eventData: Partial<CalendarEvent>) {
    const eventRef = doc(db, this.collectionName, eventId);
    await updateDoc(eventRef, { ...eventData });
  }

  async deleteEvent(eventId: string) {
    const eventRef = doc(db, this.collectionName, eventId);
    await deleteDoc(eventRef);
  }
}

export default new EventService();
