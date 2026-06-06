import { z } from "zod";
import { fieldValidator } from "./fieldValidator";

type ValidatorMap<T extends z.ZodRawShape> = {
	[K in keyof T]: ReturnType<typeof fieldValidator>;
};

export function createFormValidators<T extends z.ZodRawShape>(
	schema: z.ZodObject<T>,
): ValidatorMap<T> {
	const validators = {} as ValidatorMap<T>;

	for (const [key, field] of Object.entries(schema.shape)) {
		validators[key as keyof T] = fieldValidator(field as z.ZodTypeAny);
	}

	return validators;
}
