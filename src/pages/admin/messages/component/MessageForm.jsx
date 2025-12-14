import React, { useEffect, useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { sendMessage } from '../api/MessagesApi';
import { getAllUser } from '../../users/api/UsersApi';

const MessageForm = ({ onSuccess }) => {
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    receiverId: '',
    content: '',
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getAllUser({ page: 1, size: 100 });
        if (res.success) {
          const data = res.data?.response || res.data?.content || [];
          setUsers(data);
        }
      } catch (e) {
        console.error('Failed to load users', e);
      }
    };
    loadUsers();
  }, []);

  const validateForm = () => {
    if (!formData.receiverId) {
      setError('Please select a receiver');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Message content is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await sendMessage(formData);
      setSuccess('Message sent');
      setTimeout(() => {
        closeModal();
        onSuccess && onSuccess();
      }, 800);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md">
      <h2 className="text-xl font-semibold mb-4">New Message</h2>

      {error && (
        <div className="p-3 mb-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}
      {success && (
        <div className="p-3 mb-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <select
            value={formData.receiverId}
            onChange={(e) => setFormData({ ...formData, receiverId: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.userUuid || u.id} value={u.userUuid || u.id}>
                {u.firstName || u.name || u.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border rounded min-h-[120px]"
            maxLength={2000}
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
