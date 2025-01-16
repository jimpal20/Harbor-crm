import React from 'react';
import { ChevronLeft, MoreVertical, ChevronDown } from 'lucide-react';

const ContactHeader = ({ 
  contact, 
  isExpanded,
  onBack,
  onPullDown,
  className = ""
}) => {
  if (!contact) return null;

  return (
    <div 
      className={`bg-white border-b border-gray-100 cursor-pointer ${className}`}
      onClick={onPullDown}
    >
      {/* Main Header Content - Acts as Pull Tab */}
      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBack();
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
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu
            }}
            className="p-2 -mr-2"
          >
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Pull Down Indicator */}
        <div className="flex justify-center items-center space-x-1 text-xs text-gray-400">
          <ChevronDown className="w-4 h-4" />
          <span>Pull down for details</span>
        </div>
      </div>
    </div>
  );
};

export default ContactHeader;