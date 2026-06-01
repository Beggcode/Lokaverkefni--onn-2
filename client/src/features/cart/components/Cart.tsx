import { Link } from "@tanstack/react-router";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const { data: cart, isPending, error, remove, update } = useCart();

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;
  if (cart.items.length === 0) return <p>Your cart is empty.</p>;

  const busy = remove.isPending || update.isPending;

  return (
    <div>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            <span>
              <strong>{item.variant.product.name}</strong> — {item.variant.size}{" "}
              / {item.variant.color} — {item.variant.product.price} kr
            </span>
            <button
              onClick={() =>
                update.mutate({ itemId: item.id, quantity: item.quantity - 1 })
              }
              disabled={busy || item.quantity <= 1}
            >
              −
            </button>
            {item.quantity}
            <button
              onClick={() =>
                update.mutate({ itemId: item.id, quantity: item.quantity + 1 })
              }
              disabled={busy || item.quantity >= item.variant.stock}
            >
              +
            </button>
            <button onClick={() => remove.mutate(item.id)} disabled={busy}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <Link to="/checkout">Proceed to checkout</Link>
    </div>
  );
}
