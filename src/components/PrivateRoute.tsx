import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

export default function PrivateRoute() {
  const auth = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkCredentials() {
      if (!auth.token) {
        toast.warn("This page is only for logged in users", { autoClose: 1000 });
        auth.logOutAction();
        return;
      }
      else {
        await auth.validateToken()
      }
      setChecking(false);
    }

    checkCredentials();
  }, [auth]);

  if (checking || !auth.isValidated) {
    return <>Checking credentials...</>
  }

  return <Outlet />;
}
