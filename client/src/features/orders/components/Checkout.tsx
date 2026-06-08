import { cartTotal } from "../../cart/lib/cartTotal";
import { formatSize } from "../../../shared/lib/formatSize";
import { useCart } from "../../cart/hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";
import PaymentForm from "./PaymentForm";
import styles from "../styling/Checkout.module.css";

type CartItem = NonNullable<
	ReturnType<typeof useCart>["data"]
>["items"][number];

function itemTotal(item: CartItem) {
	return item.variant.product.price * item.quantity;
}

export default function Checkout() {
	const { data: cart, isPending, error } = useCart();
	const place = useCheckout();

	if (isPending) return <p>Loading…</p>;
	if (error) return <p role="alert">{error.message}</p>;
	if (cart.items.length === 0) return <p>Your cart is empty.</p>;

	const total = cartTotal(cart.items);

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Checkout</h1>
			<div className={styles.layout}>
				<section>
					<h2 className={styles.sectionTitle}>Order summary</h2>
					<ul className={styles.orderList}>
						{cart.items.map((item) => (
							<li key={item.id} className={styles.orderItem}>
								{item.variant.product.name} — {formatSize(item.variant)} ×{" "}
								{item.quantity} — {itemTotal(item).toLocaleString()} kr
							</li>
						))}
					</ul>
					<strong className={styles.total}>
						Total: {total.toLocaleString()} kr
					</strong>
				</section>
				<section>
					<h2 className={styles.sectionTitle}>Payment details</h2>
					<PaymentForm onSubmit={place.mutate} isPending={place.isPending} />
				</section>
			</div>
		</div>
	);
}
