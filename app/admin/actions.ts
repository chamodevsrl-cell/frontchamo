"use server";

import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  serializeAdminSession,
} from "@/lib/auth";
import {
  createProduct,
  createRole,
  createUser,
  createCategory,
  loginAdmin,
  updateCategory,
  updateOrderStatus,
  updateProduct,
  updateUserStatus,
} from "@/services/adminApi";
import type {
  AuthSession,
  Category,
  CreateCategoryInput,
  CreatePanelRoleInput,
  CreatePanelUserInput,
  CreateProductInput,
  LoginCredentials,
  Order,
  OrderStatus,
  PanelRole,
  PanelUser,
  PanelUserStatus,
  Product,
  UpdateCategoryInput,
  UpdateProductInput,
} from "@/types/admin";

function cookieOptions() {
  return {
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    sameSite: "lax" as const,
    // TODO Backend: httpOnly: true, secure: true en producción.
    httpOnly: false,
  };
}

/** Escribe la cookie que `getAdminSession()` lee en el layout del panel. */
export async function setAdminSessionCookie(session: AuthSession): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, serializeAdminSession(session), cookieOptions());
}

/** Borra la cookie de sesión admin (Server Action). */
export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Login mock + Set-Cookie para que el layout del servidor vea la sesión
 * en el siguiente request. Devuelve un resultado plano (las clases de error
 * no cruzan bien el límite Server Action → cliente).
 */
export async function loginAdminAction(
  credentials: LoginCredentials,
): Promise<{ ok: true; session: AuthSession } | { ok: false; message: string }> {
  try {
    const session = await loginAdmin(credentials);
    await setAdminSessionCookie(session);
    return { ok: true, session };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo iniciar sesión.";
    return { ok: false, message };
  }
}

export async function createProductAction(
  productData: CreateProductInput,
): Promise<{ ok: true; product: Product } | { ok: false; message: string }> {
  try {
    const product = await createProduct(productData);
    return { ok: true, product };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo crear el producto.";
    return { ok: false, message };
  }
}

export async function updateProductAction(
  productId: string,
  productData: UpdateProductInput,
): Promise<{ ok: true; product: Product } | { ok: false; message: string }> {
  try {
    const product = await updateProduct(productId, productData);
    return { ok: true, product };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo actualizar el producto.";
    return { ok: false, message };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
): Promise<{ ok: true; order: Order } | { ok: false; message: string }> {
  try {
    const order = await updateOrderStatus(orderId, newStatus);
    return { ok: true, order };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo actualizar el pedido.";
    return { ok: false, message };
  }
}

export async function createRoleAction(
  input: CreatePanelRoleInput,
): Promise<{ ok: true; role: PanelRole } | { ok: false; message: string }> {
  try {
    const role = await createRole(input);
    return { ok: true, role };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "No se pudo crear el rol.";
    return { ok: false, message };
  }
}

export async function createUserAction(
  input: CreatePanelUserInput,
): Promise<{ ok: true; user: PanelUser } | { ok: false; message: string }> {
  try {
    const user = await createUser(input);
    return { ok: true, user };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo crear el usuario.";
    return { ok: false, message };
  }
}

export async function updateUserStatusAction(
  userId: string,
  newStatus: PanelUserStatus,
): Promise<{ ok: true; user: PanelUser } | { ok: false; message: string }> {
  try {
    const user = await updateUserStatus(userId, newStatus);
    return { ok: true, user };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo actualizar el usuario.";
    return { ok: false, message };
  }
}

export async function createCategoryAction(
  input: CreateCategoryInput,
): Promise<{ ok: true; category: Category } | { ok: false; message: string }> {
  try {
    const category = await createCategory(input);
    return { ok: true, category };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo crear la categoría.";
    return { ok: false, message };
  }
}

export async function updateCategoryAction(
  categoryId: string,
  input: UpdateCategoryInput,
): Promise<{ ok: true; category: Category } | { ok: false; message: string }> {
  try {
    const category = await updateCategory(categoryId, input);
    return { ok: true, category };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo actualizar la categoría.";
    return { ok: false, message };
  }
}
