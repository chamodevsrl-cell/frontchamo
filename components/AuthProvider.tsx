"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACCOUNTS_KEY,
  SESSION_KEY,
  createAccount,
  hashPassword,
  normalizeEmail,
  parseAccounts,
  parseSession,
  randomSalt,
  verifyAccount,
  type AuthUser,
  type StoredAccount,
} from "@/lib/auth-local";

export type AuthMode = "login" | "register" | "reset";

type AuthContextValue = {
  isOpen: boolean;
  mode: AuthMode;
  user: AuthUser | null;
  ready: boolean;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<string | null>;
  resetPassword: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [ready, setReady] = useState(false);

  const openAuth = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setAccounts(parseAccounts(window.localStorage.getItem(ACCOUNTS_KEY)));
    setUser(parseSession(window.localStorage.getItem(SESSION_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }, [accounts, ready]);

  useEffect(() => {
    if (!ready) return;
    if (user) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [user, ready]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const persistUser = useCallback((account: StoredAccount) => {
    setUser({ name: account.name, email: account.email });
    setIsOpen(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const account = await verifyAccount(accounts, email, password);
      if (!account) return "Correo o contraseña incorrectos.";
      persistUser(account);
      return null;
    },
    [accounts, persistUser],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await createAccount(accounts, { name, email, password });
      if (!result.ok) return result.error;
      setAccounts((current) => [...current, result.account]);
      persistUser(result.account);
      return null;
    },
    [accounts, persistUser],
  );

  const resetPassword = useCallback(
    async (email: string, password: string) => {
      const normalized = normalizeEmail(email);
      const account = accounts.find((item) => item.email === normalized);
      if (!account) {
        return "No hay una cuenta con ese correo en este navegador.";
      }
      if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
      }
      const salt = randomSalt();
      const passwordHash = await hashPassword(password, salt);
      const next = { ...account, salt, passwordHash };
      setAccounts((current) =>
        current.map((item) => (item.email === normalized ? next : item)),
      );
      persistUser(next);
      return null;
    },
    [accounts, persistUser],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      user,
      ready,
      openAuth,
      closeAuth,
      setMode,
      login,
      register,
      resetPassword,
      logout,
    }),
    [
      isOpen,
      mode,
      user,
      ready,
      openAuth,
      closeAuth,
      login,
      register,
      resetPassword,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
