import React, { useState } from 'react';

const DataTable = ({
  headers = [],
  sortable = false,
  sortBy = '',
  sortDirection = 'asc',
  sortableColumns = [],
  rowKeys = [],
  firstCol = false,
  lastCol = false,
  onSort,
  children,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const getSortOptions = (header) => {
    const options = {
      'Invoice ID': [
        { label: 'Invoice ID', key: 'invoiceNumber' },
        { label: 'Reference Number', key: 'referenceNumber' },
      ],
      'Encounter Date': [
        { label: 'Encounter Date', key: 'dispensingDate' },
        { label: 'Branch', key: 'branchName' },
      ],
    };
    return options[header] || null;
  };

  const isSortable = (header, index) => {
    if (!sortable) return false;
    const columnKey = rowKeys[index + 1];
    return sortableColumns.includes(columnKey);
  };

  const getSortIcon = (header, index) => {
    if (!isSortable(header, index)) return null;

    const columnKey = rowKeys[index + 1];
    if (sortBy !== columnKey) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
          <path d="M6 2L8 5H4L6 2Z" fill="#9CA3AF" opacity="0.5" />
          <path d="M6 10L4 7H8L6 10Z" fill="#9CA3AF" opacity="0.5" />
        </svg>
      );
    }

    if (sortDirection === 'asc') {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
          <path d="M6 2L8 5H4L6 2Z" fill="#3B82F6" />
        </svg>
      );
    } else {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
          <path d="M6 10L4 7H8L6 10Z" fill="#F97316" />
        </svg>
      );
    }
  };

  const handleSort = (columnKey) => {
    if (onSort) {
      onSort(columnKey);
    }
    setOpenDropdown(null);
  };

  const toggleDropdown = (header) => {
    setOpenDropdown(openDropdown === header ? null : header);
  };

  return (
    <table
      className="w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-md backdrop-blur-sm"
      style={{ overflow: 'visible', transition: 'all 0.3s ease', tableLayout: 'auto', minWidth: '100%' }}
    >
      <thead className="backdrop-blur-sm bg-white/70">
        <tr className="border-b border-gray-200">
          {firstCol && (
            <th className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide text-left text-gray-700 uppercase">
              {/* First column header slot */}
            </th>
          )}

          <th className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide text-left text-gray-700 uppercase border-r border-gray-100 last:border-r-0">
            #
          </th>

          {headers.map((header, index) => (
            <th
              key={header}
              className={`px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs font-bold text-left uppercase border-r border-gray-100 transition-all duration-200 last:border-r-0 whitespace-nowrap relative ${
                isSortable(header, index)
                  ? 'cursor-pointer select-none group text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-sm transition-colors duration-150'
                  : 'text-gray-500'
              } ${
                isSortable(header, index) && sortBy === rowKeys[index + 1]
                  ? 'bg-blue-50 text-blue-700 shadow-inner'
                  : ''
              }`}
              style={{ minWidth: header === 'Actions' ? '100px' : 'auto' }}
              onClick={() =>
                isSortable(header, index) && !getSortOptions(header)
                  ? handleSort(rowKeys[index + 1])
                  : null
              }
            >
              <div className="flex gap-1 justify-between items-center">
                <span className="font-bold text-slate-700">{header}</span>
                {isSortable(header, index) && (
                  <div
                    className="flex flex-shrink-0 justify-center items-center ml-1 w-3 h-3 transition-transform duration-150 transform cursor-pointer group-hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      getSortOptions(header)
                        ? toggleDropdown(header)
                        : handleSort(rowKeys[index + 1]);
                    }}
                  >
                    {getSortIcon(header, index)}
                  </div>
                )}
              </div>

              {getSortOptions(header) && openDropdown === header && (
                <div className="absolute left-0 top-full z-50 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg">
                  {getSortOptions(header).map((option) => (
                    <button
                      key={option.key}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSort(option.key);
                      }}
                      className={`block px-3 py-2 w-full text-xs text-left transition-colors hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg ${
                        sortBy === option.key
                          ? 'bg-blue-100 text-blue-700 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {isSortable(header, index) && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              )}
            </th>
          ))}

          {lastCol && (
            <th className="px-2 py-2 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase sm:px-3">
              {/* Last column header slot */}
            </th>
          )}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default DataTable;
