import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RolesStatusRow = ({
  rowData = [],
  rowKeys = ['roleName', 'roleDescription', 'privilegeList'],
  headKeys = ['#', 'Role Name', 'Role Description', 'Privileges', 'Actions'],
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

  const privilegeBadgeClass = () => {
    return 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow border border-violet-400';
  };

  const handleEdit = (row) => {
    navigate(`/edit_role/${row.roleUuid || row.id}`);
  };

  const renderCellValue = (row, key) => {
    if (key === 'privilegeList') {
      return (
        <div className="inline-block relative group">
          <span
            className={privilegeBadgeClass()}
            title={`Total privileges: ${row.privilegeList?.length || 0}`}
          >
            {row.privilegeList?.length || 0}
          </span>
          <div className="absolute z-20 hidden group-hover:block w-72 max-w-[20rem] bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-left mt-2">
            <div className="mb-2 text-xs font-semibold text-gray-700">
              Privileges ({row.privilegeList?.length || 0})
            </div>
            <ul className="overflow-auto max-h-56 divide-y divide-gray-100">
              {(row.privilegeList || []).map((p, i) => (
                <li key={p.privilegeUuid || i} className="py-1.5">
                  <div className="text-xs text-gray-900 truncate" title={p.privilegeName}>
                    {p.privilegeName}
                  </div>
                  <div className="text-[11px] text-gray-500 truncate" title={p.privilegeDescription}>
                    {p.privilegeDescription}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return <span className="text-gray-800">{row[key] || '—'}</span>;
  };

  return (
    <>
      {rowData.map((row, idx) => (
        <tr
          key={row?.roleUuid || idx}
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
            <div className="flex flex-wrap gap-2 justify-start items-center">
              <button
                className="flex justify-center items-center w-9 h-9 text-white bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full shadow-md hover:opacity-90 transition-opacity"
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
          </td>
        </tr>
      ))}

      {/* Mobile Card View */}
      {rowData.map((row, idx) => (
        <div
          key={`mobile-${row?.roleUuid || idx}`}
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
                    setOpenDropdown(openDropdown === row.roleUuid ? null : row.roleUuid);
                  }}
                  className="flex justify-center items-center w-10 h-10 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors duration-200 hover:bg-gray-50"
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

                {openDropdown === row.roleUuid && (
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
                      <span>Edit Role</span>
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

export default RolesStatusRow;
