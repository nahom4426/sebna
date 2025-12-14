import React, { useEffect, useCallback } from 'react';
import { getAllInstitution } from '../api/InstitutionsApi';

const InstitutionsDataProvider = ({ search = '', children }) => {
  const [institutions, setInstitutions] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);

  const fetchInstitutions = useCallback(async (pageNum = 1, pageSize = 25, searchTerm = '') => {
    setPending(true);
    setError(null);
    try {
      const response = await getAllInstitution({
        search: searchTerm,
        page: pageNum,
        size: pageSize,
      });

      if (response.success) {
        const data = response.data;
        // Handle new backend format: { totalPages, totalElements, pageNumber, response: [...] }
        // Also support old format: { content: [...], totalElements, totalPages }
        const institutionsData = data?.response || data?.content || [];
        setInstitutions(institutionsData);
        setTotalElements(data?.totalElements || 0);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch institutions');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch institutions');
      console.error('Error fetching institutions:', err);
    } finally {
      setPending(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchInstitutions(page, perPage, search);
  }, [fetchInstitutions, page, perPage, search]);

  const send = useCallback(() => {
    fetchInstitutions(1, perPage, search);
  }, [fetchInstitutions, perPage, search]);

  useEffect(() => {
    fetchInstitutions(1, perPage, search);
  }, [search, perPage, fetchInstitutions]);

  const handlePageChange = useCallback((newPage) => {
    fetchInstitutions(newPage, perPage, search);
  }, [fetchInstitutions, perPage, search]);

  const handlePerPageChange = useCallback((newPerPage) => {
    fetchInstitutions(1, newPerPage, search);
  }, [fetchInstitutions, search]);

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
    institutions,
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

export default InstitutionsDataProvider;
