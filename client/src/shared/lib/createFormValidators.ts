import { z } from "zod";
import { fieldValidator, fieldValidatorStrict } from "./fieldValidator";

type ValidatorMap<T extends z.ZodRawShape> = {
	[K in keyof T]: {
		onChange: ReturnType<typeof fieldValidator>;
		onSubmit: ReturnType<typeof fieldValidatorStrict>;
	};
};

export function createFormValidators<T extends z.ZodRawShape>(
	schema: z.ZodObject<T>,
): ValidatorMap<T> {
	const validators = {} as ValidatorMap<T>;

	for (const [key, field] of Object.entries(schema.shape)) {
		validators[key as keyof T] = {
			onChange: fieldValidator(field as z.ZodTypeAny),
			onSubmit: fieldValidatorStrict(field as z.ZodTypeAny),
		};
	}

	return validators;
}
