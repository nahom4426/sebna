import React, { useState, useEffect } from 'react';
import { changeUserStatus } from '@/pages/admin/api/AdminApi';

const StatusRow = ({
  rowData = [],
  rowKeys = [],
  headKeys = [],
  page = 1,
  perPage = 25,
  onEdit,
  onView,
  onActivate,
  onDeactivate,
  onRefresh,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatFullName = (row) => {
    const title = capitalizeFirstLetter(row?.title || '');
    const firstName = capitalizeFirstLetter(row?.firstName || '');
    const fatherName = capitalizeFirstLetter(row?.fatherName || '');
    const grandFatherName = capitalizeFirstLetter(row?.grandFatherName || '');

    return `${title} ${firstName} ${fatherName} ${grandFatherName}`.trim();
  };

  const getStatusStyle = (status) => {
    const base = 'inline-flex justify-center items-center min-w-[80px] px-3 py-1 rounded text-sm font-semibold';

    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'ACTIVE':
        return `${base} bg-green-100 text-green-800`;
      case 'SUBMITTED':
      case 'PENDING':
      case 'SUSPENDED':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'INACTIVE':
        return `${base} bg-red-100 text-red-800`;
      case 'ACCEPTED':
        return `${base} bg-blue-100 text-blue-800`;
      case 'REJECTED':
        return `${base} bg-red-100 text-red-800`;
      case 'RESUBMITTED':
        return `${base} bg-purple-100 text-purple-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const getGenderStyle = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800';
      case 'female':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserType = (row) => {
    const hasPayer = !!row.payerUuid;
    const hasProvider = !!row.providerUuid;

    if (hasPayer && !hasProvider) return 'Payer';
    if (!hasPayer && hasProvider) return 'Provider';
    if (!hasPayer && !hasProvider) return 'Admin';
    if (hasPayer && hasProvider) return 'Payer and Provider';
  };

  const getTypeStyle = (statusOrType) => {
    switch (statusOrType) {
      case 'Payer':
        return 'bg-blue-100 text-blue-800';
      case 'Provider':
        return 'bg-green-100 text-green-800';
      case 'Admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'Payer and Provider':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowNumber = (index) => {
    const displayPage = Math.max(1, page);
    return (displayPage - 1) * perPage + index + 1;
  };

  const handleEdit = (row) => {
    setOpenDropdown(null);
    if (onEdit) onEdit(row);
  };

  const handleView = (row) => {
    setOpenDropdown(null);
    if (onView) onView(row.id || row.userUuid);
  };

  const handleActivate = async (row) => {
    setOpenDropdown(null);
    try {
      const response = await changeUserStatus(row.id || row.userUuid, 'active');
      if (response.success) {
        if (onActivate) onActivate(row);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleDeactivate = async (row) => {
    setOpenDropdown(null);
    try {
      const response = await changeUserStatus(row.id || row.userUuid, 'inactive');
      if (response.success) {
        if (onDeactivate) onDeactivate(row);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const renderCellValue = (row, key) => {
    if (key === 'firstName' || key === 'fullname') {
      return formatFullName(row);
    }

    if (key === 'email') {
      return row?.email;
    }

    if (key === 'mobilePhone') {
      return row.mobilePhone;
    }

    if (key === 'roleName') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
          {capitalizeFirstLetter(row.roleName)}
        </span>
      );
    }

    if (key === 'gender') {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md ${getGenderStyle(row.gender)}`}>
          {capitalizeFirstLetter(row.gender)}
        </span>
      );
    }

    if (key === 'status') {
      return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(row.status)}`}>
          {row.status || row.userStatus}
        </span>
      );
    }

    if (key === 'userType') {
      return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center ${getTypeStyle(getUserType(row))}`}>
          {getUserType(row)}
        </span>
      );
    }

    return typeof row[key] === 'string' ? capitalizeFirstLetter(row[key]) : row[key];
  };

  return (
    <>
      {/* Desktop Table Rows - Only render <tr> elements */}
      {rowData.map((row, idx) => (
        <tr key={`desktop-${row.id || idx}`} className="hidden bg-white border-b transition-colors duration-150 ease-in-out lg:table-row hover:bg-gray-50">
          <td className="p-4 font-medium text-gray-500">{getRowNumber(idx)}</td>

          {rowKeys.map((key) => (
            <td key={key} className="p-3 py-4 text-sm text-gray-700">
              {renderCellValue(row, key)}
            </td>
          ))}

          {headKeys.includes('Actions') && (
            <td className="relative p-3">
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => handleEdit(row)}
                  className="flex gap-2 items-center px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 shadow-[0_3px_0_0_#bfbfbf] active:shadow-[0_1px_0_0_#bfbfbf] active:translate-y-[2px] transition text-gray-700 text-sm font-medium hover:bg-gray-100"
                >
                  ✎ Edit
                </button>

                {(row.status?.toLowerCase() === 'inactive' || row.userStatus?.toLowerCase() === 'inactive') && (
                  <button
                    onClick={() => handleActivate(row)}
                    className="flex gap-2 items-center px-4 py-2 rounded-lg border border-green-300 bg-green-50 text-green-700 shadow-[0_3px_0_0_#c7f0c7] active:shadow-[0_1px_0_0_#c7f0c7] active:translate-y-[2px] transition text-sm font-medium hover:bg-green-100"
                  >
                    ✓ Activate
                  </button>
                )}

                {(row.status?.toLowerCase() === 'active' || row.userStatus?.toLowerCase() === 'active') && (
                  <button
                    onClick={() => handleDeactivate(row)}
                    className="flex gap-2 items-center px-4 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 shadow-[0_3px_0_0_#f2b0b0] active:shadow-[0_1px_0_0_#f2b0b0] active:translate-y-[2px] transition text-sm font-medium hover:bg-red-100"
                  >
                    ✕ Deactivate
                  </button>
                )}
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

const StatusRowMobile = ({
  rowData = [],
  rowKeys = [],
  headKeys = [],
  page = 1,
  perPage = 25,
  onEdit,
  onView,
  onActivate,
  onDeactivate,
  onRefresh,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getStatusStyle = (status) => {
    const base = 'inline-flex justify-center items-center min-w-[80px] px-3 py-1 rounded text-sm font-semibold';

    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'ACTIVE':
        return `${base} bg-green-100 text-green-800`;
      case 'SUBMITTED':
      case 'PENDING':
      case 'SUSPENDED':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'INACTIVE':
        return `${base} bg-red-100 text-red-800`;
      case 'ACCEPTED':
        return `${base} bg-blue-100 text-blue-800`;
      case 'REJECTED':
        return `${base} bg-red-100 text-red-800`;
      case 'RESUBMITTED':
        return `${base} bg-purple-100 text-purple-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const getGenderStyle = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800';
      case 'female':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowNumber = (index) => {
    const displayPage = Math.max(1, page);
    return (displayPage - 1) * perPage + index + 1;
  };

  const handleEdit = (row) => {
    setOpenDropdown(null);
    if (onEdit) onEdit(row);
  };

  const handleView = (row) => {
    setOpenDropdown(null);
    if (onView) onView(row.id || row.userUuid);
  };

  const handleActivate = async (row) => {
    setOpenDropdown(null);
    try {
      const response = await changeUserStatus(row.id || row.userUuid, 'active');
      if (response.success) {
        if (onActivate) onActivate(row);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleDeactivate = async (row) => {
    setOpenDropdown(null);
    try {
      const response = await changeUserStatus(row.id || row.userUuid, 'inactive');
      if (response.success) {
        if (onDeactivate) onDeactivate(row);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const renderCellValue = (row, key) => {
    if (key === 'firstName' || key === 'fullname') {
      const title = capitalizeFirstLetter(row?.title || '');
      const firstName = capitalizeFirstLetter(row?.firstName || '');
      const fatherName = capitalizeFirstLetter(row?.fatherName || '');
      const grandFatherName = capitalizeFirstLetter(row?.grandFatherName || '');
      return `${title} ${firstName} ${fatherName} ${grandFatherName}`.trim();
    }

    if (key === 'email') {
      return row?.email;
    }

    if (key === 'mobilePhone') {
      return row.mobilePhone;
    }

    if (key === 'roleName') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
          {capitalizeFirstLetter(row.roleName)}
        </span>
      );
    }

    if (key === 'gender') {
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-md ${getGenderStyle(row.gender)}`}>
          {capitalizeFirstLetter(row.gender)}
        </span>
      );
    }

    if (key === 'status') {
      return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(row.status)}`}>
          {row.status || row.userStatus}
        </span>
      );
    }

    return typeof row[key] === 'string' ? capitalizeFirstLetter(row[key]) : row[key];
  };

  return (
    <>
      {rowData.map((row, idx) => (
        <div
          key={`mobile-${row.id || idx}`}
          className="block relative p-4 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
          style={{ overflow: 'visible' }}
        >
          <div className="space-y-3">
            {rowKeys.slice(0, 5).map((key, keyIndex) => (
              <div key={keyIndex} className="flex gap-3 justify-between items-start">
                <span className="flex-shrink-0 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  {headKeys[keyIndex] || key}
                </span>
                <span className="flex-1 min-w-0 text-sm font-medium text-right text-gray-900">
                  {renderCellValue(row, key)}
                </span>
              </div>
            ))}

            {headKeys.includes('Actions') && (
              <div className="pt-3 border-t border-gray-100">
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === row.id ? null : row.id)}
                    className="flex justify-center items-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50 mx-auto"
                  >
                    ⋮
                  </button>

                  {openDropdown === row.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                      <button
                        onClick={() => handleEdit(row)}
                        className="flex gap-3 items-center px-4 py-3 w-full text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => handleView(row)}
                        className="flex gap-3 items-center px-4 py-3 w-full text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        👁 Detail
                      </button>
                      {(row.status?.toLowerCase() === 'inactive' || row.userStatus?.toLowerCase() === 'inactive') && (
                        <button
                          onClick={() => handleActivate(row)}
                          className="flex gap-3 items-center px-4 py-3 w-full text-sm text-green-600 hover:bg-green-50 transition"
                        >
                          ✓ Activate
                        </button>
                      )}
                      {(row.status?.toLowerCase() === 'active' || row.userStatus?.toLowerCase() === 'active') && (
                        <button
                          onClick={() => handleDeactivate(row)}
                          className="flex gap-3 items-center px-4 py-3 w-full text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          ✕ Deactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export { StatusRowMobile };

export default StatusRow;
