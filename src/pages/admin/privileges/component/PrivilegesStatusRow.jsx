import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivilegesStatusRow = ({
  rowData = [],
  rowKeys = ['privilegeName', 'privilegeDescription', 'privilegeCategory', 'privilegeType'],
  headKeys = ['#', 'Privilege Name', 'Description', 'Category', 'Type', 'Actions'],
  page = 1,
  perPage = 25,
  onRowClick = () => {},
}) => {
  const navigate = useNavigate();
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

  const getRowNumber = (index) => {
    const displayPage = Math.max(1, page);
    return (displayPage - 1) * perPage + index + 1;
  };

  const handleEdit = (row) => {
    navigate(`/edit_privilege/${row.privilegeUuid || row.id}`);
  };

  const getTypeBadgeClass = (type) => {
    const map = {
      FOR_ALL: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-300',
      FOR_SYSTEM_ADMIN: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-purple-300',
      FOR_PAYER: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-blue-300',
      FOR_PROVIDER: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-orange-300',
    };
    return map[type] || 'bg-gradient-to-r from-slate-400 to-slate-600 text-white border-slate-300';
  };

  const getTypeLabel = (type) => {
    const map = {
      FOR_ALL: 'All',
      FOR_SYSTEM_ADMIN: 'Admin',
      FOR_PAYER: 'Payer',
      FOR_PROVIDER: 'Provider',
    };
    return map[type] || type;
  };

  const getCategoryBadgeClass = (category) => {
    const map = {
      'credit invoice': 'bg-orange-50 text-orange-700 border-orange-200',
      claim: 'bg-blue-50 text-blue-700 border-blue-200',
      system: 'bg-purple-50 text-purple-700 border-purple-200',
      kenema: 'bg-teal-50 text-teal-700 border-teal-200',
      services: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return map[(category || '').toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const renderCellValue = (row, key) => {
    if (key === 'privilegeType') {
      return (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getTypeBadgeClass(row[key])}`}
        >
          {getTypeLabel(row[key])}
        </span>
      );
    }

    if (key === 'privilegeCategory') {
      return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(row[key])}`}>
          {row[key]}
        </span>
      );
    }

    return <span className="text-gray-800">{row[key] || '—'}</span>;
  };

  return (
    <>
      {/* Desktop Table Rows */}
      {rowData.map((row, idx) => (
        <tr
          key={row?.privilegeUuid || idx}
          onClick={(e) => e.target.closest('button') || onRowClick(row)}
          className="hidden bg-white border-b transition-colors duration-150 ease-in-out lg:table-row hover:bg-gray-50"
        >
          <td className="p-4 font-medium text-gray-500">{getRowNumber(idx)}</td>

          {rowKeys.map((key) => (
            <td key={key} className="p-3 py-4 align-top">
              {renderCellValue(row, key)}
            </td>
          ))}

          <td className="p-3">
            <div className="hidden flex-wrap gap-2 justify-start items-center lg:flex">
              <button
                className="flex justify-center items-center w-9 h-9 text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md transition-all duration-200 hover:opacity-90"
                onClick={() => handleEdit(row)}
                title="Edit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
            </div>

            <div className="flex justify-end lg:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === row.privilegeUuid ? null : row.privilegeUuid);
                }}
                className="flex justify-center items-center w-9 h-9 bg-white rounded-full border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50"
                title="Actions"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      ))}

      {/* Mobile Card View */}
      {rowData.map((row, idx) => (
        <div
          key={`mobile-${row?.privilegeUuid || idx}`}
          onClick={() => onRowClick(row)}
          className="block relative p-4 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200 lg:hidden hover:shadow-md"
        >
          <div className="space-y-3">
            {rowKeys.map((key, keyIndex) => (
              <div key={keyIndex} className="flex gap-3 justify-between items-start">
                <span className="flex-shrink-0 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  {headKeys[keyIndex + 1] || key}
                </span>
                <span className="flex-1 min-w-0 text-sm font-medium text-right text-gray-900">
                  {renderCellValue(row, key)}
                </span>
              </div>
            ))}

            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === row.privilegeUuid ? null : row.privilegeUuid);
                  }}
                  className="flex justify-center items-center w-9 h-9 bg-white rounded-full border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50"
                  title="Actions"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {openDropdown === row.privilegeUuid && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(row);
                        setOpenDropdown(null);
                      }}
                      className="flex gap-3 items-center px-4 py-3 w-full text-sm text-blue-600 hover:bg-gray-50 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                      <span>Edit Privilege</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PrivilegesStatusRow;
