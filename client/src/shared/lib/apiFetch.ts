import { z } from "zod";

export async function apiFetch(path: string, init?: RequestInit) {
  return fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
}

export async function apiFetchJson<T>(
  schema: z.ZodType<T>,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await apiFetch(path, init);
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok)
    throw new Error(
      typeof json.error === "string" ? json.error : "Request failed",
    );
  return schema.parse(json);
}
