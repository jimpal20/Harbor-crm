import { useState } from 'react';
import { X } from 'lucide-react';

const UpdateStatusDialog = ({ isOpen, onClose, onUpdate, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [category, setCategory] = useState('engagement');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getStatusOptions = (currentCategory) => {
    switch (currentCategory) {
      case 'engagement':
        return [
          { value: 'New', label: 'New' },
          { value: 'Qualify', label: 'Qualify' },
          { value: 'Active', label: 'Active' },
          { value: 'Prime', label: 'Prime' },
          { value: 'Pending', label: 'Pending' },
          { value: 'Closed', label: 'Closed' },
          { value: 'Archived', label: 'Archived' }
        ];
      case 'sensitive':
        return [
          { value: 'Watch', label: 'Watch' }
        ];
      case 'disqualified':
        return [
          { value: 'Junk', label: 'Junk' },
          { value: 'DNC', label: 'DNC' }
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');

      await onUpdate({ 
        status, 
        category,
        note: note.trim() || `Status changed to ${status}`
      });

      // Reset form
      setStatus(currentStatus);
      setCategory('engagement');
      setNote('');
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStatus(currentStatus);
    setCategory('engagement');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Update Status</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setStatus(''); // Reset status when category changes
              }}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="engagement">Engagement</option>
              <option value="sensitive">Sensitive</option>
              <option value="disqualified">Disqualified</option>
            </select>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">Select status...</option>
              {getStatusOptions(category).map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSubmitting}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              placeholder="Add any notes about this status change..."
            />
          </div>

          <div className="pt-4 border-t flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!status || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-50"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusDialog;