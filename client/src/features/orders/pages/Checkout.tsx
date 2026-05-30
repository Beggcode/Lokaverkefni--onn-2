import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import {
  formatCreditCard,
  getCreditCardType,
  formatDate,
  registerCursorTracker,
  DefaultCreditCardDelimiter,
} from 'cleave-zen'
import { getCart } from '../../cart/cart'
import { checkout } from '../orders'

const now = new Date()
const currentYear = now.getFullYear() % 100
const currentMonth = now.getMonth() + 1

const checkoutFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cardNumber: z.string().regex(/^(\d{4} ){3}\d{4}$/, 'Enter a valid 16-digit card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Expiry must be MM/YY').refine((val) => {
    const [mm, yy] = val.split('/').map(Number)
    if (mm < 1 || mm > 12) return false
    if (yy > currentYear) return true
    if (yy === currentYear && mm >= currentMonth) return true
    return false
  }, 'Card has expired or invalid date'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
})

export default function Checkout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: cart, isPending, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const [form, setForm] = useState({ name: '', cardNumber: '', expiry: '', cvv: '' })
  const [cardType, setCardType] = useState('')
  const [formError, setFormError] = useState('')
  const cardInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!cardInputRef.current) return
    return registerCursorTracker({ input: cardInputRef.current, delimiter: DefaultCreditCardDelimiter })
  }, [])

  const place = useMutation({
    mutationFn: checkout,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      navigate({ to: '/orders/$orderId', params: { orderId: String(order.id) } })
    },
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>
  if (cart.items.length === 0) return <p>Your cart is empty.</p>

  const total = cart.items.reduce((sum, item) => sum + item.variant.product.price * item.quantity, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    const result = checkoutFormSchema.safeParse(form)
    if (!result.success) {
      setFormError(result.error.issues[0].message)
      return
    }
    place.mutate()
  }

  return (
    <div>
      <h1>Checkout</h1>

      <section>
        <h2>Order summary</h2>
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.variant.product.name} — {item.variant.size ?? ''}{item.variant.color ? ` / ${item.variant.color}` : ''} × {item.quantity} — {(item.variant.product.price * item.quantity).toLocaleString()} kr
            </li>
          ))}
        </ul>
        <strong>Total: {total.toLocaleString()} kr</strong>
      </section>

      <section>
        <h2>Payment details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name on card
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Card number {cardType && <span>({cardType})</span>}
            <input
              ref={cardInputRef}
              required
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={form.cardNumber}
              onChange={(e) => {
                const formatted = formatCreditCard(e.target.value)
                setCardType(getCreditCardType(e.target.value))
                setForm({ ...form, cardNumber: formatted })
              }}
            />
          </label>
          <label>
            Expiry
            <input
              required
              maxLength={5}
              placeholder="MM/YY"
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: formatDate(e.target.value, { datePattern: ['m', 'y'] }) })}
            />
          </label>
          <label>
            CVV
            <input
              required
              maxLength={4}
              placeholder="123"
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value })}
            />
          </label>

          {formError && <p role="alert">{formError}</p>}
          {place.error && <p role="alert">{place.error.message}</p>}

          <button type="submit" disabled={place.isPending}>
            {place.isPending ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </section>
    </div>
  )
}
