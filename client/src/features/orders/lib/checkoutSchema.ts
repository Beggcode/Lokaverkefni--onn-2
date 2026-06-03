import { z } from "zod";
import cardValidator from "card-validator";

export const checkoutFormSchema = z
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

export type CheckoutForm = z.infer<typeof checkoutFormSchema>;
