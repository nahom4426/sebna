import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';

const Logs = () => {
  const auth = useAuthStore((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const userPrivileges = auth?.user?.privileges || [];
  const canRead = userPrivileges.includes(ROLES.READ_LOGS);

  useEffect(() => {
    const mockLogs = [
      {
        id: 1,
        action: 'User Login',
        user: 'admin@example.com',
        timestamp: new Date(Date.now() - 3600000).toLocaleString(),
        type: 'login',
        status: 'success',
      },
      {
        id: 2,
        action: 'Post Created',
        user: 'user@example.com',
        timestamp: new Date(Date.now() - 7200000).toLocaleString(),
        type: 'create',
        status: 'success',
      },
      {
        id: 3,
        action: 'User Deleted',
        user: 'admin@example.com',
        timestamp: new Date(Date.now() - 10800000).toLocaleString(),
        type: 'delete',
        status: 'success',
      },
      {
        id: 4,
        action: 'Role Updated',
        user: 'admin@example.com',
        timestamp: new Date(Date.now() - 14400000).toLocaleString(),
        type: 'update',
        status: 'success',
      },
      {
        id: 5,
        action: 'Failed Login Attempt',
        user: 'unknown@example.com',
        timestamp: new Date(Date.now() - 18000000).toLocaleString(),
        type: 'login',
        status: 'failed',
      },
    ];
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Logs</h1>
          <p className="text-gray-600">Monitor system activities and user actions</p>
        </div>

        {/* Filter Section */}
        {canRead && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Logs</h2>
            <div className="flex gap-3 flex-wrap">
              {['all', 'login', 'create', 'update', 'delete'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Logs Table */}
        {canRead ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No logs found
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
                        <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">You don't have permission to view logs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
