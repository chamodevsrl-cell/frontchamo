"use server";

import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  parseAdminSession,
  serializeAdminSession,
} from "@/lib/auth";
import {
  createProduct,
  createRole,
  createUnit,
  createUser,
  createCategory,
  deleteProduct,
  deleteUnit,
  deleteUser,
  loginAdmin,
  updateCategory,
  updateOrderStatus,
  updateOwnProfile,
  updateProduct,
  updateUser,
  updateUserStatus,
  verifyAdminSession,
} from "@/services/adminApi";
import type {
  AuthSession,
  Category,
  CreateCategoryInput,
  CreateMeasurementUnitInput,
  CreatePanelRoleInput,
  CreatePanelUserInput,
  CreateProductInput,
  LoginCredentials,
  MeasurementUnit,
  Order,
  OrderStatus,
  PanelRole,
  PanelUser,
  PanelUserStatus,
  Product,
  UpdateCategoryInput,
  UpdateOwnProfileInput,
  UpdatePanelUserInput,
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

/**
 * Comprueba en el servidor la sesión del panel (cookie). La tienda solo muestra
 * "Administrar" si esto devuelve `ok`; una copia vieja en localStorage no basta.
 */
export async function verifyAdminSessionAction(): Promise<
  { ok: true; session: AuthSession } | { ok: false }
> {
  const store = await cookies();
  const current = parseAdminSession(store.get(ADMIN_SESSION_COOKIE)?.value);
  if (!current) return { ok: false };
  try {
    const session = await verifyAdminSession(current.token);
    return { ok: true, session };
  } catch {
    store.delete(ADMIN_SESSION_COOKIE);
    return { ok: false };
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
  input: UpdateProductInput,
): Promise<{ ok: true; product: Product } | { ok: false; message: string }> {
  try {
    const product = await updateProduct(productId, input);
    return { ok: true, product };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo actualizar el producto.";
    return { ok: false, message };
  }
}

export async function deleteProductAction(
  productId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await deleteProduct(productId);
    return { ok: true };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo borrar el producto.";
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

export async function createUnitAction(
  input: CreateMeasurementUnitInput,
): Promise<{ ok: true; unit: MeasurementUnit } | { ok: false; message: string }> {
  try {
    const unit = await createUnit(input);
    return { ok: true, unit };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo crear la unidad.";
    return { ok: false, message };
  }
}

export async function deleteUnitAction(
  unitId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await deleteUnit(unitId);
    return { ok: true };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo borrar la unidad.";
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

export async function updateOwnProfileAction(
  userId: string,
  input: UpdateOwnProfileInput,
): Promise<{ ok: true; session: AuthSession } | { ok: false; message: string }> {
  try {
    const session = await updateOwnProfile(userId, input);
    await setAdminSessionCookie(session);
    return { ok: true, session };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo guardar el perfil.";
    return { ok: false, message };
  }
}

export async function updateUserAction(
  userId: string,
  input: UpdatePanelUserInput,
): Promise<{ ok: true; user: PanelUser } | { ok: false; message: string }> {
  try {
    const user = await updateUser(userId, input);
    return { ok: true, user };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo actualizar el usuario.";
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

export async function deleteUserAction(
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await deleteUser(userId);
    return { ok: true };
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "No se pudo borrar el usuario.";
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
