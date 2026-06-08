import { Link } from "@tanstack/react-router";
import LoginForm from "../components/LoginForm";
import { useOnAuthSuccess } from "../hooks/useOnAuthSuccess";
import styles from "../styling/Auth.module.css";
import { Route } from "./login.route";

export default function Login() {
	const { redirect } = Route.useSearch();
	const onSuccess = useOnAuthSuccess(
		redirect,
		(name) => `Welcome back, ${name}!`,
	);

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.heading}>Login</h1>
				<LoginForm onSuccess={onSuccess} />
				<Link to="/register" className={styles.link}>
					Don't have an account? Register
				</Link>
			</div>
		</div>
	);
}
