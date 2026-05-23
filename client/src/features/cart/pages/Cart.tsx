import { useQuery } from '@tanstack/react-query'
import { getCart } from '../cart'

export default function Cart() {
  const { data: cart, isPending, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>
  if (cart.items.length === 0) return <p>Your cart is empty.</p>

  return (
    <ul>
      {cart.items.map((item) => (
        <li key={item.id}>
          <strong>{item.variant.product.name}</strong> — {item.variant.size} / {item.variant.color} — {item.quantity} x {item.variant.product.price} kr
        </li>
      ))}
    </ul>
  )
}
