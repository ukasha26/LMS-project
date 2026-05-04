import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setAuthToken, getAuthToken } from "@/lib/api";
import { Role } from "@/data/seed";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  student_id?: string;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: Role; studentId?: string }) => Promise<{ ok: boolean; error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.me()
        .then((res) => setUser(res.user))
        .catch(() => setAuthToken(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      setAuthToken(res.token);
      setUser(res.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    setAuthToken(null);
    setUser(null);
  };

  const register = async ({ name, email, password, role, studentId }: any) => {
    try {
      const res = await api.register({ name, email, password, role, student_id: studentId });
      setAuthToken(res.token);
      setUser(res.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  };

  return <Ctx.Provider value={{ user, loading, login, logout, register }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
