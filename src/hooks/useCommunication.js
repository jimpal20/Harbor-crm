// src/hooks/useCommunication.js
import { useState, useCallback } from 'react';
import { recordAttempt, updateContactStatus } from '../utils/contacts';

// Platform detection
const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || 
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Enums for communication
export const CommunicationType = {
  PHONE: 'phone',
  TEXT: 'text',
  EMAIL: 'email'
};

export const CommunicationStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure'
};

// Handle native app launches
const launchNativeApp = async (type, contact) => {
  switch (type) {
    case CommunicationType.PHONE:
      window.location.href = `tel:${contact.phone}`;
      return true;
    case CommunicationType.TEXT:
      window.location.href = `sms:${contact.phone}`;
      return true;
    case CommunicationType.EMAIL:
      window.location.href = `mailto:${contact.email}`;
      return true;
    default:
      return false;
  }
};

export const useCommunication = (contact) => {
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState(null);

  // Handle communication attempt
  const handleCommunication = useCallback(async (type, status, notes = '', duration = null) => {
    try {
      setIsLogging(true);
      setError(null);

      // Record the attempt
      await recordAttempt(contact.id, {
        type,
        successful: status === CommunicationStatus.SUCCESS,
        notes,
        duration
      });

      // Handle status transitions based on success/failure
      if (status === CommunicationStatus.SUCCESS && contact.status === 'New') {
        // Prompt for status change through UI
        return {
          requiresStatusUpdate: true,
          message: 'Would you like to update the contact status?'
        };
      }

      // Calculate next follow-up based on current status and attempt count
      const nextFollowUp = calculateNextFollowUp(contact, status);
      
      if (nextFollowUp) {
        await updateContactStatus(contact.id, {
          nextFollowUp,
          section: 'progress'
        });
      }

      return {
        requiresStatusUpdate: false,
        nextFollowUp
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLogging(false);
    }
  }, [contact]);

  // Initialize communication attempt
  const initiateCommunication = useCallback(async (type) => {
    if (!contact) return;

    // Validate contact has required info
    if (type === CommunicationType.PHONE && !contact.phone) {
      setError('No phone number available');
      return false;
    }
    if (type === CommunicationType.EMAIL && !contact.email) {
      setError('No email address available');
      return false;
    }

    // Handle platform-specific behavior
    if (isIOS) {
      return await launchNativeApp(type, contact);
    }

    // Web fallback behavior
    switch (type) {
      case CommunicationType.PHONE:
        window.location.href = `tel:${contact.phone}`;
        break;
      case CommunicationType.TEXT:
        window.location.href = `sms:${contact.phone}`;
        break;
      case CommunicationType.EMAIL:
        window.location.href = `mailto:${contact.email}`;
        break;
    }

    return true;
  }, [contact]);

  // Calculate next follow-up based on status and attempt history
  const calculateNextFollowUp = (contact, attemptStatus) => {
    const now = new Date();
    
    // If this was a successful attempt, follow status-based scheduling
    if (attemptStatus === CommunicationStatus.SUCCESS) {
      switch (contact.status) {
        case 'New':
          return new Date(now.setDate(now.getDate() + 1));
        case 'Qualify':
          return new Date(now.setDate(now.getDate() + 30));
        case 'Active':
          return new Date(now.setDate(now.getDate() + 21));
        case 'Prime':
          return new Date(now.setDate(now.getDate() + 7));
        default:
          return new Date(now.setDate(now.getDate() + 1));
      }
    }

    // For unsuccessful attempts, follow the attempt count rules
    const attemptCount = (contact.attemptCount || 0) + 1;
    if (attemptCount <= 7) {
      return new Date(now.setDate(now.getDate() + 1));
    } else if (attemptCount <= 14) {
      return new Date(now.setDate(now.getDate() + 2));
    } else {
      return new Date(now.setDate(now.getDate() + 3));
    }
  };

  return {
    isLogging,
    error,
    initiateCommunication,
    handleCommunication,
    isIOS
  };
};

// Communication service for global operations
export const CommunicationService = {
  // Check if we're returning from a native app
  checkReturnFromNative: () => {
    if (!isIOS) return false;
    
    // Implementation will depend on iOS native app integration
    // For now, we'll use a timestamp-based approach
    const lastAppExit = localStorage.getItem('lastAppExit');
    const now = Date.now();
    
    if (lastAppExit && (now - parseInt(lastAppExit)) < 5000) {
      // Returned within 5 seconds, likely from native app
      return true;
    }
    
    return false;
  },

  // Store app exit timestamp
  recordAppExit: () => {
    if (isIOS) {
      localStorage.setItem('lastAppExit', Date.now().toString());
    }
  }
};