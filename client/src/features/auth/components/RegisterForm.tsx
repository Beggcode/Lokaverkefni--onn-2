import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { registerSchema, type User } from "@ntv/shared";
import { registerUser } from "../services/auth";
import { fieldValidator } from "../../../shared/lib/fieldValidator";
import { handleFormSubmit } from "../../../shared/lib/formSubmit";
import FieldError from "../../../shared/components/FieldError";
import SubmitButton from "../../../shared/components/SubmitButton";

type Props = { onSuccess: (user: User) => void };

const validators = {
	name: fieldValidator(registerSchema.shape.name),
	email: fieldValidator(registerSchema.shape.email),
	password: fieldValidator(registerSchema.shape.password),
};

export default function RegisterForm({ onSuccess }: Props) {
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		onSubmit: async ({ value }) => {
			setError(null);
			try {
				const user = await registerUser(
					value.name,
					value.email,
					value.password,
				);
				onSuccess(user);
			} catch (err) {
				setError((err as Error).message);
			}
		},
	});

	return (
		<form onSubmit={(e) => handleFormSubmit(e, form.handleSubmit)}>
			<form.Field name="name" validators={{ onChange: validators.name }}>
				{({ state, handleChange }) => (
					<>
						<input
							placeholder="Name"
							value={state.value}
							onChange={(e) => handleChange(e.target.value)}
						/>
						<FieldError errors={state.meta.errors} />
					</>
				)}
			</form.Field>
			<form.Field name="email" validators={{ onChange: validators.email }}>
				{({ state, handleChange }) => (
					<>
						<input
							type="email"
							placeholder="Email"
							value={state.value}
							onChange={(e) => handleChange(e.target.value)}
						/>
						<FieldError errors={state.meta.errors} />
					</>
				)}
			</form.Field>
			<form.Field
				name="password"
				validators={{ onChange: validators.password }}
			>
				{({ state, handleChange }) => (
					<>
						<input
							type="password"
							placeholder="Password"
							value={state.value}
							onChange={(e) => handleChange(e.target.value)}
						/>
						<FieldError errors={state.meta.errors} />
					</>
				)}
			</form.Field>
			{error && <p role="alert">{error}</p>}
			<form.Subscribe selector={(s) => s.isSubmitting}>
				{(isSubmitting) => (
					<SubmitButton
						isSubmitting={isSubmitting}
						label="Register"
						loadingLabel="Registering…"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
