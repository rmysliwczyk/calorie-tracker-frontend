import { useState } from "react";
import { useAuth } from "../context/authContext";
import { parseApiError } from "../utils/apiErrorParser";

type PostState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

function usePost<T = unknown>() {
  const { token, invalidateSession } = useAuth();
  const [state, setState] = useState<PostState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const post = async (url: string, payload: any, options?: RequestInit): Promise<T | null> => {
    setState({ data: null, error: null, loading: true });

    try {
      const headers = new Headers(options?.headers || {});
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const res = await fetch(import.meta.env.VITE_API_URL + url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        ...options,
      });

      if (!res.ok) {
        if (res.status == 401) {
          invalidateSession(`${res.status} ${res.statusText}`);
        }
        throw res;
      }

      const data: T = await res.json();
      setState({ data, error: null, loading: false });
      return data;
    } catch (err: any) {
      const errorMessage = await parseApiError(err);
      setState({ data: null, error: errorMessage || "Unknown error", loading: false });
      return null;
    }
  };

  return { post, ...state };
}

export default usePost;
