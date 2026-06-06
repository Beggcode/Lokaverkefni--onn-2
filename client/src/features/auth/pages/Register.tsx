import { Link } from "@tanstack/react-router";
import RegisterForm from "../components/RegisterForm";
import { useOnAuthSuccess } from "../hooks/useOnAuthSuccess";
import { Route } from "./register.route";

export default function Register() {
	const { redirect } = Route.useSearch();
	const onSuccess = useOnAuthSuccess(redirect, (name) => `Welcome, ${name}!`);

	return (
		<>
			<RegisterForm onSuccess={onSuccess} />
			<Link to="/login">Already have an account? Login</Link>
		</>
	);
}
