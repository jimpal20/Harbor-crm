import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ContactMainView from '../../components/contacts/ContactMainView';
import ContactDetailsView from '../../components/contacts/ContactDetailsView';
import ContactTimelineView from '../../components/contacts/ContactTimelineView';

// View state enum
const ViewState = {
  MAIN: 'main',
  DETAILS_PEEK: 'details_peek',
  DETAILS_FULL: 'details_full',
  TIMELINE_PEEK: 'timeline_peek',
  TIMELINE_FULL: 'timeline_full'
};

export default function ContactPage() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewState, setViewState] = useState(ViewState.MAIN);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const contactRef = doc(db, 'contacts', contactId);
        const contactDoc = await getDoc(contactRef);
        
        if (contactDoc.exists()) {
          setContact({ id: contactDoc.id, ...contactDoc.data() });
        } else {
          setError('Contact not found');
        }
      } catch (err) {
        console.error('Error fetching contact:', err);
        setError('Failed to load contact');
      } finally {
        setLoading(false);
      }
    };

    if (contactId) {
      fetchContact();
    }
  }, [contactId]);

  const handleGoBack = () => {
    navigate('/people');
  };

  const handleDetailsExpand = () => {
    switch (viewState) {
      case ViewState.MAIN:
        setViewState(ViewState.DETAILS_PEEK);
        break;
      case ViewState.DETAILS_PEEK:
        setViewState(ViewState.DETAILS_FULL);
        break;
      case ViewState.DETAILS_FULL:
        setViewState(ViewState.MAIN);
        break;
      default:
        setViewState(ViewState.MAIN);
    }
  };

  const handleTimelineExpand = () => {
    switch (viewState) {
      case ViewState.MAIN:
        setViewState(ViewState.TIMELINE_PEEK);
        break;
      case ViewState.TIMELINE_PEEK:
        setViewState(ViewState.TIMELINE_FULL);
        break;
      case ViewState.TIMELINE_FULL:
        setViewState(ViewState.MAIN);
        break;
      default:
        setViewState(ViewState.MAIN);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // Determine view states
  const showDetails = [ViewState.DETAILS_PEEK, ViewState.DETAILS_FULL].includes(viewState);
  const isDetailsPeek = viewState === ViewState.DETAILS_PEEK;
  const showTimeline = [ViewState.TIMELINE_PEEK, ViewState.TIMELINE_FULL].includes(viewState);
  const isTimelinePeek = viewState === ViewState.TIMELINE_PEEK;

  return (
    <div className="relative h-screen overflow-hidden bg-white">
      {/* Details Content Layer */}
      {showDetails && (
        <ContactDetailsView
          contact={contact}
          isPeek={isDetailsPeek}
          onExpand={handleDetailsExpand}
          viewState={viewState}
        />
      )}

      {/* Main Content Layer */}
      <div 
        className={`fixed inset-0 bg-white transition-transform duration-300 ${
          showDetails ? 'translate-y-[85%]' : 'translate-y-0'
        }`}
      >
        <ContactMainView
          contact={contact}
          onGoBack={handleGoBack}
          onPullDown={handleDetailsExpand}
          onTimelineExpand={handleTimelineExpand}
          showPullDown={!showDetails}
        />
      </div>

      {/* Timeline Layer */}
      {showTimeline && (
        <ContactTimelineView
          contact={contact}
          isPeek={isTimelinePeek}
          onExpand={handleTimelineExpand}
        />
      )}
    </div>
  );
}