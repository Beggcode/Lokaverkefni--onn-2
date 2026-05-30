import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from '@tanstack/react-router'
import { getOrder } from '../orders'

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/orders/$orderId' })

  const { data: order, isPending, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(Number(orderId)),
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>

  return (
    <div>
      <h1>Order confirmed!</h1>
      <p>Thank you for your order. Your order number is <strong>#{order.id}</strong>.</p>

      <section>
        <h2>Order summary</h2>
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>
              {item.variant.product.name} — {item.variant.size ?? ''}{item.variant.color ? ` / ${item.variant.color}` : ''} × {item.quantity} — {(item.price * item.quantity).toLocaleString()} kr
            </li>
          ))}
        </ul>
        <strong>Total: {order.total.toLocaleString()} kr</strong>
      </section>

      <Link to="/products">Continue shopping</Link>
    </div>
  )
}
