import { productListSchema } from '@ntv/shared'
import { apiFetchJson } from '../../shared/lib/apiFetch'

export type { Product } from '@ntv/shared'

export async function getProducts() {
  const data = await apiFetchJson<{ products: unknown }>('/api/products')
  return productListSchema.parse(data.products)
}
