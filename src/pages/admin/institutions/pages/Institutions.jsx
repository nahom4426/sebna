import React, { useState, useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import Table from '../../../../components/Table';
import TableSkeletonRow from '../../../../components/TableSkeletonRow';
import Pagination from '../../../../composables/Pagination';
import InstitutionsDataProvider from '../component/InstitutionsDataProvider';
import InstitutionForm from '../component/InstitutionForm';
import { removeInstitutionById } from '../api/InstitutionsApi';
import pako from 'pako';

const Institutions = () => {
  const { openModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Helper function to decompress and convert logo to proper data URL
  const decompressLogo = (compressedBase64) => {
    try {
      // Decode base64 to binary string
      const binaryString = atob(compressedBase64);
      
      // Convert binary string to Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decompress using pako
      const decompressed = pako.inflate(bytes);
      
      // Convert decompressed data back to base64
      const binaryDecompressed = String.fromCharCode.apply(null, decompressed);
      const decompressedBase64 = btoa(binaryDecompressed);
      
      return `data:image/png;base64,${decompressedBase64}`;
    } catch (error) {
      console.error('Error decompressing logo:', error);
      return null;
    }
  };

  const headers = {
    head: ['Name', 'Logo', 'Website', 'Description', 'Actions'],
    row: ['name', 'logo', 'website', 'description'],
  };

  const handleAddInstitution = () => {
    openModal(
      <InstitutionForm
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    );
  };

  const handleEditInstitution = (institution) => {
    openModal(
      <InstitutionForm
        institution={institution}
        onSuccess={() => {
          setRefreshKey((prev) => prev + 1);
        }}
      />
    );
  };

  const handleDeleteInstitution = async (institution) => {
    if (window.confirm('Are you sure you want to delete this institution?')) {
      try {
        const institutionId = institution.institutionId || institution.id;
        await removeInstitutionById(institutionId);
        setRefreshKey((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to delete institution:', err);
        alert('Failed to delete institution');
      }
    }
  };

  const renderRow = (row, index, page, perPage) => {
    const logoSrc = row.logo ? decompressLogo(row.logo) : null;
    
    return (
    <tr key={row.institutionId || index} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
        {(page - 1) * perPage + index + 1}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.name || '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {logoSrc ? (
          <div className="flex items-center justify-center">
            <img
              src={logoSrc}
              alt={row.name}
              className="h-10 w-10 object-contain rounded border border-gray-200"
              title={row.name}
            />
          </div>
        ) : (
          '-'
        )}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline truncate max-w-[100px] inline-block"
            title={row.website}
          >
            {row.website.substring(0, 20)}...
          </a>
        ) : (
          '-'
        )}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
        {row.description ? row.description.substring(0, 40) + '...' : '-'}
      </td>
      <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
        <div className="flex gap-2">
          <button
            onClick={() => handleEditInstitution(row)}
            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteInstitution(row)}
            className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
    );
  };

  const SkeletonRowComponent = () => (
    <TableSkeletonRow columns={2} withActions withIndex actionCount={2} />
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Institutions Management</h1>
          <button
            onClick={handleAddInstitution}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Institution
          </button>
        </div>

        <InstitutionsDataProvider search={searchTerm} key={refreshKey}>
          {({
            institutions,
            pending,
            error,
            page,
            perPage,
            totalElements,
            totalPages,
            onPageChange,
            onPerPageChange,
            onNext,
            onPrevious,
          }) => (
            <>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search institutions..."
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
                rows={institutions}
                loading={pending}
                renderRow={renderRow}
                page={page}
                perPage={perPage}
                placeholder="No institutions found"
                SkeletonRow={SkeletonRowComponent}
                lastCol
              />

              {!pending && institutions.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    perPage={perPage}
                    rowsCount={institutions.length}
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
        </InstitutionsDataProvider>
      </div>
    </div>
  );
};

export default Institutions;
