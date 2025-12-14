import React, { useState, useCallback } from 'react';
import { getAllRole, removeRoleById, changeRoleStatus } from '@/pages/admin/api/AdminApi';
import Table from '../../components/Table';
import Pagination from '../../composables/Pagination';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRoles = useCallback(async (pageNum = 1, pageSize = 25, search = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllRole({ search, page: pageNum , size: pageSize });
      if (response.success) {
        const data = response.data;
        setRoles(data?.content || []);
        setTotalElements(data?.totalElements || 0);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch roles');
      }
    } catch (err) {
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRoles(1, 25, '');
  }, [fetchRoles]);

  const handleSearch = () => {
    fetchRoles(1, perPage, searchTerm);
  };

  const handleDeleteRole = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await removeRoleById(id);
        if (response.success) {
          setRoles(roles.filter(role => role.id !== id));
        } else {
          setError(response.error || 'Failed to delete role');
        }
      } catch (err) {
        setError('Failed to delete role');
      }
    }
  }, [roles]);

  const handleStatusChange = useCallback(async (id, status) => {
    try {
      const response = await changeRoleStatus(id, status);
      if (response.success) {
        setRoles(roles.map(role => 
          role.id === id ? { ...role, status } : role
        ));
      } else {
        setError(response.error || 'Failed to update role status');
      }
    } catch (err) {
      setError('Failed to update role status');
    }
  }, [roles]);

  const handlePageChange = useCallback((newPage) => {
    fetchRoles(newPage, perPage, searchTerm);
  }, [fetchRoles, perPage, searchTerm]);

  const handlePerPageChange = useCallback((newPerPage, newPage = 1) => {
    fetchRoles(newPage, newPerPage, searchTerm);
  }, [fetchRoles, searchTerm]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Roles Management</h1>
        
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
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

        <Table
          headers={['Name', 'Description', 'Status', 'Actions']}
          rows={roles}
          loading={loading}
          placeholder="No roles found"
          page={page}
          perPage={perPage}
          renderRow={(role, index) => (
            <tr key={role.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
                {(page - 1) * perPage + index + 1}
              </td>
              <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs font-medium text-gray-800 border-r border-gray-100">
                {role.name}
              </td>
              <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
                {role.description}
              </td>
              <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs border-r border-gray-100">
                <select
                  value={role.status || 'active'}
                  onChange={(e) => handleStatusChange(role.id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          )}
        />

        {!loading && roles.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            perPage={perPage}
            rowsCount={roles.length}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            onNext={() => handlePageChange(page + 1)}
            onPrevious={() => handlePageChange(page - 1)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Roles;
