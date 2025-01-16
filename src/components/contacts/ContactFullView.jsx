import React from 'react';
import { ChevronLeft, MoreVertical, Phone, MessageSquare, Mail } from 'lucide-react';

const ContactFullView = ({ contact }) => {
  // Mock data - would come from props in real implementation
  const mockContact = {
    name: "Sarah Johnson",
    status: "Active",
    phone: "(555) 123-4567",
    email: "sarah@example.com",
    priceRange: "$500,000 - $750,000",
    leadSource: "Zillow",
    lender: {
      name: "John Smith",
      company: "First National Bank",
      phone: "(555) 999-8888"
    },
    associatedContacts: [
      { name: "Mike Johnson", relationship: "Spouse", phone: "(555) 123-4568" }
    ],
    assignedAgent: "David Wilson",
    preferences: {
      contactMethod: "Text",
      bestTimeToCall: "Evenings after 6pm"
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          {/* Personal Information Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-900">Personal Information</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500">Birthday</div>
                <div className="text-sm">March 15, 1988</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Anniversary</div>
                <div className="text-sm">September 22, 2018</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Children</div>
                <div className="text-sm">Expecting first child - December 2024</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Pets</div>
                <div className="text-sm">Golden Retriever (Max)</div>
              </div>
              <div className="pt-2">
                <div className="text-xs font-medium text-gray-900">Memorable Info</div>
                <div className="mt-1 text-sm bg-gray-50 rounded-lg p-2">
                  Loves to garden, training for first marathon, works as a pediatric nurse at City Hospital
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-900">Contact Preferences</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500">Preferred Contact Method</div>
                <div className="text-sm">{mockContact.preferences.contactMethod}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Best Time to Contact</div>
                <div className="text-sm">{mockContact.preferences.bestTimeToCall}</div>
              </div>
            </div>
          </div>

          {/* Associated Contacts Section */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-xs font-medium text-gray-900">Associated Contacts</h3>
            {mockContact.associatedContacts.map((contact, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-gray-500">{contact.relationship}</div>
                  </div>
                  <button className="p-2 rounded-full bg-blue-50 text-blue-600">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Lead Information Section */}
          <div className="pt-4 border-t">
            <h3 className="text-xs font-medium text-gray-900 mb-3">Lead Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Source</div>
                <div className="text-sm">{mockContact.leadSource}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Timeline</div>
                <div className="text-sm">Summer 2025</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Pre-Approval</div>
                <div className="text-sm">Not Started</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Current Status</div>
                <div className="text-sm">Renting</div>
              </div>
            </div>
          </div>

          {/* Their "Why" Section */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-xs font-medium text-gray-900">Their "Why"</h3>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                Growing family - expecting first child in December. Looking for a forever home with good schools and a yard for their future family.
              </div>
            </div>
          </div>

          {/* Contact Methods Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Price Range</div>
                <div className="text-sm font-medium">{mockContact.priceRange}</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm font-medium">{mockContact.email}</div>
              </div>
              <button className="p-2 rounded-full bg-purple-50 text-purple-600">
                <Mail className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-xs text-gray-500">Phone</div>
                <div className="text-sm font-medium">{mockContact.phone}</div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-blue-50 text-blue-600">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-full bg-green-50 text-green-600">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Header that stays at bottom - keeping original sizes */}
      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        <div className="flex items-center justify-between">
          <button className="p-2">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-medium text-gray-900">{mockContact.name}</h3>
            <span className="text-sm text-blue-600">{mockContact.status}</span>
          </div>
          <button className="p-2">
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactFullView;