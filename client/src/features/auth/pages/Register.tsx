import { Link, useNavigate } from "@tanstack/react-router";
import { useToastStore } from "../../ui/store/toastStore";
import RegisterForm from "../components/RegisterForm";
import { useAuthStore } from "../index";
import { Route } from "./register.route";

export default function Register() {
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();
	const setUser = useAuthStore((s) => s.setUser);
	const showToast = useToastStore((s) => s.showToast);

	return (
		<>
			<RegisterForm
				onSuccess={(user) => {
					setUser(user);
					showToast(`Welcome, ${user.name}!`, "success");
					navigate({ to: redirect });
				}}
			/>
			<Link to="/login">Already have an account? Login</Link>
		</>
	);
}
