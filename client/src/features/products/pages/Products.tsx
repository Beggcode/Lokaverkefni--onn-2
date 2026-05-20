import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../index'

export default function Products() {
  const { data: products, isPending, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })

  if (isPending) return <p>Loading…</p>
  if (error) return <p role="alert">{error.message}</p>

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          <strong>{p.name}</strong> — {p.category.name} — ${p.price}
        </li>
      ))}
    </ul>
  )
}
