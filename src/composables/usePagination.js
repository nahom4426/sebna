import { useState, useCallback, useEffect, useRef } from 'react';
import { useTablePagination } from './useTablePagination';
import { useApiRequest } from './useApiRequest';

export function usePagination(options = {}) {
  const paginationOptions = useRef({
    cb: (f) => f,
    store: null,
    auto: true,
    perPage: 25,
    totalElements: 0,
    cache: false,
    ...(options || {}),
  });

  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [perPage, setPerPage] = useState(paginationOptions.current.perPage);
  const [totalElements, setTotalElements] = useState(paginationOptions.current.totalElements || 0);

  const req = useApiRequest();
  const searchPagination = useTablePagination(perPage);
  const pagination = useTablePagination(perPage);

  const getPaginationData = useCallback((next = true, current = false) => {
    let pageValue;
    
    if (next) {
      if (!current) {
        pageValue = searching ? searchPagination.page + 1 : pagination.page + 1;
      } else {
        pageValue = searching ? searchPagination.page : pagination.page;
      }
    } else {
      pageValue = searching ? searchPagination.page - 1 : pagination.page - 1;
    }

    const data = {
      searchKey: search || '',
      search: search || '',
      page: pageValue,
      size: Number(perPage) || 25,
    };

    return data;
  }, [search, searching, searchPagination.page, pagination.page, perPage]);

  const extractPaginationData = useCallback((response) => {
    let data;
    if (response?.success) {
      data = response.data;
    } else {
      data = response;
    }

    // Handle new backend format: { totalPages, totalElements, pageNumber, response: [...] }
    // Also handle nested page object structure: { content: [...], page: { totalElements, totalPages, size } }
    const elementsCount = data?.numberOfElements ?? data?.totalElements ?? data?.page?.totalElements ?? 0;
    const totalPagesCount = data?.totalPages ?? data?.page?.totalPages ?? 1;
    const pageSize = data?.size ?? data?.page?.size ?? data?.pageable?.pageSize ?? perPage;
    
    // Extract content from either 'content', 'response', or 'data' field
    const contentArray = data?.content || data?.response || data?.data || [];

    const result = {
      content: contentArray,
      totalElements: elementsCount,
      totalPages: totalPagesCount,
      perPage: pageSize,
    };

    return result;
  }, [perPage]);

  const fetch = useCallback(async (next = true, current = false, cache = false) => {
    if (req.pending) return;
    if (next && pagination.done) return;

    const paginationData = getPaginationData(next, current);
    paginationData.limit = Number(perPage) || 25;

    try {
      const result = await req.send(
        () => paginationOptions.current.cb(paginationData),
        (res) => {
          const { content, totalElements: total, totalPages, perPage: pageSize } = extractPaginationData(res?.data || res);

          if (paginationOptions.current.store) {
            paginationOptions.current.store.set(content);
          }

          pagination.setTotalPages(totalPages);
          setTotalElements(total);
          paginationOptions.current.totalElements = total;
          setPerPage(pageSize);

          // Mark as done if we're truly at the end
          pagination.setDone(
            pagination.page >= totalPages - 1 ||
            content.length < pagination.limit
          );
        },
        true
      );
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }, [req.pending, pagination.done, getPaginationData, perPage, req, extractPaginationData, pagination]);

  let controller;
  let timeout;

  const fetchSearch = useCallback(async (next = true, current = false) => {
    if (next && searchPagination.done) return;

    if (controller) controller.abort();
    if (timeout) clearTimeout(timeout);
    controller = new AbortController();

    if (paginationOptions.current.store) {
      paginationOptions.current.store.set([]);
    }

    return new Promise((resolve) => {
      timeout = setTimeout(async () => {
        const paginationData = getPaginationData(next, current);
        paginationData.limit = Number(perPage) || 25;

        try {
          const result = await req.send(
            () => ({
              ...paginationData,
              signal: controller.signal,
            }),
            (res) => {
              if (!res?.success) return;

              const { content, totalElements: total, totalPages } = extractPaginationData(res.data);

              if (paginationOptions.current.store) {
                paginationOptions.current.store.set(content);
              }

              searchPagination.setTotalPages(totalPages);
              setTotalElements(total);

              searchPagination.setDone(
                searchPagination.page >= totalPages - 1 ||
                content.length < searchPagination.limit
              );
              resolve(result);
            },
            true
          );
        } catch (error) {
          console.error('Search fetch error:', error);
          resolve(null);
        }
      }, 20);
    });
  }, [searchPagination.done, getPaginationData, perPage, req, extractPaginationData, searchPagination]);

  const next = useCallback(() => {
    if (searching) {
      fetchSearch();
    } else {
      fetch(true, false, paginationOptions.current.cache);
    }
  }, [searching, fetch, fetchSearch]);

  const previous = useCallback(() => {
    if (searching) {
      if (searchPagination.page <= 0) return;
      searchPagination.setDone(false);
      fetchSearch(false);
    } else {
      if (pagination.page <= 0) return;
      pagination.setDone(false);
      fetch(false, false, paginationOptions.current.cache);
    }
  }, [searching, searchPagination.page, pagination.page, fetchSearch, fetch]);

  // Search effect
  useEffect(() => {
    searchPagination.setDone(false);
    searchPagination.setPage(0); // Start from page 1 (0-indexed)

    if (search) {
      setSearching(true);
      fetchSearch(true, false);
    } else if (!search && paginationOptions.current.auto) {
      setSearching(false);
      pagination.setDone(false);
      fetch(true, true, paginationOptions.current.cache);
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto fetch effect
  useEffect(() => {
    if (paginationOptions.current.auto) {
      fetch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const send = useCallback(() => {
    pagination.reset(perPage);
    searchPagination.reset(perPage);
    fetch();
  }, [pagination, searchPagination, perPage, fetch]);

  const sendPagination = useCallback((limit, pageValue) => {
    if (pageValue !== undefined) {
      pagination.reset(perPage);
      searchPagination.reset(perPage);
      setSearching(false); // Ensure we're not in search mode
      pagination.setPage(pageValue);
      // Use current=true to prevent incrementing the page
      fetch(true, true);
    } else {
      setPerPage(limit);
      pagination.reset(limit);
      searchPagination.reset(limit);
      fetch();
    }
  }, [pagination, searchPagination, perPage, fetch]);

  const currentPage = searching ? searchPagination.page : pagination.page;
  const currentTotalPages = searching ? searchPagination.totalPages : pagination.totalPages;

  return {
    page: currentPage,
    search,
    perPage,
    totalElements,
    send,
    sendPagination,
    totalPages: currentTotalPages,
    data: paginationOptions.current.store && !searching
      ? paginationOptions.current.store.getAll()
      : req.response?.content || req.response?.data || [],
    error: req.error,
    pending: req.pending,
    dirty: req.dirty,
    next,
    previous,
    searching,
  };
}
