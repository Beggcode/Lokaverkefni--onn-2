import { Link } from "@tanstack/react-router";
import { useCart } from "../hooks/useCart";
import styles from "../styling/Cart.module.css";

export default function Cart() {
	const { data: cart, isPending, error, remove, update } = useCart();

	if (isPending) return <p>Loading…</p>;
	if (error) return <p role="alert">{error.message}</p>;
	if (cart.items.length === 0)
		return (
			<div className={styles.container}>
				<p className={styles.empty}>Your cart is empty.</p>
			</div>
		);

	const busy = remove.isPending || update.isPending;

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Your Cart</h1>
			<ul className={styles.list}>
				{cart.items.map((item) => (
					<li key={item.id} className={styles.item}>
						<div className={styles.itemInfo}>
							<div className={styles.itemName}>
								{item.variant.product.name} — {item.variant.size}
							</div>
							<div className={styles.itemPrice}>
								{item.variant.product.price.toLocaleString()} kr
							</div>
						</div>
						<div className={styles.controls}>
							<button
								className={styles.qtyButton}
								onClick={() =>
									update.mutate({
										itemId: item.id,
										quantity: item.quantity - 1,
									})
								}
								disabled={busy || item.quantity <= 1}
							>
								−
							</button>
							<span className={styles.qty}>{item.quantity}</span>
							<button
								className={styles.qtyButton}
								onClick={() =>
									update.mutate({
										itemId: item.id,
										quantity: item.quantity + 1,
									})
								}
								disabled={busy || item.quantity >= item.variant.stock}
							>
								+
							</button>
							<button
								className={styles.removeButton}
								onClick={() => remove.mutate(item.id)}
								disabled={busy}
							>
								Remove
							</button>
						</div>
					</li>
				))}
			</ul>
			<div className={styles.footer}>
				<Link to="/checkout" className={styles.checkoutLink}>
					Proceed to checkout
				</Link>
			</div>
		</div>
	);
}
