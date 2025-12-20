import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../components/Table';
import TableSkeletonRow from '../../../../components/TableSkeletonRow';
import Pagination from '../../../../composables/Pagination';
import PrivilegesDataProvider from '../component/PrivilegesDataProvider';

const Privileges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const headers = {
    head: ['Names', 'Description', 'Actions'],
    row: ['privilegeName', 'privilegeDescription']
  };

  const renderRow = (row, index, page, perPage) => (
    <tr key={row.id || index} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
        {(page - 1) * perPage + index + 1}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.privilegeName || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.privilegeDescription || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/admin/privileges/edit/${row.privilegeUuid}`)}
            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  const SkeletonRowComponent = () => (
    <TableSkeletonRow columns={2} withActions withIndex actionCount={2} />
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Privileges Management</h1>
          <button
            onClick={() => navigate('/admin/privileges/create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Privilege
          </button>
        </div>

        <PrivilegesDataProvider search={searchTerm}>
          {({ privileges, pending, error, page, perPage, totalElements, totalPages, onPageChange, onPerPageChange, onNext, onPrevious, refresh }) => (
            <>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search privileges..."
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
                rows={privileges}
                loading={pending}
                renderRow={renderRow}
                page={page}
                perPage={perPage}
                placeholder="No privileges found"
                SkeletonRow={SkeletonRowComponent}
                lastCol
              />

              {!pending && privileges.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    perPage={perPage}
                    rowsCount={privileges.length}
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
        </PrivilegesDataProvider>
      </div>
    </div>
  );
};

export default Privileges;
