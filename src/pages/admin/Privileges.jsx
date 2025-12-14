import React, { useState, useEffect } from 'react';
import { getAllPrivilege, deletePrivilege, changePrivilegeStatus } from '@/pages/admin/api/AdminApi';

const Privileges = () => {
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrivileges();
  }, []);

  const fetchPrivileges = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllPrivilege({ search: searchTerm });
      if (response.success) {
        setPrivileges(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch privileges');
      }
    } catch (err) {
      setError('Failed to fetch privileges');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrivilege = async (id) => {
    if (window.confirm('Are you sure you want to delete this privilege?')) {
      try {
        const response = await deletePrivilege(id);
        if (response.success) {
          setPrivileges(privileges.filter(priv => priv.id !== id));
        } else {
          setError(response.error || 'Failed to delete privilege');
        }
      } catch (err) {
        setError('Failed to delete privilege');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await changePrivilegeStatus(id, status);
      if (response.success) {
        setPrivileges(privileges.map(priv => 
          priv.id === id ? { ...priv, status } : priv
        ));
      } else {
        setError(response.error || 'Failed to update privilege status');
      }
    } catch (err) {
      setError('Failed to update privilege status');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Privileges Management</h1>
        
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search privileges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={fetchPrivileges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading privileges...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {privileges.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No privileges found
                    </td>
                  </tr>
                ) : (
                  privileges.map(privilege => (
                    <tr key={privilege.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{privilege.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{privilege.description}</td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={privilege.status || 'active'}
                          onChange={(e) => handleStatusChange(privilege.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeletePrivilege(privilege.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Privileges;
