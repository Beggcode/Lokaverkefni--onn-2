import { userResponseSchema, type User } from "@ntv/shared";
import { apiFetch, apiFetchJson } from "../../../shared/lib/apiFetch";

export type { User };

export async function loginUser(email: string, password: string) {
  const data = await apiFetchJson(userResponseSchema, "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const data = await apiFetchJson(userResponseSchema, "/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return data.user;
}

export async function logoutUser() {
  await apiFetch("/api/auth/logout", { method: "POST" });
}

export async function fetchMe(): Promise<User | null> {
  try {
    const data = await apiFetchJson(userResponseSchema, "/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}
