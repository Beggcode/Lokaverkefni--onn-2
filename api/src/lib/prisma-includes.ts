export const cartItemsInclude = {
	items: {
		include: {
			variant: {
				include: {
					product: { include: { category: true, variants: true } },
				},
			},
		},
	},
} as const;

export const cartCheckoutInclude = {
	items: {
		include: {
			variant: {
				include: { product: true },
			},
		},
	},
} as const;
