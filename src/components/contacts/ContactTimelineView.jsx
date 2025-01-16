import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  FileText, 
  Home,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Filter
} from 'lucide-react';

export default function ContactTimelineView({
  contact,
  isPeek,
  onClose,
  onExpand
}) {
  const [activeFilters, setActiveFilters] = useState(['all']);

  if (!contact) return null;

  const filters = [
    { id: 'all', label: 'All', icon: Clock },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'status', label: 'Status', icon: RotateCcw },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'property', label: 'Property', icon: Home }
  ];

  const toggleFilter = (filterId) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      const newFilters = activeFilters.includes('all')
        ? [filterId]
        : activeFilters.includes(filterId)
          ? activeFilters.filter(f => f !== filterId)
          : [...activeFilters, filterId];
      setActiveFilters(newFilters.length ? newFilters : ['all']);
    }
  };

  // Mock timeline data - would be replaced with real data from props/context
  const timelineEvents = [
    {
      type: 'call',
      status: 'success',
      date: '2024-01-15T14:30:00',
      note: 'Discussed property requirements, interested in 3-4 bed homes in North district',
      duration: '12 min',
      starred: true
    },
    {
      type: 'status',
      date: '2024-01-14T11:20:00',
      from: 'New',
      to: 'Active',
      note: 'Moved to active after successful call'
    },
    {
      type: 'property',
      date: '2024-01-13T10:15:00',
      action: 'Viewed',
      property: '123 Main St',
      note: 'Showed strong interest in the backyard space'
    },
    {
      type: 'task',
      status: 'completed',
      date: '2024-01-12T09:15:00',
      description: 'Send neighborhood comparison report',
      note: 'Included school district information as requested'
    },
    {
      type: 'note',
      date: '2024-01-11T15:30:00',
      note: 'Mentioned preference for move-in ready homes, budget flexible up to $600k for right property'
    }
  ];

  const getEventIcon = (type, status) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'message':
        return MessageSquare;
      case 'email':
        return Mail;
      case 'status':
        return RotateCcw;
      case 'task':
        return status === 'completed' ? CheckCircle : AlertCircle;
      case 'note':
        return FileText;
      case 'property':
        return Home;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div 
      className={`fixed inset-x-0 bottom-0 bg-white shadow-lg z-10 ${
        isPeek ? 'h-1/3' : 'h-[85%]'
      }`}
    >
      {/* Pull Handle and Header */}
      <div className="border-b border-gray-100">
        <div 
          className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 cursor-pointer"
          onClick={onExpand}
        />
        <div className="px-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Activity Timeline</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => toggleFilter(id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap ${
                  activeFilters.includes(id)
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="overflow-y-auto" style={{ height: 'calc(100% - 116px)' }}>
        <div className="px-6 py-4 space-y-6">
          {timelineEvents
            .filter(event => 
              activeFilters.includes('all') || activeFilters.includes(event.type)
            )
            .map((event, index) => {
              const Icon = getEventIcon(event.type, event.status);
              return (
                <div key={index} className="flex space-x-4">
                  {/* Event Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.status === 'success' 
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        {event.starred && (
                          <Star className="w-3 h-3 text-yellow-500 inline ml-1" />
                        )}
                      </div>
                      <time className="text-xs text-gray-500">
                        {formatDate(event.date)}
                      </time>
                    </div>

                    {/* Event Type Specific Content */}
                    {event.type === 'status' ? (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{event.from}</span>
                        <span>→</span>
                        <span>{event.to}</span>
                      </div>
                    ) : event.type === 'property' ? (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{event.action}: </span>
                        {event.property}
                      </div>
                    ) : event.type === 'task' ? (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{event.description}</span>
                      </div>
                    ) : null}

                    {/* Common Note Field */}
                    {event.note && (
                      <p className="text-sm text-gray-600">{event.note}</p>
                    )}
                    
                    {/* Additional Details */}
                    {event.duration && (
                      <div className="text-xs text-gray-500">
                        Duration: {event.duration}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}