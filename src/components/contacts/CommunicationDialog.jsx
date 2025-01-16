// src/components/contacts/CommunicationDialog.jsx
import React, { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, Mail, Check, ChevronLeft } from 'lucide-react';
import { useCommunication, CommunicationType, CommunicationStatus } from '../../hooks/useCommunication';
import UpdateStatusDialog from './UpdateStatusDialog';

const CommunicationDialog = ({ isOpen, onClose, contact, onComplete }) => {
  const [communicationType, setCommunicationType] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isLogging,
    error,
    initiateCommunication,
    handleCommunication,
    isIOS
  } = useCommunication(contact);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setCommunicationType('');
      setNotes('');
      setDuration('');
      setShowStatusUpdate(false);
    }
  }, [isOpen]);

  if (!isOpen || !contact) return null;

  const handleTypeSelection = async (type) => {
    setCommunicationType(type);
    const success = await initiateCommunication(type);
    
    // If on iOS, we'll close the dialog and wait for return
    if (success && isIOS) {
      onClose();
    }
  };

  const handleSubmit = async (successful) => {
    if (!communicationType) return;

    try {
      setIsSubmitting(true);

      const result = await handleCommunication(
        communicationType,
        successful ? CommunicationStatus.SUCCESS : CommunicationStatus.FAILURE,
        notes,
        duration
      );

      // Handle status update requirement
      if (result.requiresStatusUpdate) {
        setShowStatusUpdate(true);
      } else {
        if (onComplete) {
          await onComplete({
            type: communicationType,
            successful,
            notes,
            duration: duration || null,
            nextFollowUp: result.nextFollowUp
          });
        }
        onClose();
      }
    } catch (err) {
      console.error('Error recording communication:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center">
              {communicationType && (
                <button
                  onClick={() => setCommunicationType('')}
                  className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-xl font-semibold text-gray-900">
                {communicationType ? 'Record Communication' : 'Contact Options'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {!communicationType ? (
              // Communication Type Selection
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleTypeSelection(CommunicationType.PHONE)}
                  disabled={isSubmitting || !contact.phone}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Call</span>
                </button>
                <button
                  onClick={() => handleTypeSelection(CommunicationType.TEXT)}
                  disabled={isSubmitting || !contact.phone}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Message</span>
                </button>
                <button
                  onClick={() => handleTypeSelection(CommunicationType.EMAIL)}
                  disabled={isSubmitting || !contact.email}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Email</span>
                </button>
              </div>
            ) : (
              // Communication Logging Form
              <div className="space-y-6">
                {/* Duration Field (only for calls) */}
                {communicationType === CommunicationType.PHONE && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Call Duration (optional)
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="e.g., 15 min"
                    />
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isSubmitting}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="Add any notes about the communication..."
                  />
                </div>

                {/* Success/Failure Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Unsuccessful
                  </button>
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Successful
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Dialog */}
      <UpdateStatusDialog
        isOpen={showStatusUpdate}
        onClose={() => {
          setShowStatusUpdate(false);
          onClose();
        }}
        onUpdate={async (statusData) => {
          if (onComplete) {
            await onComplete({
              type: communicationType,
              successful: true,
              notes,
              duration: duration || null,
              statusUpdate: statusData
            });
          }
          setShowStatusUpdate(false);
          onClose();
        }}
        currentStatus={contact.status}
      />
    </>
  );
};

export default CommunicationDialog;