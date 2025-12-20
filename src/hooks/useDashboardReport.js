import { useState, useEffect, useCallback, useRef } from "react";
import { getDashboardReport } from "@/features/dashboard/api/DashboardReportsApi";

export const useDashboardReport = (initialRange = "week") => {
  const [range, setRange] = useState(initialRange === "month" ? "month" : "week");
  const [cacheByRange, setCacheByRange] = useState({});
  const cacheRef = useRef({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchReport = useCallback(
    async (nextRange = range) => {
      if (!isMountedRef.current) return;

      const safeRange = nextRange === "month" ? "month" : "week";
      const cached = cacheRef.current?.[safeRange];

      if (cached) {
        setData(cached);
        setIsInitialLoad(false);
      }

      setLoading(!cached);
      setError(null);

      try {
        const res = await getDashboardReport(safeRange);
        if (!isMountedRef.current) return;

        if (res?.success) {
          cacheRef.current = { ...(cacheRef.current || {}), [safeRange]: res.data };
          setCacheByRange((prev) => ({ ...prev, [safeRange]: res.data }));
          setData(res.data);
          setIsInitialLoad(false);
        }

        return res;
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err);
        throw err;
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [range]
  );

  useEffect(() => {
    fetchReport(range);
  }, [fetchReport, range]);

  const refresh = useCallback(() => fetchReport(range), [fetchReport, range]);

  return {
    range,
    setRange,
    data,
    loading,
    isInitialLoad,
    error,
    refresh,
    cacheByRange,
  };
};
