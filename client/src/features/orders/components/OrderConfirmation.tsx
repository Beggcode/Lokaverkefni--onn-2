import { Link, useParams } from "@tanstack/react-router";
import { formatSize } from "../../../shared/lib/formatSize";
import { useOrder } from "../hooks/useOrder";
import styles from "../styling/OrderConfirmation.module.css";

export default function OrderConfirmation() {
	const { orderId } = useParams({ from: "/orders/$orderId" });
	const { data: order, isPending, error } = useOrder(Number(orderId));

	if (isPending) return <p>Loading…</p>;
	if (error) return <p role="alert">{error.message}</p>;

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Order confirmed!</h1>
			<p className={styles.subtitle}>Thank you for your order.</p>
			<div className={styles.summary}>
				<h2 className={styles.sectionTitle}>Order summary</h2>
				<ul className={styles.list}>
					{order.items.map((item) => (
						<li key={item.id} className={styles.listItem}>
							{item.variant.product.name} — {formatSize(item.variant)} ×{" "}
							{item.quantity} — {(item.price * item.quantity).toLocaleString()}{" "}
							kr
						</li>
					))}
				</ul>
				<strong className={styles.total}>
					Total: {order.total.toLocaleString()} kr
				</strong>
			</div>
			<Link to="/products" className={styles.continueLink}>
				Continue shopping
			</Link>
		</div>
	);
}
