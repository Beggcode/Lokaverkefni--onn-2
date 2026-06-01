import { Link, useParams } from "@tanstack/react-router";
import { formatVariant } from "../../../shared/lib/formatVariant";
import { useOrder } from "../hooks/useOrder";

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const { data: order, isPending, error } = useOrder(Number(orderId));

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;

  return (
    <div>
      <h1>Order confirmed!</h1>
      <p>Thank you for your order!</p>
      <section>
        <h2>Order summary</h2>
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>
              {item.variant.product.name} — {formatVariant(item.variant)} ×{" "}
              {item.quantity} — {(item.price * item.quantity).toLocaleString()}{" "}
              kr
            </li>
          ))}
        </ul>
        <strong>Total: {order.total.toLocaleString()} kr</strong>
      </section>
      <Link to="/products">Continue shopping</Link>
    </div>
  );
}
