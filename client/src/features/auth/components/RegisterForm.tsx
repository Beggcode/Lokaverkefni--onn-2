import { registerSchema, type User } from "@ntv/shared";
import { useForm } from "@tanstack/react-form";
import FieldError from "../../../shared/components/FieldError";
import { useToast } from "../../../shared/hooks/useToast";
import { createFormValidators } from "../../../shared/lib/createFormValidators";
import { handleError } from "../../../shared/lib/handleError";
import { handleFormSubmit } from "../lib/formSubmit";
import { registerUser } from "../services/auth";
import styles from "../styling/Auth.module.css";

type Props = { onSuccess: (user: User) => void };

const validators = createFormValidators(registerSchema);

export default function RegisterForm({ onSuccess }: Props) {
	const showToast = useToast();

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		onSubmit: async ({ value }) => {
			try {
				const user = await registerUser(
					value.name,
					value.email,
					value.password,
				);
				onSuccess(user);
			} catch (err) {
				handleError(err as Error, showToast);
			}
		},
	});

	return (
		<form
			className={styles.form}
			onSubmit={(e) => handleFormSubmit(e, form.handleSubmit)}
		>
			<form.Field name="name" validators={validators.name}>
				{({ state, handleChange }) => (
					<div className={styles.field}>
						<input
							className={styles.input}
							placeholder="Name"
							value={state.value}
							onChange={(e) => handleChange(e.target.value)}
						/>
						<FieldError errors={state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="email" validators={validators.email}>
				{({ state, handleChange }) => (
					<div className={styles.field}>
						<input
							className={styles.input}
							type="email"
							placeholder="Email"
							value={state.value}
							onChange={(e) => handleChange(e.target.value)}
						/>
						<FieldError errors={state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="password" validators={validators.password}>
				{({ state, handleChange }) => (
					<div className={styles.field}>
						<input
							className={styles.input}
							type="password"
							placeholder="Password"
							value={state.value}
							onChange={(e) => handleChange(e.target.value)}
						/>
						<FieldError errors={state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Subscribe selector={(s) => s.isSubmitting}>
				{(isSubmitting) => (
					<button
						className={styles.submit}
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Registering…" : "Register"}
					</button>
				)}
			</form.Subscribe>
		</form>
	);
}
