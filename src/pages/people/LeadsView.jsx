import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Zap, 
  Clock, 
  Heart, 
  Search,
  Phone,
  MessageSquare,
  Mail,
  MoreHorizontal,
  Lock,
  AlertCircle,
  Plus
} from 'lucide-react';
import CreateContactDialog from '../../components/contacts/CreateContactDialog';
import CommunicationDialog from '../../components/contacts/CommunicationDialog';
import UpdateStatusDialog from '../../components/contacts/UpdateStatusDialog';
import { fetchContacts, updateContactStatus, recordAttempt } from '../../utils/contacts';

const LeadsView = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('focus');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCommunicationDialogOpen, setIsCommunicationDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const allContacts = await fetchContacts();
      // Filter for New and Qualify status contacts
      const leadContacts = allContacts.filter(contact => 
        ['New', 'Qualify'].includes(contact.status)
      );
      setContacts(leadContacts);
      setError(null);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (contactData) => {
    try {
      // Ensure status is either New or Qualify
      const validStatus = ['New', 'Qualify'].includes(contactData.status);
      if (!validStatus) {
        throw new Error('Invalid status for lead');
      }
      await createContact(contactData);
      await loadContacts();
      setIsCreateDialogOpen(false);
      setActiveFilter('focus');
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  const handleCommunication = async (communicationData) => {
    if (!selectedContact) return;
    try {
      await recordAttempt(selectedContact.id, communicationData);
      await loadContacts();
      setIsCommunicationDialogOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error('Error recording communication:', error);
    }
  };

  const handleStatusUpdate = async (statusData) => {
    if (!selectedContact) return;
    try {
      await updateContactStatus(selectedContact.id, statusData);
      await loadContacts();
      setIsUpdateDialogOpen(false);
      setSelectedContact(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const calculateDaysInStatus = (contact) => {
    const createdDate = new Date(contact.createdAt);
    const now = new Date();
    return Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
  };

  const filteredContacts = contacts.filter(contact => {
    if (activeFilter === 'focus') {
      return contact.inFocusNow;
    }
    return true; // 'all' filter
  });

  return (
    <div className="h-screen bg-white flex flex-col relative">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={() => navigate('/people')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
            <p className="text-sm text-gray-500">New and qualifying contacts</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg pl-10"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b bg-white">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('focus')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium ${
              activeFilter === 'focus'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Focus Now</span>
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>All Leads</span>
          </button>
          {/* Locked Filter */}
          <button
            disabled
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-400"
          >
            <Heart className="w-3 h-3" />
            <span>Keep Warm</span>
            <Lock className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No leads found in this section
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-200"
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                  >
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {`${contact.firstName} ${contact.lastName}`.trim()}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        contact.status === 'New'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{contact.context}</p>
                    
                    {/* Status Indicators */}
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{calculateDaysInStatus(contact)} days in status</span>
                      </div>
                      {contact.status === 'New' && calculateDaysInStatus(contact) >= 30 && (
                        <div className="flex items-center space-x-1 text-xs text-amber-500">
                          <AlertCircle className="w-3 h-3" />
                          <span>Status review needed</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Attempt Info */}
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="text-xs text-gray-400">
                        {contact.attemptCount > 0 
                          ? `${contact.attemptCount} attempt${contact.attemptCount > 1 ? 's' : ''}`
                          : 'No attempts yet'}
                      </div>
                      {contact.lastAttemptDate && (
                        <div className="text-xs text-gray-400">
                          Last contact: {new Date(contact.lastAttemptDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsUpdateDialogOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-4 mt-4">
                  <button 
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsCommunicationDialogOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsCommunicationDialogOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-green-600"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsCommunicationDialogOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-500 transition-colors"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dialogs */}
      <CreateContactDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateContact}
        defaultStatus="New"
      />
      
      <CommunicationDialog
        isOpen={isCommunicationDialogOpen}
        onClose={() => {
          setIsCommunicationDialogOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        onComplete={handleCommunication}
      />

      <UpdateStatusDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => {
          setIsUpdateDialogOpen(false);
          setSelectedContact(null);
        }}
        onUpdate={handleStatusUpdate}
        currentStatus={selectedContact?.status}
      />
    </div>
  );
};

export default LeadsView;