import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as authApi from "../api/auth";
import type { RegisterInput } from "../api/auth";
import type { ApiAuthUser } from "../api/types";
import { AuthContext } from "./authContext";
import type { AuthContextValue } from "./authContext";
import { clearToken, getToken, setToken } from "./token";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiAuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
      return;
    }
    authApi
      .me()
      .then((current) => setUser(current))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await authApi.register(input);
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
