import { useState, useCallback, useRef } from 'react';

export function useApiRequest() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [dirty, setDirty] = useState(false);
  const controllerRef = useRef(null);

  const send = useCallback(async (requestFunction, onSuccess, showLoading = true) => {
    if (pending) return;

    // Cancel previous request if exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    setPending(showLoading);
    setError(null);
    setDirty(true);

    try {
      let result;
      
      if (typeof requestFunction === 'function') {
        // Handle request with signal
        if (requestFunction.toString().includes('signal')) {
          controllerRef.current = new AbortController();
          result = await requestFunction({ signal: controllerRef.current.signal });
        } else {
          result = await requestFunction();
        }
      } else {
        result = requestFunction;
      }

      setResponse(result);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        console.error('API Request Error:', err);
      }
      throw err;
    } finally {
      setPending(false);
      controllerRef.current = null;
    }
  }, [pending]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setDirty(false);
  }, []);

  return {
    pending,
    error,
    response,
    dirty,
    send,
    clearError,
    clearResponse,
  };
}
