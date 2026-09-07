"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useAuth, type AuthMode } from "@/components/AuthProvider";

export default function AuthForm() {
  const { mode, setMode, closeAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function switchMode(next: AuthMode) {
    setMode(next);
    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (mode === "register" && password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setMessage(
      mode === "login"
        ? "Formulario listo. Conectaremos el inicio de sesión más adelante."
        : "Registro listo. Conectaremos la cuenta más adelante.",
    );
  }

  const isLogin = mode === "login";
  const fieldClass =
    "w-full rounded-xl border-2 border-brand-primary/35 bg-white px-3.5 py-2.5 text-sm text-brand-dark outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 dark:border-brand-primary/40 dark:bg-brand-dark/40 dark:text-white";

  return (
    <div className="w-full">
      <div className="mb-5 flex rounded-xl border-2 border-brand-primary/25 bg-brand-primary/5 p-1 dark:bg-brand-primary/10">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            isLogin
              ? "bg-brand-primary text-white shadow-sm"
              : "text-brand-dark/70 hover:text-brand-primary dark:text-white/70 dark:hover:text-white"
          }`}
        >
          <LogIn className="h-4 w-4" strokeWidth={2} />
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => switchMode("register")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
            !isLogin
              ? "bg-brand-primary text-white shadow-sm"
              : "text-brand-dark/70 hover:text-brand-primary dark:text-white/70 dark:hover:text-white"
          }`}
        >
          <UserPlus className="h-4 w-4" strokeWidth={2} />
          Registrarse
        </button>
      </div>

      <div className="mb-5">
        <h2 className="font-display text-2xl font-bold text-brand-dark dark:text-white">
          {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
        </h2>
        <p className="mt-1 text-sm text-brand-dark/65 dark:text-white/65">
          {isLogin
            ? "Ingresa para cotizar y guardar favoritos."
            : "Regístrate para acceder a precios y pedidos mayoristas."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label
              htmlFor="auth-name"
              className="mb-1.5 block text-sm font-medium text-brand-dark dark:text-white"
            >
              Nombre completo
            </label>
            <input
              id="auth-name"
              name="name"
              type="text"
              required={!isLogin}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className={fieldClass}
              placeholder="Tu nombre"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="auth-email"
            className="mb-1.5 block text-sm font-medium text-brand-dark dark:text-white"
          >
            Correo electrónico
          </label>
          <input
            id="auth-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className={fieldClass}
            placeholder="correo@empresa.com"
          />
        </div>

        <div>
          <label
            htmlFor="auth-password"
            className="mb-1.5 block text-sm font-medium text-brand-dark dark:text-white"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="auth-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className={`${fieldClass} pr-11`}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-brand-dark/50 transition hover:text-brand-primary dark:text-white/50"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div>
            <label
              htmlFor="auth-confirm"
              className="mb-1.5 block text-sm font-medium text-brand-dark dark:text-white"
            >
              Confirmar contraseña
            </label>
            <input
              id="auth-confirm"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required={!isLogin}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className={fieldClass}
              placeholder="Repite tu contraseña"
            />
          </div>
        )}

        {isLogin && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-brand-primary hover:underline"
              onClick={() =>
                setMessage(
                  "La recuperación de contraseña se conectará más adelante.",
                )
              }
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        {message && (
          <p
            role="status"
            className="rounded-xl border border-brand-primary/30 bg-brand-primary/10 px-3 py-2 text-sm text-brand-dark dark:text-white"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-primary bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(18,126,201,0.35)] transition hover:border-brand-dark hover:bg-brand-dark"
        >
          {isLogin ? (
            <>
              <LogIn className="h-4 w-4" strokeWidth={2} />
              Entrar
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" strokeWidth={2} />
              Crear cuenta
            </>
          )}
        </button>

        <button
          type="button"
          onClick={closeAuth}
          className="w-full rounded-xl border-2 border-brand-primary/50 bg-transparent px-4 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/10"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
