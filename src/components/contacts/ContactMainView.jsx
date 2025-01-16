import React from 'react';
import { Phone, MessageSquare, Mail, ChevronLeft, MoreVertical, ChevronDown } from 'lucide-react';

const ContactMainView = ({ 
  contact, 
  onGoBack, 
  onPullDown,
  onTimelineExpand,
  showPullDown 
}) => {
  if (!contact) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header/Pull Tab */}
      <div 
        className="bg-white border-b border-gray-100 cursor-pointer"
        onClick={onPullDown}
      >
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onGoBack();
              }}
              className="p-2 -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-medium text-gray-900">
                {`${contact.firstName} ${contact.lastName}`.trim()}
              </h1>
              <span className="text-sm text-blue-600">{contact.status}</span>
            </div>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-2 -mr-2"
            >
              <MoreVertical className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          {showPullDown && (
            <div className="flex justify-center items-center space-x-1 text-xs text-gray-400">
              <ChevronDown className="w-4 h-4" />
              <span>Pull down for details</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex justify-around">
            <button className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Call</span>
            </button>
            <button className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Message</span>
            </button>
            <button className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Email</span>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="mt-auto">
            <div 
              className="cursor-pointer"
              onClick={onTimelineExpand}
            >
              <h3 className="text-base font-medium">Recent Activity</h3>
              <div className="flex items-center space-x-2 mt-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">
                  {contact.lastAttemptDate 
                    ? `Last contacted ${new Date(contact.lastAttemptDate).toLocaleDateString()}`
                    : 'No recent activity'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMainView;