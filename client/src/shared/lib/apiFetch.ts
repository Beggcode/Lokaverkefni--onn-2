import { z } from "zod";

type ApiFetchInit = RequestInit & { json?: unknown };

export async function apiFetch(path: string, init?: ApiFetchInit) {
	const { json, ...rest } = init ?? {};
	return fetch(path, {
		credentials: "include",
		headers: { "Content-Type": "application/json", ...rest.headers },
		...(json !== undefined && { body: JSON.stringify(json) }),
		...rest,
	});
}

export async function apiFetchJson<T>(
	schema: z.ZodType<T>,
	path: string,
	init?: ApiFetchInit,
): Promise<T> {
	const res = await apiFetch(path, init);
	const json = (await res.json()) as Record<string, unknown>;
	if (!res.ok)
		throw new Error(
			typeof json.error === "string" ? json.error : "Request failed",
		);
	return schema.parse(json);
}
