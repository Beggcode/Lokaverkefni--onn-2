import { describe, it, expect } from "vitest";
import { addToCartSchema, updateCartItemSchema } from "@ntv/shared";

describe("adding an item to the cart", () => {
  it("works when variantId and quantity are provided", () => {
    const result = addToCartSchema.safeParse({ variantId: 1, quantity: 2 });
    expect(result.success).toBe(true);
  });

  it("fails if quantity is 0", () => {
    const result = addToCartSchema.safeParse({ variantId: 1, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("fails if no variantId is given", () => {
    const result = addToCartSchema.safeParse({ quantity: 1 });
    expect(result.success).toBe(false);
  });
});

describe("updating a cart item quantity", () => {
  it("works with a valid quantity", () => {
    const result = updateCartItemSchema.safeParse({ quantity: 3 });
    expect(result.success).toBe(true);
  });

  it("fails if quantity is 0", () => {
    const result = updateCartItemSchema.safeParse({ quantity: 0 });
    expect(result.success).toBe(false);
  });
});

describe("cart total", () => {
  const items = [
    { quantity: 2, variant: { product: { price: 18900 } } },
    { quantity: 1, variant: { product: { price: 54900 } } },
  ];

  it("sums up all items correctly", () => {
    let total = 0;
    for (const item of items) {
      total += item.variant.product.price * item.quantity;
    }
    expect(total).toBe(92700);
  });

  it("is 0 when the cart is empty", () => {
    let total = 0;
    for (const item of [] as typeof items) {
      total += item.variant.product.price * item.quantity;
    }
    expect(total).toBe(0);
  });
});
