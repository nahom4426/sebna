import React, { useEffect, useCallback } from 'react';
import { getAllPrivilege } from '@/pages/admin/api/AdminApi';

const PrivilegesDataProvider = ({ search = '', children }) => {
  const [privileges, setPrivileges] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchPrivileges = useCallback(async (pageNum = 1, pageSize = 25, searchTerm = '') => {
    setPending(true);
    setError(null);
    try {
      const response = await getAllPrivilege({
        search: searchTerm,
        page: pageNum,
        size: pageSize,
      });

      if (response.success) {
        const data = response.data;
        // Handle new backend format: { totalPages, totalElements, pageNumber, response: [...] }
        // Also support old format: { content: [...], totalElements, totalPages }
        const privilegesData = data?.response || data?.content || [];
        setPrivileges(privilegesData);
        setTotalElements(data?.totalElements || 0);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch privileges');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch privileges');
      console.error('Error fetching privileges:', err);
    } finally {
      setPending(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchPrivileges(page, perPage, search);
  }, [fetchPrivileges, page, perPage, search]);

  const send = useCallback(() => {
    fetchPrivileges(1, perPage, search);
  }, [fetchPrivileges, perPage, search]);

  useEffect(() => {
    fetchPrivileges(1, perPage, search);
  }, [search, perPage, fetchPrivileges]);

  const handlePageChange = useCallback((newPage) => {
    fetchPrivileges(newPage, perPage, search);
  }, [fetchPrivileges, perPage, search]);

  const handlePerPageChange = useCallback((newPerPage) => {
    fetchPrivileges(1, newPerPage, search);
  }, [fetchPrivileges, search]);

  const handleNext = useCallback(() => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  }, [page, totalPages, handlePageChange]);

  const handlePrevious = useCallback(() => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  }, [page, handlePageChange]);

  return children({
    privileges,
    pending,
    error,
    page,
    perPage,
    totalElements,
    totalPages,
    refresh,
    send,
    onPageChange: handlePageChange,
    onPerPageChange: handlePerPageChange,
    onNext: handleNext,
    onPrevious: handlePrevious,
  });
};

export default PrivilegesDataProvider;
