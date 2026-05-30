import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { getCart, removeFromCart, updateCartItem } from '../cart'

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

  const update = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: (updated) => queryClient.setQueryData(['cart'], updated),
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>
  if (cart.items.length === 0) return <p>Your cart is empty.</p>

  const busy = remove.isPending || update.isPending

  return (
    <div>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            <strong>{item.variant.product.name}</strong> — {item.variant.size} / {item.variant.color} — {item.variant.product.price} kr
            <button onClick={() => update.mutate({ itemId: item.id, quantity: item.quantity - 1 })} disabled={busy || item.quantity <= 1}>−</button>
            {item.quantity}
            <button onClick={() => update.mutate({ itemId: item.id, quantity: item.quantity + 1 })} disabled={busy || item.quantity >= item.variant.stock}>+</button>
            <button onClick={() => remove.mutate(item.id)} disabled={busy}>Remove</button>
          </li>
        ))}
      </ul>
      <Link to="/checkout">Proceed to checkout</Link>
    </div>
  )
}
