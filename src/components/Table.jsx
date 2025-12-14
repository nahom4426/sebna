import React, { useMemo } from 'react';
import DataTable from './DataTable';

const Table = ({
  headers = [],
  rows = [],
  loading = false,
  error = '',
  sortable = false,
  sortBy = '',
  sortDirection = 'asc',
  sortableColumns = [],
  firstCol = false,
  lastCol = false,
  placeholder = 'No Data Found',
  onSort,
  onRowClick,
  onAction,
  actions = [],
  renderRow,
  page = 1,
  perPage = 25,
  SkeletonRow = null,
}) => {
  const spec = useMemo(() => {
    let head = [];
    let row = [];

    if (Array.isArray(headers)) {
      head = headers;
      row = headers.map((h) => h.toLowerCase()).filter((h) => h !== 'modify');
    } else {
      head = headers?.head || [];
      row = headers?.row || [];
    }

    return { head, row };
  }, [headers]);

  const hasData = rows && rows.length > 0;
  const showEmptyState = !loading && !hasData;

  const rowKeys = useMemo(() => {
    return ['source', ...spec.row];
  }, [spec.row]);

  return (
    <div className="relative space-y-2 w-full min-w-0 bg-white md:space-y-3" style={{ overflow: 'visible', zIndex: 1 }}>
      {/* Desktop Table View */}
      <div className="hidden relative w-full min-w-0 lg:block z-1" style={{ overflow: 'visible' }}>
        <DataTable
          headers={spec.head}
          sortable={sortable}
          sortBy={sortBy}
          sortDirection={sortDirection}
          sortableColumns={sortableColumns}
          rowKeys={rowKeys}
          firstCol={firstCol}
          lastCol={lastCol}
          onSort={onSort}
        >
          {hasData ? (
            rows.map((row, index) =>
              renderRow ? (
                renderRow(row, index, page, perPage)
              ) : (
                <tr key={row.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                  {firstCol && (
                    <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
                      {/* First column cell */}
                    </td>
                  )}
                  <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  {spec.row.map((key) => (
                    <td
                      key={key}
                      className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100"
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {row[key] || '-'}
                    </td>
                  ))}
                  {lastCol && (
                    <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
                      {actions && actions.length > 0 && (
                        <div className="flex gap-2">
                          {actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => onAction && onAction(action.id, row)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${action.className || 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            )
          ) : showEmptyState ? (
            <tr>
              <td colSpan={spec.head.length + 2} className="px-6 py-8 text-center text-gray-500">
                <div className="flex flex-col gap-2 items-center">
                  <div className="flex flex-1 justify-center py-5 w-full h-full">
                    <img src="/noData.gif" alt="No Data" className="h-56" onError={(e) => (e.target.style.display = 'none')} />
                  </div>
                  <p className="text-xl text-gray-600">{placeholder}</p>
                </div>
              </td>
            </tr>
          ) : null}

          {loading && (
            <>
              {[...Array(5)].map((_, i) =>
                SkeletonRow ? (
                  <SkeletonRow key={`skeleton-${i}`} />
                ) : (
                  <tr key={`skeleton-${i}`} className="border-b border-gray-200 animate-pulse">
                    <td colSpan={spec.head.length + 2} className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </>
          )}
        </DataTable>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden mobile-view-container">
        {hasData ? (
          <div className="space-y-3 mobile-cards-container">
            {rows.map((row, index) => (
              <div
                key={row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md mobile-card"
              >
                <div className="space-y-3">
                  {spec.row.slice(0, 4).map((key, keyIndex) => (
                    <div key={keyIndex} className="flex justify-between items-start">
                      <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        {spec.head[keyIndex + 1] || key}
                      </span>
                      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
                        <span className="block truncate">{row[key] || '-'}</span>
                      </span>
                    </div>
                  ))}

                  {actions && actions.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 flex gap-2">
                      {actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction && onAction(action.id, row);
                          }}
                          className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${action.className || 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : showEmptyState ? (
          <div className="flex flex-col gap-2 items-center py-8">
            <div className="flex flex-1 justify-center py-5 w-full h-full">
              <img src="/noData.gif" alt="No Data" className="h-56" onError={(e) => (e.target.style.display = 'none')} />
            </div>
            <p className="text-xl text-gray-600">{placeholder}</p>
          </div>
        ) : null}

        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={`mobile-skeleton-${i}`} className="p-4 bg-white rounded-xl border border-gray-100 animate-pulse mobile-card">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
