import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const recentProductSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const recentProductsSchema = z.array(recentProductSchema);

type RecentProduct = z.infer<typeof recentProductSchema>;

type RecentlyViewedStore = {
	items: RecentProduct[];
	add: (product: RecentProduct) => void;
};

const MAX_ITEMS = 5;

export const useRecentlyViewed = create<RecentlyViewedStore>()(
	persist(
		(set) => ({
			items: [],
			add: (product) =>
				set((state) => {
					const filtered = state.items.filter((p) => p.id !== product.id);
					return { items: [product, ...filtered].slice(0, MAX_ITEMS) };
				}),
		}),
		{
			name: "recently-viewed",
			merge: (persisted, current) => {
				const result = z
					.object({ items: recentProductsSchema })
					.safeParse(persisted);
				return { ...current, items: result.success ? result.data.items : [] };
			},
		},
	),
);
