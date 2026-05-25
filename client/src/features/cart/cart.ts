import { cartSchema } from '@ntv/shared'
import { apiFetchJson } from '../../shared/lib/apiFetch'

export type { Cart, CartItem } from '@ntv/shared'

export async function getCart() {
  const data = await apiFetchJson<{ cart: unknown }>('/api/cart')
  return cartSchema.parse(data.cart)
}
