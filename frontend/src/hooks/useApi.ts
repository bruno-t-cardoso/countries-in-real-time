import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api';
import { useApp } from '../contexts/AppContext';

interface UseApiOptions {
  immediate?: boolean;
  pollingInterval?: number;
  retryCount?: number;
  retryDelay?: number;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  cancel: () => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const {
    immediate = true,
    pollingInterval,
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const executeApiCall = useCallback(
    async (retryAttempt = 0): Promise<void> => {
      try {
        // Cancel any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        const result = await apiCall();
        setData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        
        if (retryAttempt < retryCount && !abortControllerRef.current?.signal.aborted) {
          // Retry with exponential backoff
          const delay = retryDelay * Math.pow(2, retryAttempt);
          retryTimeoutRef.current = setTimeout(() => {
            executeApiCall(retryAttempt + 1);
          }, delay);
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiCall, retryCount, retryDelay]
  );

  const refetch = useCallback(() => executeApiCall(), [executeApiCall]);

  useEffect(() => {
    if (immediate) {
      executeApiCall();
    }

    // Setup polling if interval is provided
    if (pollingInterval && pollingInterval > 0) {
      pollingIntervalRef.current = setInterval(() => {
        executeApiCall();
      }, pollingInterval);
    }

    // Cleanup
    return () => {
      cancel();
    };
  }, [immediate, pollingInterval, executeApiCall, cancel]);

  return {
    data,
    loading,
    error,
    refetch,
    cancel,
  };
}

// Specialized hooks for different API calls
export const useCountries = (options?: UseApiOptions) => {
  const { actions } = useApp();

  return useApi(
    async () => {
      const response = await apiService.getCountries();
      actions.setCountries(response.data);
      actions.setLastUpdated(new Date());
      return response.data;
    },
    options
  );
};

export const useRegions = (options?: UseApiOptions) => {
  const { actions } = useApp();

  return useApi(
    async () => {
      const response = await apiService.getRegions();
      actions.setRegions(response.data);
      actions.setLastUpdated(new Date());
      return response.data;
    },
    options
  );
};

export const useWorldStats = (options?: UseApiOptions) => {
  const { actions } = useApp();

  return useApi(
    async () => {
      const response = await apiService.getWorldStats();
      actions.setWorldStats(response.data);
      actions.setLastUpdated(new Date());
      return response.data;
    },
    options
  );
};

export const useTopCountries = (limit: number = 10, options?: UseApiOptions) => {
  return useApi(
    async () => {
      const response = await apiService.getTopCountries(limit);
      return response.data;
    },
    options
  );
};

export const useBottomCountries = (limit: number = 10, options?: UseApiOptions) => {
  return useApi(
    async () => {
      const response = await apiService.getBottomCountries(limit);
      return response.data;
    },
    options
  );
};