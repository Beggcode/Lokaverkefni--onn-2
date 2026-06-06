import { Link } from "@tanstack/react-router";
import { useOnAuthSuccess } from "../hooks/useOnAuthSuccess";
import LoginForm from "../components/LoginForm";
import { Route } from "./login.route";

export default function Login() {
	const { redirect } = Route.useSearch();
	const onSuccess = useOnAuthSuccess(
		redirect,
		(name) => `Welcome back, ${name}!`,
	);

	return (
		<>
			<LoginForm onSuccess={onSuccess} />
			<Link to="/register">Register</Link>
		</>
	);
}
