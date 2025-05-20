import { useState } from "react";
import { useAuth } from "../context/authContext";

type DeleteState = {
  error: string | null;
};

function useDelete<T = unknown>() {
  const { token, invalidateSession } = useAuth();
  const [state, setState] = useState<DeleteState>({
    error: null,
  });

  const deletereq = async (url: string, options?: RequestInit): Promise<T> => {
    setState({ error: null });

    try {
      const headers = new Headers(options?.headers || {});
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const res = await fetch(import.meta.env.VITE_API_URL + url, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        if (res.status == 401) {
          invalidateSession(`${res.status} ${res.statusText}`);
        }
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data: T = await res.json();
      setState({ error: null });
      return data;
    } catch (err: any) {
      setState({ error: err.message || "Unknown error" });
      throw err;
    }
  };

  return { ...state, deletereq };
}

export default useDelete;
