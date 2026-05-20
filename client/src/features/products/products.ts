import { productListSchema } from '@ntv/shared'

export type { Product } from '@ntv/shared'

export async function getProducts() {
  const res = await fetch('/api/products', { credentials: 'include' })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to fetch products')
  return productListSchema.parse(data.products)
}
