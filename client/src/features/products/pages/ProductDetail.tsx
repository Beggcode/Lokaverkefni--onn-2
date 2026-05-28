import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Route } from './product.route'
import { getProduct } from '../products'
import { addToCart } from '../../cart/cart'
import type { Variant } from '@ntv/shared'

export default function ProductDetail() {
  const { productId } = Route.useParams()
  const queryClient = useQueryClient()

  const { data: product, isPending, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(Number(productId)),
  })

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)

  const add = useMutation({
    mutationFn: () => addToCart(selectedVariant!.id, quantity),
    onSuccess: (updated) => queryClient.setQueryData(['cart'], updated),
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>

  const variant = selectedVariant ?? product.variants[0]
  const maxQty = variant?.stock ?? 1

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.category.name} — {product.season}</p>
      {product.description && <p>{product.description}</p>}
      <p><strong>{product.price} kr</strong></p>

      {product.variants.length > 0 && (
        <div>
          <label htmlFor="variant">Variant</label>
          <select
            id="variant"
            value={variant?.id}
            onChange={(e) => {
              const v = product.variants.find((v) => v.id === Number(e.target.value))
              if (v) { setSelectedVariant(v); setQuantity(1) }
            }}
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id} disabled={v.stock === 0}>
                {[v.size, v.color].filter(Boolean).join(' / ')} {v.stock === 0 ? '(out of stock)' : `(${v.stock} left)`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={maxQty}
          value={quantity}
          onChange={(e) => setQuantity(Math.min(Number(e.target.value), maxQty))}
        />
      </div>

      {add.isSuccess && <p>Added to cart!</p>}
      {add.isError && <p role="alert">{add.error.message}</p>}

      <button
        onClick={() => add.mutate()}
        disabled={add.isPending || !variant || variant.stock === 0}
      >
        {add.isPending ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  )
}
