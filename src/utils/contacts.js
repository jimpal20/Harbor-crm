import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  getDoc,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const calculateNextVisibleDate = (status, createdAt, attemptCount = 0) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const daysSinceCreation = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
  const nextDate = new Date();
  nextDate.setHours(0, 0, 0, 0);

  // Handle NEW status based on attempt count and creation date
  if (status === 'New') {
    if (attemptCount <= 7) {
      nextDate.setDate(nextDate.getDate() + 1); // First 7 attempts: Next day
    } else if (attemptCount <= 14) {
      nextDate.setDate(nextDate.getDate() + 2); // Attempts 8-14: Every 2 days
    } else {
      nextDate.setDate(nextDate.getDate() + 3); // After 14 attempts: Every 3 days
    }
    return nextDate;
  }

  // Handle other statuses based on documentation
  switch(status) {
    case 'Qualify':
      nextDate.setDate(nextDate.getDate() + 30); // 30-day cycle
      break;
    case 'Active':
      nextDate.setDate(nextDate.getDate() + 21); // 21-day cycle
      break;
    case 'Prime':
      nextDate.setDate(nextDate.getDate() + 7);  // 7-day cycle
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate;
};

const shouldPromoteToQualify = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const daysSinceCreation = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
  return daysSinceCreation >= 45;
};

const createTimelineEvent = async (contactId, eventData) => {
  try {
    const timelineRef = collection(db, `contacts/${contactId}/timeline`);
    const event = {
      ...eventData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    };
    await addDoc(timelineRef, event);
    return true;
  } catch (error) {
    console.error("Error creating timeline event:", error);
    throw error;
  }
};

const fetchTimelineEvents = async (contactId) => {
  try {
    const timelineRef = collection(db, `contacts/${contactId}/timeline`);
    const q = query(timelineRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching timeline events:", error);
    throw error;
  }
};

const createContact = async (contactData) => {
  try {
    const now = new Date().toISOString();
    const contact = {
      firstName: contactData.firstName || '',
      lastName: contactData.lastName || '',
      email: contactData.email || '',
      phone: contactData.phone || '',
      context: contactData.context || '',
      status: 'New',  // Always starts as New
      section: 'focus', // Always starts in Focus Now
      category: 'engagement', // Default category
      visibleFrom: now,
      attemptCount: 0,
      lastAttemptDate: null,
      lastAttemptType: null,
      lastAttemptNotes: null,
      leadSource: contactData.leadSource || '',
      createdAt: now,
      updatedAt: now,
      nextFollowUp: now, // Initial follow-up date
      autoPromoteDate: new Date(Date.now() + (45 * 24 * 60 * 60 * 1000)).toISOString(), // 45 days from now
      preferences: {
        contactMethod: contactData.preferences?.contactMethod || null,
        bestTimeToCall: contactData.preferences?.bestTimeToCall || null
      }
    };

    const docRef = await addDoc(collection(db, "contacts"), contact);
    
    // Create initial timeline event
    await createTimelineEvent(docRef.id, {
      type: 'status',
      from: null,
      to: 'New',
      note: 'Contact created'
    });

    return { id: docRef.id, ...contact };
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

const fetchContacts = async () => {
  try {
    const contactsRef = collection(db, 'contacts');
    const q = query(contactsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const contacts = [];
    const now = new Date();

    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      
      // Check for auto-promotion to Qualify status
      if (data.status === 'New' && shouldPromoteToQualify(data.createdAt)) {
        await updateContactStatus(doc.id, { 
          status: 'Qualify',
          category: 'engagement',
          section: 'focus'
        });
        data.status = 'Qualify';
      }

      // Determine if contact should be visible in Focus Now
      const visibleFrom = new Date(data.visibleFrom);
      const shouldShowInFocus = visibleFrom <= now;

      contacts.push({
        id: doc.id,
        ...data,
        section: shouldShowInFocus ? 'focus' : data.section || 'focus'
      });
    }
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

const recordAttempt = async (contactId, attemptData) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    const contactDoc = await getDoc(contactRef);
    const contact = contactDoc.data();
    const now = new Date().toISOString();
    
    const nextVisibleDate = calculateNextVisibleDate(
      contact.status,
      contact.createdAt,
      contact.attemptCount + 1
    );

    const updates = {
      lastAttemptDate: now,
      lastAttemptType: attemptData.type || null,
      lastAttemptNotes: attemptData.notes || null,
      attemptCount: (contact.attemptCount || 0) + 1,
      visibleFrom: nextVisibleDate.toISOString(),
      updatedAt: now,
      section: 'progress' // Move to In Progress after attempt
    };

    // If attempt was successful and status is New, prompt for status change
    if (attemptData.successful && contact.status === 'New') {
      updates.section = 'focus'; // Keep in focus for status change
    }

    await updateDoc(contactRef, updates);

    // Create timeline event
    await createTimelineEvent(contactId, {
      type: attemptData.type,
      status: attemptData.successful ? 'success' : 'unsuccessful',
      note: attemptData.notes || null,
      duration: attemptData.duration || null
    });

    return true;
  } catch (error) {
    console.error("Error recording attempt:", error);
    throw error;
  }
};

const updateContactStatus = async (contactId, updateData) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    const contactDoc = await getDoc(contactRef);
    const contact = contactDoc.data();
    const now = new Date().toISOString();
    
    // Calculate next visibility based on new status
    const nextVisibleDate = calculateNextVisibleDate(
      updateData.status,
      contact.createdAt,
      contact.attemptCount
    );

    const updates = {
      status: updateData.status,
      section: updateData.section || 'focus',
      category: updateData.category || contact.category,
      updatedAt: now,
      visibleFrom: nextVisibleDate.toISOString()
    };
    
    await updateDoc(contactRef, updates);

    // Create timeline event for status change
    await createTimelineEvent(contactId, {
      type: 'status',
      from: contact.status,
      to: updateData.status,
      note: updateData.note || 'Status updated'
    });

    return true;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

const updateContactDetails = async (contactId, detailsData) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    const now = new Date().toISOString();
    
    const updates = {
      ...detailsData,
      updatedAt: now
    };
    
    await updateDoc(contactRef, updates);

    // Create timeline event for details update
    await createTimelineEvent(contactId, {
      type: 'note',
      note: 'Contact details updated'
    });

    return true;
  } catch (error) {
    console.error("Error updating contact details:", error);
    throw error;
  }
};

export {
  createContact,
  fetchContacts,
  updateContactStatus,
  recordAttempt,
  fetchTimelineEvents,
  updateContactDetails
};