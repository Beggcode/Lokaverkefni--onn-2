import { Link, useNavigate } from "@tanstack/react-router";
import { Route } from "../pages/products.route";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
  const navigate = useNavigate({ from: "/products" });
  const { search, categoryId } = Route.useSearch();
  const { data: allProducts } = useProducts();
  const {
    data: products,
    isPending,
    error,
  } = useProducts({ search, categoryId });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;

  const categories = [
    ...new Map(
      (allProducts ?? products).map((p) => [p.category.id, p.category]),
    ).values(),
  ];

  function setSearch(value: string) {
    navigate({ search: (prev) => ({ ...prev, search: value || undefined }) });
  }

  function setCategory(value: string) {
    navigate({
      search: (prev) => ({
        ...prev,
        categoryId: value ? Number(value) : undefined,
      }),
    });
  }

  return (
    <div>
      <div>
        <input
          placeholder="Search products…"
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
            <Link
              to="/products/$productId"
              params={{ productId: String(p.id) }}
            >
              <strong>{p.name}</strong>
            </Link>{" "}
            — {p.category.name} — {p.price} kr
          </li>
        ))}
      </ul>
    </div>
  );
}
