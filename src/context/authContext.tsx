import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { parseApiError } from "../utils/apiErrorParser";

export interface AuthContext {
  userId: number | null;
  isAdmin: boolean | null;
  token: string | null;
  isValidated: boolean
  loginAction(username: string, password: string): Promise<void>;
  logOutAction(): void;
  validateToken(): Promise<void>;
  invalidateSession(error: string): void;
}

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState<number | null>(Number(localStorage.getItem("userId")) || null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(Boolean(localStorage.getItem("isAdmin") || null));
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const navigate = useNavigate();

  async function validateToken() {
    if (isValidated || !token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unauthorized");

      setIsValidated(true);
    } catch (e) {
      toast.warn("Auth token invalid", { autoClose: 1000 });
      logOutAction();
    }
  }

  async function invalidateSession(error: string) {
    toast.error(`Received following error: ${error}. Your session is now invalid.`)
    logOutAction();
  }

  async function loginAction(username: string, password: string) {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if(!response.ok) {
        throw response
      }

      const receivedJson = await response.json();
      if (receivedJson.access_token) {
        setToken(receivedJson.access_token);
        localStorage.setItem("token", receivedJson.access_token);
        const responseUser = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if(!responseUser.ok) {
          throw responseUser
        }

        const receivedJsonUser = await responseUser.json();
        setUserId(receivedJsonUser.id);
        localStorage.setItem("userId", receivedJsonUser.id);
        setIsAdmin(receivedJsonUser.is_admin);
        localStorage.setItem("isAdmin", receivedJsonUser.is_admin);
        navigate("/fooditems");
      } else {
        throw new Error("No token received in response")
      }
    } catch (err: any) {
      throw new Error(await parseApiError(err));
    }
  }

  async function logOutAction() {
    setToken("");
    setUserId(null);
    setIsAdmin(null);
    setIsValidated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  }

  const value: AuthContext = {
    userId,
    isAdmin,
    token,
    isValidated,
    loginAction,
    logOutAction,
    validateToken,
    invalidateSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);
  useEffect(function() {
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }},[context]);
  return context;
}
