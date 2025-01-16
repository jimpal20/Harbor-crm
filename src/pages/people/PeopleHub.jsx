import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserPlus, Plus, X } from 'lucide-react';
import CreateContactDialog from '../../components/contacts/CreateContactDialog';

const PeopleHub = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock metrics - would come from context/props in real implementation
  const metrics = {
    clients: {
      needAttention: 12,
      total: 25
    },
    leads: {
      needFollowUp: 8,
      total: 15
    },
    all: {
      total: 53
    }
  };

  const handleCreateContact = async (contactData) => {
    try {
      console.log('Create contact:', contactData);
      setIsCreateDialogOpen(false);
      
      // Navigate based on status
      if (['Active', 'Prime'].includes(contactData.status)) {
        navigate('/people/clients');
      } else if (['New', 'Qualify'].includes(contactData.status)) {
        navigate('/people/leads');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col relative">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-semibold text-gray-900">People</h1>
        <p className="text-sm text-gray-500 mt-1">Select a view to get started</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Clients Card */}
          <button 
            onClick={() => navigate('/people/clients')}
            className="w-full p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Clients</h3>
                <p className="text-sm text-gray-500 mt-1">Active and Prime contacts</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <span className="font-medium">{metrics.clients.needAttention} contacts need attention</span>
            </div>
          </button>

          {/* Leads Card */}
          <button 
            onClick={() => navigate('/people/leads')}
            className="w-full p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-sm transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Leads</h3>
                <p className="text-sm text-gray-500 mt-1">New and qualifying contacts</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <span className="font-medium">{metrics.leads.needFollowUp} leads to follow up</span>
            </div>
          </button>

          {/* All People Card */}
          <button 
            onClick={() => navigate('/people/all')}
            className="w-full p-6 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-sm transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">All People</h3>
                <p className="text-sm text-gray-500 mt-1">View your entire database</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-emerald-600">
              <span className="font-medium">{metrics.all.total} total contacts</span>
            </div>
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Create Contact Dialog */}
      <CreateContactDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateContact}
      />
    </div>
  );
};

export default PeopleHub;