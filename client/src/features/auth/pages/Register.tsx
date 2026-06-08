import { Link } from "@tanstack/react-router";
import RegisterForm from "../components/RegisterForm";
import { useOnAuthSuccess } from "../hooks/useOnAuthSuccess";
import styles from "../styling/Auth.module.css";
import { Route } from "./register.route";

export default function Register() {
	const { redirect } = Route.useSearch();
	const onSuccess = useOnAuthSuccess(redirect, (name) => `Welcome, ${name}!`);

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.heading}>Register</h1>
				<RegisterForm onSuccess={onSuccess} />
				<Link to="/login" className={styles.link}>
					Already have an account? Login
				</Link>
			</div>
		</div>
	);
}
