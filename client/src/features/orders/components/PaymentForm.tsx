import {
	DefaultCreditCardDelimiter,
	formatCreditCard,
	formatDate,
	getCreditCardType,
	registerCursorTracker,
} from "cleave-zen";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { checkoutFormSchema } from "../lib/checkoutSchema";
import styles from "../styling/PaymentForm.module.css";

type Props = {
	onSubmit: () => void;
	isPending: boolean;
};

export default function PaymentForm({ onSubmit, isPending }: Props) {
	const [form, setForm] = useState({
		name: "",
		cardNumber: "",
		expiry: "",
		cvv: "",
	});
	const [cardType, setCardType] = useState("");
	const [formError, setFormError] = useState("");
	const cardInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!cardInputRef.current) return;
		return registerCursorTracker({
			input: cardInputRef.current,
			delimiter: DefaultCreditCardDelimiter,
		});
	}, []);

	function setField<K extends keyof typeof form>(key: K, value: string) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	function handleCardNumber(e: ChangeEvent<HTMLInputElement>) {
		setCardType(getCreditCardType(e.target.value));
		setField("cardNumber", formatCreditCard(e.target.value));
	}

	function handleExpiry(e: ChangeEvent<HTMLInputElement>) {
		setField("expiry", formatDate(e.target.value, { datePattern: ["m", "y"] }));
	}

	function handleSubmit(e: { preventDefault(): void }) {
		e.preventDefault();
		setFormError("");
		const result = checkoutFormSchema.safeParse(form);
		if (!result.success) {
			setFormError(result.error.issues[0].message);
			return;
		}
		onSubmit();
	}

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.field}>
				<label>Name on card</label>
				<input
					required
					value={form.name}
					onChange={(e) => setField("name", e.target.value)}
				/>
			</div>
			<div className={styles.field}>
				<label>Card number {cardType && <span>({cardType})</span>}</label>
				<input
					ref={cardInputRef}
					required
					maxLength={19}
					placeholder="1234 5678 9012 3456"
					value={form.cardNumber}
					onChange={handleCardNumber}
				/>
			</div>
			<div className={styles.row}>
				<div className={styles.field}>
					<label>Expiry</label>
					<input
						required
						maxLength={5}
						placeholder="MM/YY"
						value={form.expiry}
						onChange={handleExpiry}
					/>
				</div>
				<div className={styles.field}>
					<label>CVV</label>
					<input
						required
						maxLength={4}
						placeholder="123"
						value={form.cvv}
						onChange={(e) => setField("cvv", e.target.value)}
					/>
				</div>
			</div>
			{formError && (
				<p className={styles.error} role="alert">
					{formError}
				</p>
			)}
			<button
				className={styles.submitButton}
				type="submit"
				disabled={isPending}
			>
				{isPending ? "Placing order…" : "Place order"}
			</button>
		</form>
	);
}
