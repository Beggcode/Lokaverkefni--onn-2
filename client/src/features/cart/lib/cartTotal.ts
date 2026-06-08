type CartItem = {
	quantity: number;
	variant: { product: { price: number } };
};

export function cartTotal(items: CartItem[]): number {
	let total = 0;
	for (const item of items) {
		total += item.variant.product.price * item.quantity;
	}
	return total;
}
