import React from 'react';
import { Phone, MessageSquare, Mail, ChevronLeft, MoreVertical, ChevronDown } from 'lucide-react';

const ContactDetailsView = ({ 
  contact, 
  isPeek,
  onExpand,
  viewState
}) => {
  if (!contact) return null;

  const translateValue = isPeek ? '-85%' : '0%';

  return (
    <div 
      className={`fixed inset-0 bg-white transition-transform duration-300`}
      style={{ transform: `translateY(${translateValue})` }}
    >
      {/* Scrollable Content Area */}
      <div className="h-full overflow-y-auto">
        <div className="space-y-6 p-6">
          {/* Contact Methods */}
          <div className="space-y-4">
            {contact.email && (
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-base">{contact.email}</div>
                </div>
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
            )}
            {contact.phone && (
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-base">{contact.phone}</div>
                </div>
                <div className="flex space-x-4">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
              </div>
            )}
          </div>

          {/* Lead Information */}
          <div>
            <h3 className="text-sm font-medium mb-4">Lead Information</h3>
            {/* Add lead information content */}
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-medium mb-4">Personal Information</h3>
            {/* Add personal information content */}
          </div>
        </div>
      </div>

      {/* Pull Tab Header - Always at bottom of pulled content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-b border-gray-100">
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <button className="p-2 -ml-2">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-medium text-gray-900">
                {`${contact.firstName} ${contact.lastName}`.trim()}
              </h1>
              <span className="text-sm text-blue-600">{contact.status}</span>
            </div>
            <button className="p-2 -mr-2">
              <MoreVertical className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <div className="flex justify-center items-center space-x-1 text-xs text-gray-400">
            <ChevronDown className="w-4 h-4" />
            <span>Pull down for details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsView;