import { useState } from "react";
import { useAuth } from "../context/authContext";

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

  const post = async (url: string, payload: any, options?: RequestInit): Promise<T> => {
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
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data: T = await res.json();
      setState({ data, error: null, loading: false });
      return data;
    } catch (err: any) {
      setState({ data: null, error: err.message || "Unknown error", loading: false });
      throw err;
    }
  };

  return { post, ...state };
}

export default usePost;
