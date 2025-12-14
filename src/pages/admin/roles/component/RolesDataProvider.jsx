import React, { useEffect, useCallback } from 'react';
import { getAllRole } from '@/pages/admin/api/AdminApi';

const RolesDataProvider = ({ search = '', children }) => {
  const [roles, setRoles] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchRoles = useCallback(async (pageNum = 1, pageSize = 25, searchTerm = '') => {
    setPending(true);
    setError(null);
    try {
      const response = await getAllRole({
        search: searchTerm,
        page: pageNum,
        size: pageSize,
      });

      if (response.success) {
        const data = response.data;
        // Handle new backend format: { totalPages, totalElements, pageNumber, response: [...] }
        // Also support old format: { content: [...], totalElements, totalPages }
        const rolesData = data?.response || data?.content || [];
        setRoles(rolesData);
        setTotalElements(data?.totalElements || 0);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch roles');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch roles');
      console.error('Error fetching roles:', err);
    } finally {
      setPending(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchRoles(page, perPage, search);
  }, [fetchRoles, page, perPage, search]);

  const send = useCallback(() => {
    fetchRoles(1, perPage, search);
  }, [fetchRoles, perPage, search]);

  useEffect(() => {
    fetchRoles(1, perPage, search);
  }, [search, perPage, fetchRoles]);

  const handlePageChange = useCallback((newPage) => {
    fetchRoles(newPage, perPage, search);
  }, [fetchRoles, perPage, search]);

  const handlePerPageChange = useCallback((newPerPage) => {
    fetchRoles(1, newPerPage, search);
  }, [fetchRoles, search]);

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
    roles,
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

export default RolesDataProvider;
