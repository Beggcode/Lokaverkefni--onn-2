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

export class ApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ApiError";
	}
}

export async function apiFetchJson<T>(
	schema: z.ZodType<T>,
	path: string,
	init?: ApiFetchInit,
): Promise<T> {
	const res = await apiFetch(path, init);
	let json: Record<string, unknown> = {};
	try {
		json = (await res.json()) as Record<string, unknown>;
	} catch {
		if (!res.ok) throw new ApiError("Something went wrong. Please try again.");
	}
	if (!res.ok)
		throw new ApiError(
			typeof json.error === "string"
				? json.error
				: "Something went wrong. Please try again.",
		);
	return schema.parse(json);
}
