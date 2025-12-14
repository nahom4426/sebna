import React, { useEffect, useCallback } from 'react';
import { getAllMessages } from '../api/MessagesApi';

const MessagesDataProvider = ({ search = '', children }) => {
  const [messages, setMessages] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchMessages = useCallback(async (pageNum = 1, pageSize = 25, searchTerm = '') => {
    setPending(true);
    setError(null);
    try {
      const response = await getAllMessages({
        search: searchTerm,
        page: pageNum,
        size: pageSize,
      });

      if (response.success) {
        const data = response.data;
        const list = data?.response || data?.content || [];
        setMessages(list);
        setTotalElements(data?.totalElements || 0);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch messages');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages(1, perPage, search);
  }, [search, perPage, fetchMessages]);

  const handlePageChange = useCallback((newPage) => {
    fetchMessages(newPage, perPage, search);
  }, [fetchMessages, perPage, search]);

  const handlePerPageChange = useCallback((newPerPage) => {
    fetchMessages(1, newPerPage, search);
  }, [fetchMessages, search]);

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
    messages,
    pending,
    error,
    page,
    perPage,
    totalElements,
    totalPages,
    onPageChange: handlePageChange,
    onPerPageChange: handlePerPageChange,
    onNext: handleNext,
    onPrevious: handlePrevious,
  });
};

export default MessagesDataProvider;
