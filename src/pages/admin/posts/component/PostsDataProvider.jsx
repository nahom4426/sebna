import React, { useEffect, useCallback, useRef } from 'react';
import { getAllPosts } from '../api/PostsApi';

const PostsDataProvider = ({ search = '', children }) => {
  const [posts, setPosts] = React.useState([]);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(25);
  const [totalElements, setTotalElements] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPosts = useCallback(async (pageNum = 1, pageSize = 25, searchTerm = '') => {
    if (!isMountedRef.current) return;
    setPending(true);
    setError(null);
    try {
      const response = await getAllPosts({
        search: searchTerm,
        page: pageNum,
        size: pageSize,
      });

      if (!isMountedRef.current) return;

      if (response.success) {
        const data = response.data;
        const postsData = data?.response || data?.content || [];
        setPosts(postsData);
        setTotalElements(data?.totalElements || 0);
        setTotalPages(data?.totalPages || 1);
        setPage(pageNum);
        setPerPage(pageSize);
      } else {
        setError(response.error || 'Failed to fetch posts');
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err.message || 'Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      if (isMountedRef.current) {
        setPending(false);
      }
    }
  }, []);

  const refresh = useCallback(() => {
    fetchPosts(page, perPage, search);
  }, [fetchPosts, page, perPage, search]);

  useEffect(() => {
    fetchPosts(1, perPage, search);
  }, [search, perPage]);

  const handlePageChange = useCallback((newPage) => {
    fetchPosts(newPage, perPage, search);
  }, [fetchPosts, perPage, search]);

  const handlePerPageChange = useCallback((newPerPage) => {
    fetchPosts(1, newPerPage, search);
  }, [fetchPosts, search]);

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
    posts,
    pending,
    error,
    page,
    perPage,
    totalElements,
    totalPages,
    refresh,
    onPageChange: handlePageChange,
    onPerPageChange: handlePerPageChange,
    onNext: handleNext,
    onPrevious: handlePrevious,
  });
};

export default PostsDataProvider;
