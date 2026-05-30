import { orderSchema, orderListSchema } from '@ntv/shared'
import { apiFetchJson } from '../../shared/lib/apiFetch'

export type { Order, OrderItem } from '@ntv/shared'

export async function checkout() {
  const data = await apiFetchJson<{ order: unknown }>('/api/orders', { method: 'POST' })
  return orderSchema.parse(data.order)
}

export async function getOrder(id: number) {
  const data = await apiFetchJson<{ order: unknown }>(`/api/orders/${id}`)
  return orderSchema.parse(data.order)
}

export async function getOrders() {
  const data = await apiFetchJson<{ orders: unknown }>('/api/orders')
  return orderListSchema.parse(data.orders)
}
