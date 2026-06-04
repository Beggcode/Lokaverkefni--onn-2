const STORAGE_KEY = "recently-viewed";
const MAX_ITEMS = 5;

type RecentProduct = { id: number; name: string };

function getStored(): RecentProduct[] {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
	} catch {
		return [];
	}
}

export function addRecentlyViewed(product: RecentProduct) {
	const existing = getStored().filter((p) => p.id !== product.id);
	const updated = [product, ...existing].slice(0, MAX_ITEMS);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getRecentlyViewed(): RecentProduct[] {
	return getStored();
}
