import { Link, useNavigate } from "@tanstack/react-router";
import { useToastStore } from "../../ui/store/toastStore";
import LoginForm from "../components/LoginForm";
import { useAuthStore } from "../index";
import { Route } from "./login.route";

export default function Login() {
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();
	const setUser = useAuthStore((s) => s.setUser);
	const showToast = useToastStore((s) => s.showToast);

	return (
		<>
			<LoginForm
				onSuccess={(user) => {
					setUser(user);
					showToast(`Welcome back, ${user.name}!`, "success");
					navigate({ to: redirect });
				}}
			/>
			<Link to="/register">Register</Link>
		</>
	);
}
