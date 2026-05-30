import { cartSchema } from '@ntv/shared'
import { apiFetchJson } from '../../shared/lib/apiFetch'

export type { Cart, CartItem } from '@ntv/shared'

export async function getCart() {
  const data = await apiFetchJson<{ cart: unknown }>('/api/cart')
  return cartSchema.parse(data.cart)
}

export async function addToCart(variantId: number, quantity: number) {
  const data = await apiFetchJson<{ cart: unknown }>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ variantId, quantity }),
  })
  return cartSchema.parse(data.cart)
}

export async function removeFromCart(itemId: number) {
  const data = await apiFetchJson<{ cart: unknown }>(`/api/cart/items/${itemId}`, { method: 'DELETE' })
  return cartSchema.parse(data.cart)
}

export async function updateCartItem(itemId: number, quantity: number) {
  const data = await apiFetchJson<{ cart: unknown }>(`/api/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })
  return cartSchema.parse(data.cart)
}
