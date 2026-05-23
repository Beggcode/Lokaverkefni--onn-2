import { cartSchema } from '@ntv/shared'

export type { Cart, CartItem } from '@ntv/shared'

export async function getCart() {
  const res = await fetch('/api/cart', { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to fetch cart')
  return cartSchema.parse(data.cart)
}
