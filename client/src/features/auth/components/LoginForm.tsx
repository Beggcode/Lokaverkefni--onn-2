import { loginSchema, type User } from "@ntv/shared";
import { useForm } from "@tanstack/react-form";
import FieldError from "../../../shared/components/FieldError";
import SubmitButton from "../../../shared/components/SubmitButton";
import { createFormValidators } from "../../../shared/lib/createFormValidators";
import { handleFormSubmit } from "../lib/formSubmit";
import { useToast } from "../../../shared/hooks/useToast";
import { errorMessage } from "../../../shared/lib/errorMessage";
import { loginUser } from "../services/auth";

type Props = { onSuccess: (user: User) => void };

const validators = createFormValidators(loginSchema);

export default function LoginForm({ onSuccess }: Props) {
	const showToast = useToast();

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			try {
				const user = await loginUser(value.email, value.password);
				onSuccess(user);
			} catch (err) {
				showToast(errorMessage(err), "error");
			}
		},
	});

	return (
		<form onSubmit={(e) => handleFormSubmit(e, form.handleSubmit)}>
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
			<form.Subscribe selector={(s) => s.isSubmitting}>
				{(isSubmitting) => (
					<SubmitButton
						isSubmitting={isSubmitting}
						label="Login"
						loadingLabel="Logging in…"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
