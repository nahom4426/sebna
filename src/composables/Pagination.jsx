import React from 'react';

const Pagination = ({
  page = 1,
  totalPages = 1,
  totalElements = 0,
  perPage = 25,
  onPageChange,
  onPerPageChange,
  onNext,
  onPrevious,
  loading = false,
  rowsCount = 0,
}) => {
  const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handlePerPageChange = (newPerPage) => {
    if (onPerPageChange) {
      onPerPageChange(parseInt(newPerPage), 1);
    }
  };

  return (
    <div className="flex flex-col flex-wrap gap-4 justify-between items-center p-4 sm:flex-row">
      <div className="flex gap-3 items-center text-sm sm:gap-5 sm:text-base">
        <span className="text-gray-600">Show</span>
        <select
          onChange={(e) => handlePerPageChange(e.target.value)}
          value={perPage}
          className="px-2 py-1.5 text-sm bg-gray-100 rounded-md border border-gray-300 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>
        <span className="text-gray-600">entries</span>
      </div>

      <div className="text-sm text-center text-gray-600 sm:text-base sm:text-left">
        Showing {rowsCount || 0} of {totalElements || 0} records
      </div>

      <div className="flex flex-wrap gap-1 justify-center items-center sm:gap-2">
        <button
          onClick={onPrevious}
          disabled={page === 1 || loading}
          className="pagination-button min-w-[2.5rem] h-[2.5rem] px-2 border border-gray-300 rounded bg-white text-gray-600 font-medium cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          ‹
        </button>

        {totalPages <= 7 ? (
          range(1, totalPages).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-[2.5rem] h-[2.5rem] px-2 border rounded font-medium cursor-pointer transition-all flex items-center justify-center ${
                page === pageNum
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ))
        ) : (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`min-w-[2.5rem] h-[2.5rem] px-2 border rounded font-medium cursor-pointer transition-all flex items-center justify-center ${
                page === 1
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              1
            </button>

            {page < 4 ? (
              <>
                {range(2, 4).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[2.5rem] h-[2.5rem] px-2 border rounded font-medium cursor-pointer transition-all flex items-center justify-center ${
                      page === pageNum
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <span className="px-2">...</span>
              </>
            ) : page > totalPages - 3 ? (
              <>
                <span className="px-2">...</span>
                {range(totalPages - 3, totalPages - 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[2.5rem] h-[2.5rem] px-2 border rounded font-medium cursor-pointer transition-all flex items-center justify-center ${
                      page === pageNum
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </>
            ) : (
              <>
                <span className="px-2">...</span>
                {[page - 1, page, page + 1].map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-[2.5rem] h-[2.5rem] px-2 border rounded font-medium cursor-pointer transition-all flex items-center justify-center ${
                      page === pageNum
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <span className="px-2">...</span>
              </>
            )}

            <button
              onClick={() => handlePageChange(totalPages)}
              className={`min-w-[2.5rem] h-[2.5rem] px-2 border rounded font-medium cursor-pointer transition-all flex items-center justify-center ${
                page === totalPages
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={onNext}
          disabled={page === totalPages || loading}
          className="pagination-button min-w-[2.5rem] h-[2.5rem] px-2 border border-gray-300 rounded bg-white text-gray-600 font-medium cursor-pointer transition-all hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Pagination;
