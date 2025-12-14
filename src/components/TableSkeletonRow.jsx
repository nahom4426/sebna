import React from 'react';

const TableSkeletonRow = ({ 
  columns = 5, 
  withActions = false, 
  withIndex = true,
  actionCount = 2 
}) => {
  const columnWidths = [
    'w-16',   // Index column
    'w-32',   // First Name
    'w-48',   // Email
    'w-32',   // Role
    'w-24',   // Status
    'w-32'    // Actions
  ];

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {/* Index Column */}
      {withIndex && (
        <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse w-6"></div>
        </td>
      )}
      
      {/* Data Columns */}
      {Array(columns).fill(0).map((_, i) => (
        <td 
          key={`col-${i}`} 
          className={`px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs border-r border-gray-100`}
        >
          <div 
            className={`h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse ${columnWidths[Math.min(i, columnWidths.length - 1)] || 'w-24'}`}
          ></div>
        </td>
      ))}
      
      {/* Actions Column */}
      {withActions && (
        <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
          <div className="flex gap-2">
            {Array(actionCount).fill(0).map((_, i) => (
              <div 
                key={`action-${i}`} 
                className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded animate-pulse w-12"
              ></div>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
};

export default TableSkeletonRow;
