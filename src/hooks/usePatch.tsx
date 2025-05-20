import { useState } from "react";
import { useAuth } from "../context/authContext";
import { parseApiError } from "../utils/apiErrorParser";

type PatchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function usePatch<T = unknown>() {
  const { token, invalidateSession } = useAuth();
  const [state, setState] = useState<PatchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const patch = async (url: string, payload: any, options?: RequestInit): Promise<T> => {
    setState({ data: null, loading: true, error: null });

    try {
      const headers = new Headers(options?.headers || {});
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const res = await fetch(import.meta.env.VITE_API_URL + url, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
        ...options,
      });

      if (!res.ok) {
        if (res.status == 401) {
          invalidateSession(`${res.status} ${res.statusText}`);
        }
        throw res
      }

      const data: T = await res.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err: any) {
      const errorMessage = await parseApiError(err);
      setState({ data: null, loading: false, error: errorMessage || "Unknown error" });
      throw err;
    }
  };

  return { patch, ...state };
}

export default usePatch;
