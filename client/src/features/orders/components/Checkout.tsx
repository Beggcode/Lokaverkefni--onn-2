import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import {
  formatCreditCard,
  getCreditCardType,
  formatDate,
  registerCursorTracker,
  DefaultCreditCardDelimiter,
} from "cleave-zen";
import cardValidator from "card-validator";
import { formatVariant } from "../../../shared/lib/formatVariant";
import { useCart } from "../../cart/hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";

const checkoutFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    cardNumber: z
      .string()
      .refine(
        (val) => cardValidator.number(val).isValid,
        "Enter a valid card number",
      ),
    expiry: z
      .string()
      .refine(
        (val) => cardValidator.expirationDate(val).isValid,
        "Invalid or expired date",
      ),
    cvv: z.string().min(1, "CVV is required"),
  })
  .superRefine((data, ctx) => {
    const cvvLength = cardValidator.number(data.cardNumber).card?.code.size;
    if (!cardValidator.cvv(data.cvv, cvvLength).isValid) {
      ctx.addIssue({ code: "custom", message: "Invalid CVV", path: ["cvv"] });
    }
  });

export default function Checkout() {
  const { data: cart, isPending, error } = useCart();
  const place = useCheckout();

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

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;
  if (cart.items.length === 0) return <p>Your cart is empty.</p>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.variant.product.price * item.quantity,
    0,
  );

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const result = checkoutFormSchema.safeParse(form);
    if (!result.success) {
      setFormError(result.error.issues[0].message);
      return;
    }
    place.mutate();
  }

  return (
    <div>
      <h1>Checkout</h1>
      <section>
        <h2>Order summary</h2>
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.variant.product.name} — {formatVariant(item.variant)} ×{" "}
              {item.quantity} —{" "}
              {(item.variant.product.price * item.quantity).toLocaleString()} kr
            </li>
          ))}
        </ul>
        <strong>Total: {total.toLocaleString()} kr</strong>
      </section>
      <section>
        <h2>Payment details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name on card
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Card number {cardType && <span>({cardType})</span>}
            <input
              ref={cardInputRef}
              required
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={form.cardNumber}
              onChange={(e) => {
                const formatted = formatCreditCard(e.target.value);
                setCardType(getCreditCardType(e.target.value));
                setForm({ ...form, cardNumber: formatted });
              }}
            />
          </label>
          <label>
            Expiry
            <input
              required
              maxLength={5}
              placeholder="MM/YY"
              value={form.expiry}
              onChange={(e) =>
                setForm({
                  ...form,
                  expiry: formatDate(e.target.value, {
                    datePattern: ["m", "y"],
                  }),
                })
              }
            />
          </label>
          <label>
            CVV
            <input
              required
              maxLength={4}
              placeholder="123"
              value={form.cvv}
              onChange={(e) => setForm({ ...form, cvv: e.target.value })}
            />
          </label>
          {formError && <p role="alert">{formError}</p>}
          {place.error && <p role="alert">{place.error.message}</p>}
          <button type="submit" disabled={place.isPending}>
            {place.isPending ? "Placing order…" : "Place order"}
          </button>
        </form>
      </section>
    </div>
  );
}
