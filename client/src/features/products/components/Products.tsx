import { Link } from "@tanstack/react-router";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
  const { data: products, isPending, error } = useProducts();

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          <Link to="/products/$productId" params={{ productId: String(p.id) }}>
            <strong>{p.name}</strong>
          </Link>{" "}
          — {p.category.name} — {p.price} kr
        </li>
      ))}
    </ul>
  );
}
