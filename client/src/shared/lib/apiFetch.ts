export async function apiFetch(path: string, init?: RequestInit) {
	return fetch(path, {
		credentials: "include",
		headers: { "Content-Type": "application/json", ...init?.headers },
		...init,
	});
}

export async function apiFetchJson<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const res = await apiFetch(path, init);
	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? "Request failed");
	return data;
}
