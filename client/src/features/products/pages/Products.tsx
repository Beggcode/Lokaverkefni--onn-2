import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
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
          <Link to="/products/$productId" params={{ productId: String(p.id) }}>
            <strong>{p.name}</strong>
          </Link>
          {' '}— {p.category.name} — {p.price} kr
        </li>
      ))}
    </ul>
  )
}
