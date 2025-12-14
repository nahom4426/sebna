import { useState, useCallback } from 'react';

export function useTablePagination(responseLimit = 25) {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(responseLimit);
  const [done, setDone] = useState(false);

  const reset = useCallback((newLimit = responseLimit) => {
    setPage(0);
    setDone(false);
  }, [responseLimit]);

  const next = useCallback(() => {
    if (page < totalPages - 1) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPages]);

  const prev = useCallback(() => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const setPageNumber = useCallback((num) => {
    setPage(num);
  }, []);

  return {
    page,
    limit,
    done,
    totalPages,
    setTotalPages,
    setDone,
    reset,
    next,
    prev,
    setPage: setPageNumber,
  };
}
