import { describe, it, expect } from "vitest";
import { checkoutFormSchema } from "./checkoutSchema";

const valid = {
	name: "Test User",
	cardNumber: "4111 1111 1111 1111",
	expiry: "12/26",
	cvv: "123",
};

describe("checkoutFormSchema", () => {
	it("accepts a valid card", () => {
		expect(checkoutFormSchema.safeParse(valid).success).toBe(true);
	});

	it("rejects an empty name", () => {
		const result = checkoutFormSchema.safeParse({ ...valid, name: "" });
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toBe("Name is required");
	});

	it("rejects an invalid card number", () => {
		const result = checkoutFormSchema.safeParse({
			...valid,
			cardNumber: "1234 5678 9012 3456",
		});
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toBe("Enter a valid card number");
	});

	it("rejects an expired date", () => {
		const result = checkoutFormSchema.safeParse({ ...valid, expiry: "01/20" });
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toBe("Invalid or expired date");
	});

	it("rejects a wrong CVV", () => {
		const result = checkoutFormSchema.safeParse({ ...valid, cvv: "99" });
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toBe("Invalid CVV");
	});
});
