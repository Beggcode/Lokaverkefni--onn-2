import { loginSchema, type User } from "@ntv/shared";
import { useForm } from "@tanstack/react-form";
import FieldError from "../../../shared/components/FieldError";
import SubmitButton from "../../../shared/components/SubmitButton";
import { fieldValidator } from "../../../shared/lib/fieldValidator";
import { handleFormSubmit } from "../../../shared/lib/formSubmit";
import { useToastStore } from "../../ui/store/toastStore";
import { loginUser } from "../services/auth";

type Props = { onSuccess: (user: User) => void };

const validators = {
	email: fieldValidator(loginSchema.shape.email),
	password: fieldValidator(loginSchema.shape.password),
};

export default function LoginForm({ onSuccess }: Props) {
	const showToast = useToastStore((s) => s.showToast);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			try {
				const user = await loginUser(value.email, value.password);
				onSuccess(user);
			} catch (err) {
				showToast((err as Error).message, "error");
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
