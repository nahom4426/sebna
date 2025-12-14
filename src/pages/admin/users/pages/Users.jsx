import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import Table from '../../../../components/Table';
import TableSkeletonRow from '../../../../components/TableSkeletonRow';
import Pagination from '../../../../composables/Pagination';
import UsersDataProvider from '../component/UsersDataProvider';
import UserForm from '../component/UserForm';
import { removeUserById } from '../api/UsersApi';

const Users = () => {
  const { openModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const headers = {
    head: [ 'First Name', 'Email', 'Role', 'Status', 'Actions'],
    row: ['firstName', 'email', 'roleName', 'status']
  };

  const handleAddUser = () => {
    openModal(
      <UserForm
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    );
  };

  const handleEditUser = (user) => {
    openModal(
      <UserForm
        user={user}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    );
  };

  const handleDeleteUser = async (userUuid) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await removeUserById(userUuid);
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const renderRow = (row, index, page, perPage) => (
    <tr key={row.userUuid || index} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
        {(page - 1) * perPage + index + 1}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.firstName || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.email || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.roleName || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          {row.status || 'Active'}
        </span>
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
        <div className="flex gap-2">
          <button
            onClick={() => handleEditUser(row)}
            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(row.userUuid)}
            className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  const SkeletonRowComponent = () => (
    <TableSkeletonRow columns={4} withActions withIndex actionCount={2} />
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add User
          </button>
        </div>

        <UsersDataProvider search={searchTerm} key={refreshKey}>
          {({ users, pending, error, page, perPage, totalElements, totalPages, onPageChange, onPerPageChange, onNext, onPrevious, refresh }) => (
            <>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {error && (
                <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <Table
                headers={headers}
                rows={users}
                loading={pending}
                renderRow={renderRow}
                page={page}
                perPage={perPage}
                placeholder="No users found"
                SkeletonRow={SkeletonRowComponent}
                lastCol
              />

              {!pending && users.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    perPage={perPage}
                    rowsCount={users.length}
                    onPageChange={onPageChange}
                    onPerPageChange={onPerPageChange}
                    onNext={onNext}
                    onPrevious={onPrevious}
                    loading={pending}
                  />
                </div>
              )}
            </>
          )}
        </UsersDataProvider>
      </div>
    </div>
  );
};

export default Users;
