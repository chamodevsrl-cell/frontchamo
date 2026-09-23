"use client";

import {
  loginAdminAction,
  updateOwnProfileAction,
  verifyAdminSessionAction,
} from "@/app/admin/actions";
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
  clearAdminSessionClient,
  persistAdminSession,
  parseAdminSession,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_STORAGE_KEY,
} from "@/lib/auth";
import {
  ACCOUNTS_KEY,
  PROFILES_KEY,
  SESSION_KEY,
  applyProfileExtras,
  createAccount,
  emptyProfile,
  hashPassword,
  hydrateSessionUser,
  normalizeEmail,
  parseAccounts,
  parseProfiles,
  parseSession,
  profileOf,
  randomSalt,
  toAuthUser,
  updateAccountProfile,
  validateProfilePatch,
  verifyAccount,
  type AuthUser,
  type ProfileExtras,
  type ProfilePatch,
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
  panelSession: AuthSession | null;
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
  updateProfile: (patch: ProfilePatch) => Promise<string | null>;
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
    ...emptyProfile(),
  };
}

function writeLocal(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasPanelSession, setHasPanelSession] = useState(false);
  const [panelSession, setPanelSession] = useState<AuthSession | null>(null);
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileExtras>>({});
  const [ready, setReady] = useState(false);

  const openAuth = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    // TODO Backend: reemplazar la hidratación de cuentas/sesión de la tienda (todo este
    // efecto) con fetch('/api/v1/store/session') — ver API_CONTRACT_TIENDA.md §3. La sesión
    // del panel (readPanelSession/hasPanelSession) sigue el flujo de API_CONTRACT.md, no cambia acá.
    const loadedAccounts = parseAccounts(window.localStorage.getItem(ACCOUNTS_KEY));
    const loadedSession = parseSession(window.localStorage.getItem(SESSION_KEY));
    const loadedProfiles = parseProfiles(window.localStorage.getItem(PROFILES_KEY));
    // Solo una cuenta de la tienda se restaura directo. Un usuario del panel guardado
    // en `chamo-session-v1` NO: espera a que el servidor confirme la sesión (abajo).
    const storeSession =
      loadedSession &&
      loadedAccounts.some((account) => account.email === loadedSession.email)
        ? hydrateSessionUser(loadedSession, loadedAccounts)
        : null;
    const storeUser = storeSession
      ? applyProfileExtras(storeSession, loadedProfiles[storeSession.id])
      : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setAccounts(loadedAccounts);
    setProfiles(loadedProfiles);
    setPanelSession(null);
    setHasPanelSession(false);
    setUser(storeUser);
    setReady(true);

    // "Administrar" solo aparece si el servidor valida la sesión del panel
    // (GET /api/v1/auth/session). Una copia vieja en cookie/localStorage no basta.
    if (!readPanelSession()) return;
    let cancelled = false;
    void verifyAdminSessionAction().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        clearAdminSessionClient();
        return;
      }
      persistAdminSession(result.session);
      setPanelSession(result.session);
      setHasPanelSession(true);
      if (!storeUser) {
        setUser(
          applyProfileExtras(
            panelUserFromSession(result.session),
            loadedProfiles[result.session.id],
          ),
        );
      }
    });
    return () => {
      cancelled = true;
    };
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

  const persistUser = useCallback(
    (account: StoredAccount, extras?: ProfileExtras) => {
      setUser(applyProfileExtras(toAuthUser(account), extras ?? profiles[account.id]));
      setIsOpen(false);
    },
    [profiles],
  );

  const applyPanelSession = useCallback(
    (session: AuthSession, extras?: ProfileExtras) => {
      persistAdminSession(session);
      setPanelSession(session);
      setHasPanelSession(true);
      setUser(
        applyProfileExtras(
          panelUserFromSession(session),
          extras ?? profiles[session.id],
        ),
      );
      setIsOpen(false);
    },
    [profiles],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      // TODO Backend: reemplazar verifyAccount() (hash en el cliente) con
      // fetch('/api/v1/store/login') — ver API_CONTRACT_TIENDA.md §3.
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
      // TODO Backend: reemplazar createAccount() (hash en el cliente) con
      // fetch('/api/v1/store/register') — ver API_CONTRACT_TIENDA.md §3.
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

  const updateProfile = useCallback(
    async (patch: ProfilePatch) => {
      // TODO Backend: para cuentas de tienda (no panel), reemplazar el guardado en
      // localStorage de más abajo con fetch('/api/v1/store/profile', { method: 'PATCH' })
      // — ver API_CONTRACT_TIENDA.md §3. El bloque `if (hasPanelSession)` de abajo ya usa
      // updateOwnProfileAction() del panel (API_CONTRACT.md) y no cambia.
      if (!user) return "Inicia sesión para editar tu perfil.";
      const requirePhone = hasPanelSession || user.role === "admin";
      const invalid = validateProfilePatch(patch, { requirePhone });
      if (invalid) return invalid;

      const extras = profileOf(patch);
      const nextUser: AuthUser = {
        ...user,
        name: patch.name.trim(),
        ...extras,
      };
      const nextProfiles = { ...profiles, [user.id]: extras };
      const accountMatch = accounts.find(
        (account) => account.id === user.id || account.email === user.email,
      );
      let nextAccounts = accounts;
      if (accountMatch) {
        const result = updateAccountProfile(accounts, accountMatch.id, {
          name: nextUser.name,
          ...extras,
        });
        if (!result.ok) return result.message;
        nextAccounts = result.accounts;
      }

      if (!writeLocal(PROFILES_KEY, nextProfiles)) {
        return "No se pudo guardar (la foto es muy pesada). Prueba una imagen más liviana.";
      }
      if (accountMatch && !writeLocal(ACCOUNTS_KEY, nextAccounts)) {
        return "No se pudo guardar (la foto es muy pesada). Prueba una imagen más liviana.";
      }
      if (!writeLocal(SESSION_KEY, nextUser)) {
        return "No se pudo guardar (la foto es muy pesada). Prueba una imagen más liviana.";
      }

      setProfiles(nextProfiles);
      setAccounts(nextAccounts);
      setUser(nextUser);

      if (hasPanelSession) {
        const panel = await updateOwnProfileAction(user.id, {
          name: nextUser.name,
          phone: extras.phone,
          company: extras.company,
          ruc: extras.ruc,
        });
        if (panel.ok) {
          persistAdminSession(panel.session);
          setPanelSession(panel.session);
          setUser(
            applyProfileExtras(panelUserFromSession(panel.session), extras),
          );
        }
      }
      return null;
    },
    [accounts, hasPanelSession, profiles, user],
  );

  const logout = useCallback(() => {
    // TODO Backend: para cuentas de tienda, además llamar fetch('/api/v1/store/logout')
    // — ver API_CONTRACT_TIENDA.md §3. El logout del panel (abajo) ya sigue API_CONTRACT.md.
    setUser(null);
    setHasPanelSession(false);
    setPanelSession(null);
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
      panelSession,
      ready,
      openAuth,
      closeAuth,
      setMode,
      login,
      register,
      resetPassword,
      updateProfile,
      logout,
    }),
    [
      isOpen,
      mode,
      user,
      hasPanelSession,
      panelSession,
      ready,
      openAuth,
      closeAuth,
      login,
      register,
      resetPassword,
      updateProfile,
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
