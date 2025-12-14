import React, { useEffect, useCallback } from 'react';
import { getAllUser } from '@/pages/admin/api/AdminApi';

const UsersDataProvider = ({ search = '', children }) => {
  const [users, setUsers] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchUsers = useCallback(async (pageNum = 1, pageSize = 25, searchTerm = '') => {
    setPending(true);
    setError(null);
    try {
      const response = await getAllUser({
        search: searchTerm,
        page: pageNum,
        size: pageSize,
      });

      if (response.success) {
        const data = response.data;
        // Handle new backend format: { totalPages, totalElements, pageNumber, response: [...] }
        // Also support old format: { content: [...], totalElements, totalPages }
        const usersData = data?.response || data?.content || [];
        setUsers(usersData);
        setTotalElements(data?.totalElements || 0);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setPending(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchUsers(page, perPage, search);
  }, [fetchUsers, page, perPage, search]);

  const send = useCallback(() => {
    fetchUsers(1, perPage, search);
  }, [fetchUsers, perPage, search]);

  useEffect(() => {
    fetchUsers(1, perPage, search);
  }, [search, perPage, fetchUsers]);

  const handlePageChange = useCallback((newPage) => {
    fetchUsers(newPage, perPage, search);
  }, [fetchUsers, perPage, search]);

  const handlePerPageChange = useCallback((newPerPage) => {
    fetchUsers(1, newPerPage, search);
  }, [fetchUsers, search]);

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
    users,
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

export default UsersDataProvider;
