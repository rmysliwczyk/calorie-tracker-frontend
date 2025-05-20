import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { parseApiError } from "../utils/apiErrorParser";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch?: () => void;
};

function useFetch<T = unknown>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });
  const [refetchIndex, setRefetchIndex] = useState(0);
  const auth = useAuth();

  function refetch() {setRefetchIndex(prevRefetchIndex => prevRefetchIndex + 1 )}

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const headers = new Headers(options?.headers || {});
        if (auth.token) {
          headers.set("Authorization", `Bearer ${auth.token}`);
        }

        const res = await fetch(import.meta.env.VITE_API_URL + url, {
          ...options,
          headers,
        });

        if (!res.ok) {
          if(res.status == 401) {
            auth.invalidateSession(`${res.status} ${res.statusText}`);
          }
          throw res;
        }

        const data: T = await res.json();
        if (!isCancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error: any) {
        const errorMessage = await parseApiError(error);
        if (!isCancelled) {
          setState({ data: null, loading: false, error: errorMessage || "Unknown error" });
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [url, JSON.stringify(options), auth.token, refetchIndex]);

  return {...state, refetch}
}

export default useFetch;
