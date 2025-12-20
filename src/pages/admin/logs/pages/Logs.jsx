import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';
import Table from '@/components/Table';
import Pagination from '@/composables/Pagination';
import { getLoginLogs } from '../api/LogsApi';

const Logs = () => {
  const auth = useAuthStore((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedKey, setExpandedKey] = useState(null);

  const userPrivileges = auth?.user?.privileges || [];
  const canRead = userPrivileges.includes(ROLES.READ_LOGS);

  useEffect(() => {
    if (!canRead) return;
    setPage(1);
  }, [canRead]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const d = new Date(timestamp);
    return Number.isFinite(d.getTime()) ? d.toLocaleString() : '-';
  };

  const normalizeSuccess = (raw) => {
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'number') return raw === 1;
    if (typeof raw === 'string') {
      const v = raw.trim().toLowerCase();
      if (v === 'success' || v === 'true' || v === '1' || v === 'ok') return true;
      if (v === 'failed' || v === 'false' || v === '0') return false;
    }
    return null;
  };

  const fetchLogs = useCallback(async (pageNum = 1, pageSize = 25) => {
    if (!canRead) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getLoginLogs({
        page: pageNum,
        limit: pageSize,
      });

      if (!response?.success) {
        setError(response?.error || 'Failed to load logs');
        setLogs([]);
        setTotalElements(0);
        setTotalPages(1);
        setPage(pageNum);
        setPerPage(pageSize);
        return;
      }

      const data = response.data;
      const rawLogs = Array.isArray(data?.response)
        ? data.response
        : (Array.isArray(data?.content) ? data.content : (Array.isArray(data?.logs) ? data.logs : []));

      const mapped = rawLogs.map((l, idx) => {
        const key = l?.logUuid || l?.uuid || l?.id || `${pageNum}-${idx}`;
        const success = normalizeSuccess(l?.success ?? l?.isSuccess ?? l?.status);
        return {
          key,
          email: l?.email || l?.userEmail || l?.username || '-',
          success,
          ip: l?.ip || l?.ipAddress || '-',
          createdAt: l?.createdAt || l?.timestamp || l?.createdDate || l?.created_on,
          failureReason: l?.failureReason || l?.reason || l?.message || '-',
          userAgent: l?.userAgent || l?.user_agent || l?.agent || '',
        };
      });

      setLogs(mapped);
      setTotalElements(data?.totalElements || data?.total || mapped.length);
      setTotalPages(data?.totalPages || 1);
      setPage(pageNum);
      setPerPage(pageSize);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err?.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [canRead]);

  useEffect(() => {
    if (!canRead) return;
    fetchLogs(page, perPage);
  }, [canRead, fetchLogs, page, perPage]);

  const filteredLogs = filterType === 'all'
    ? logs
    : filterType === 'success'
      ? logs.filter((l) => l.success === true)
      : logs.filter((l) => l.success === false);

  const headers = {
    head: ['Email', 'Success', 'IP', 'Created At', 'Failure Reason'],
    row: ['email', 'success', 'ip', 'createdAt', 'failureReason'],
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const renderRow = (row, index, currentPage, currentPerPage) => {
    const expanded = expandedKey === row.key;
    const colSpan = (headers?.head?.length || 0) + 2;
    const label = row.success === true ? 'Success' : row.success === false ? 'Failed' : '-';
    const badgeClass = row.success === true
      ? 'bg-green-100 text-green-800'
      : row.success === false
        ? 'bg-red-100 text-red-800'
        : 'bg-gray-100 text-gray-800';

    return (
      <React.Fragment key={row.key}>
        <tr className="border-b border-gray-200 hover:bg-gray-50">
          <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-600 border-r border-gray-100">
            {(currentPage - 1) * currentPerPage + index + 1}
          </td>
          <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
            {row.email || '-'}
          </td>
          <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
            <span className={`px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full ${badgeClass}`}>
              {label}
            </span>
          </td>
          <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
            {row.ip || '-'}
          </td>
          <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
            {formatTimestamp(row.createdAt)}
          </td>
          <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs text-gray-800 border-r border-gray-100">
            {row.failureReason || '-'}
          </td>
          <td className="px-1.5 sm:px-2 py-1.5 text-[10px] sm:text-xs">
            {row.userAgent ? (
              <button
                type="button"
                onClick={() => setExpandedKey(expanded ? null : row.key)}
                className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {expanded ? 'Hide' : 'UserAgent'}
              </button>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
        </tr>
        {expanded && (
          <tr className="border-b border-gray-200 bg-gray-50">
            <td colSpan={colSpan} className="px-3 py-3 text-[10px] sm:text-xs text-gray-700">
              <div className="whitespace-pre-wrap break-words">{row.userAgent}</div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const filterTypes = [
    { key: 'all', label: 'All' },
    { key: 'success', label: 'Success' },
    { key: 'failed', label: 'Failed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Logs</h1>
          <p className="text-gray-600">Monitor system activities and user actions</p>
        </div>

        {canRead && !loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Logs</h2>
            <div className="flex gap-3 flex-wrap" role="group" aria-label="Filter log types">
              {filterTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setFilterType(type.key)}
                  aria-pressed={filterType === type.key}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === type.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && canRead && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading logs...</p>
          </div>
        )}

        {/* Error State */}
        {error && canRead && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && canRead ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <Table
              headers={headers}
              rows={filteredLogs}
              loading={loading}
              renderRow={renderRow}
              page={page}
              perPage={perPage}
              placeholder="No logs found"
              lastCol
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              perPage={perPage}
              rowsCount={filteredLogs.length}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              loading={loading}
            />
          </div>
        ) : !loading && !error && !canRead ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">You don't have permission to view logs</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Logs;