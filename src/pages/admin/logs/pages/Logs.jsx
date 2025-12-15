import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';

const Logs = () => {
  const auth = useAuthStore((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userPrivileges = auth?.user?.privileges || [];
  const canRead = userPrivileges.includes(ROLES.READ_LOGS);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/logs');
        // const data = await response.json();
        
        // Mock data
        const mockLogs = [
          {
            id: 1,
            action: 'User Login',
            user: 'admin@example.com',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            type: 'login',
            status: 'success',
          },
          {
            id: 2,
            action: 'Post Created',
            user: 'user@example.com',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            type: 'create',
            status: 'success',
          },
          {
            id: 3,
            action: 'User Deleted',
            user: 'admin@example.com',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            type: 'delete',
            status: 'success',
          },
          {
            id: 4,
            action: 'Role Updated',
            user: 'admin@example.com',
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            type: 'update',
            status: 'success',
          },
          {
            id: 5,
            action: 'Failed Login Attempt',
            user: 'unknown@example.com',
            timestamp: new Date(Date.now() - 18000000).toISOString(),
            type: 'login',
            status: 'failed',
          },
        ];
        
        setLogs(mockLogs);
        setFilteredLogs(mockLogs);
      } catch (err) {
        setError('Failed to load logs');
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (canRead) {
      fetchLogs();
    }
  }, [canRead]);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter((log) => log.type === filterType));
    }
  }, [filterType, logs]);

  const getTypeColor = (type) => {
    const colors = {
      login: 'bg-blue-100 text-blue-800',
      create: 'bg-green-100 text-green-800',
      update: 'bg-yellow-100 text-yellow-800',
      delete: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'success'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const filterTypes = [
    { key: 'all', label: 'All' },
    { key: 'login', label: 'Login' },
    { key: 'create', label: 'Create' },
    { key: 'update', label: 'Update' },
    { key: 'delete', label: 'Delete' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Logs</h1>
          <p className="text-gray-600">Monitor system activities and user actions</p>
        </div>

        {/* Filter Section */}
        {canRead && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Logs</h2>
            <div className="flex gap-3 flex-wrap" role="group" aria-label="Filter log types">
              {filterTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setFilterType(type.key)}
                  aria-pressed={filterType === type.key}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === type.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && canRead && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading logs...</p>
          </div>
        )}

        {/* Error State */}
        {error && canRead && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Logs Table */}
        {!loading && !error && canRead ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No logs found for the selected filter
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{log.action}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.user}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(log.type)}`}>
                            {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                            {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatTimestamp(log.timestamp)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : !loading && !error && !canRead ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">You don't have permission to view logs</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Logs;