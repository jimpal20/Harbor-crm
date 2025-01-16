import React, { useState } from 'react';
import { ChevronLeft, Phone, MessageSquare, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import CommunicationDialog from './CommunicationDialog';

const ContactProfile = ({ contact, onClose }) => {
  const [isCommunicationDialogOpen, setIsCommunicationDialogOpen] = useState(false);
  const [selectedCommunicationType, setSelectedCommunicationType] = useState(null);

  const handleCommunicationClick = (type) => {
    setSelectedCommunicationType(type);
    setIsCommunicationDialogOpen(true);
  };

  const handleCommunicationComplete = async (data) => {
    try {
      // Handle communication recording
      setIsCommunicationDialogOpen(false);
      setSelectedCommunicationType(null);
    } catch (error) {
      console.error('Error recording communication:', error);
    }
  };

  if (!contact) return null;

  return (
    <div className="fixed inset-0 bg-white">
      {/* Pull Down Indicator */}
      <div className="absolute top-0 left-0 right-0 flex justify-center p-2">
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <ChevronDown className="w-4 h-4" />
          <span>Pull down for details</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-medium text-gray-900">
              {`${contact.firstName} ${contact.lastName}`.trim()}
            </h1>
            <span className="text-sm text-blue-600">{contact.status}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-8">
        <div className="flex justify-around">
          <button 
            className="flex flex-col items-center space-y-2"
            onClick={() => handleCommunicationClick('phone')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Call</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-2"
            onClick={() => handleCommunicationClick('message')}
          >
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Message</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-2"
            onClick={() => handleCommunicationClick('email')}
          >
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Email</span>
          </button>
        </div>
      </div>

      {/* Contact Info Preview */}
      <div className="px-6 py-4">
        {contact.why && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">{contact.why}</p>
          </div>
        )}

        <div className="space-y-6">
          {contact.preferences?.bestTimeToCall && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
              <span className="text-xs font-medium">Best time to talk: </span>
              <span className="ml-1 text-xs">{contact.preferences.bestTimeToCall}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pull Up Timeline Preview */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-center mb-2">
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>
              {contact.lastAttemptDate 
                ? `Last contacted ${new Date(contact.lastAttemptDate).toLocaleDateString()}`
                : 'No recent activity'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Communication Dialog */}
      <CommunicationDialog
        isOpen={isCommunicationDialogOpen}
        onClose={() => {
          setIsCommunicationDialogOpen(false);
          setSelectedCommunicationType(null);
        }}
        contact={contact}
        initialType={selectedCommunicationType}
        onComplete={handleCommunicationComplete}
      />
    </div>
  );
};

export default ContactProfile;