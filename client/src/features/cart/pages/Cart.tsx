import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCart, removeFromCart } from '../cart'

export default function Cart() {
  const queryClient = useQueryClient()
  const { data: cart, isPending, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const remove = useMutation({
    mutationFn: removeFromCart,
    onSuccess: (updated) => queryClient.setQueryData(['cart'], updated),
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>
  if (cart.items.length === 0) return <p>Your cart is empty.</p>

  return (
    <ul>
      {cart.items.map((item) => (
        <li key={item.id}>
          <strong>{item.variant.product.name}</strong> — {item.variant.size} / {item.variant.color} — {item.quantity} x {item.variant.product.price} kr
          <button onClick={() => remove.mutate(item.id)} disabled={remove.isPending}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
