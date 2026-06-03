import { Link, useNavigate } from "@tanstack/react-router";
import { Route } from "./register.route";
import { useAuthStore } from "../index";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();
	const setUser = useAuthStore((s) => s.setUser);

	return (
		<>
			<RegisterForm
				onSuccess={(user) => {
					setUser(user);
					navigate({ to: redirect });
				}}
			/>
			<Link to="/login">Already have an account? Login</Link>
		</>
	);
}
