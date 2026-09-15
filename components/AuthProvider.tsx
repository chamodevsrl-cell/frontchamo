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
import { loginAdminAction } from "@/app/admin/actions";
import {
  clearAdminSessionClient,
  persistAdminSession,
  parseAdminSession,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_STORAGE_KEY,
} from "@/lib/auth";
import {
  ACCOUNTS_KEY,
  SESSION_KEY,
  createAccount,
  hashPassword,
  normalizeEmail,
  hydrateSessionUser,
  parseAccounts,
  parseSession,
  randomSalt,
  toAuthUser,
  verifyAccount,
  type AuthUser,
  type StoredAccount,
} from "@/lib/auth-local";
import type { AuthSession } from "@/types/admin";

export type AuthMode = "login" | "register" | "reset";

type AuthContextValue = {
  isOpen: boolean;
  mode: AuthMode;
  user: AuthUser | null;
  /** True si hay sesión del panel (`chamo_admin_session`) — muestra Administrar. */
  hasPanelSession: boolean;
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

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  return match ? match.slice(prefix.length) : null;
}

function readPanelSession(): AuthSession | null {
  const fromCookie = parseAdminSession(readCookie(ADMIN_SESSION_COOKIE));
  if (fromCookie) return fromCookie;
  try {
    return parseAdminSession(localStorage.getItem(ADMIN_SESSION_STORAGE_KEY));
  } catch {
    return null;
  }
}

function panelUserFromSession(session: AuthSession): AuthUser {
  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: "admin",
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasPanelSession, setHasPanelSession] = useState(false);
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
    const loadedAccounts = parseAccounts(window.localStorage.getItem(ACCOUNTS_KEY));
    const loadedSession = parseSession(window.localStorage.getItem(SESSION_KEY));
    const panelSession = readPanelSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setAccounts(loadedAccounts);
    setHasPanelSession(Boolean(panelSession));
    setUser(
      hydrateSessionUser(loadedSession, loadedAccounts) ??
        (panelSession ? panelUserFromSession(panelSession) : null),
    );
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
    setUser(toAuthUser(account));
    setIsOpen(false);
  }, []);

  const applyPanelSession = useCallback((session: AuthSession) => {
    persistAdminSession(session);
    setHasPanelSession(true);
    setUser(panelUserFromSession(session));
    setIsOpen(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const account = await verifyAccount(accounts, email, password);
      if (account) {
        persistUser(account);
        return null;
      }

      const panel = await loginAdminAction({ email, password });
      if (!panel.ok) {
        return panel.message.toLowerCase().includes("suspendida")
          ? panel.message
          : "Correo o contraseña incorrectos.";
      }
      applyPanelSession(panel.session);
      return null;
    },
    [accounts, persistUser, applyPanelSession],
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
    setHasPanelSession(false);
    clearAdminSessionClient();
    void import("@/lib/auth").then(({ logoutAdmin }) => {
      void logoutAdmin();
    });
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      user,
      hasPanelSession,
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
      hasPanelSession,
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
