import React, { useEffect, useCallback, useRef } from 'react';
import { getAllUser } from '@/pages/admin/api/AdminApi';

const UsersDataProvider = ({ search = '', children }) => {
  const [users, setUsers] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const isMountedRef = useRef(true);
  const lastFetchKeyRef = useRef('');

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUsers = useCallback(async (pageNum = 1, pageSize = 25, searchTerm = '') => {
    if (!isMountedRef.current) return;
    setPending(true);
    setError(null);
    try {
      const response = await getAllUser({
        search: searchTerm,
        page: pageNum,
        limit: pageSize,
      });

      if (!isMountedRef.current) return;

      if (response.success) {
        const data = response.data;
        const rawUsers = Array.isArray(data?.response) ? data.response : (Array.isArray(data?.content) ? data.content : []);
        const usersData = rawUsers.map((u) => ({
          ...u,
          userUuid: u?.userUuid || u?.uuid || u?.id,
        }));
        setUsers(usersData);
        setTotalElements(data?.totalElements || usersData.length);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err.message || 'Failed to fetch users');
    } finally {
      if (isMountedRef.current) {
        setPending(false);
      }
    }
  }, []);

  // Fetch users on mount and when search/perPage changes
  useEffect(() => {
    const fetchKey = `${search}::${perPage}`;
    if (lastFetchKeyRef.current === fetchKey) return;
    lastFetchKeyRef.current = fetchKey;
    fetchUsers(1, perPage, search);
  }, [search, perPage, fetchUsers]);

  const refresh = useCallback(() => {
    fetchUsers(page, perPage, search);
  }, [fetchUsers, page, perPage, search]);

  const send = useCallback(() => {
    fetchUsers(1, perPage, search);
  }, [fetchUsers, perPage, search]);

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
