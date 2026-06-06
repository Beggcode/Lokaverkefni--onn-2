import type { User } from "@ntv/shared";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "../../../shared/hooks/useToast";
import { useAuth } from "./useAuth";

export function useOnAuthSuccess(
	redirect: string,
	message: (name: string) => string,
) {
	const navigate = useNavigate();
	const { setUser } = useAuth();
	const showToast = useToast();

	return (user: User) => {
		setUser(user);
		showToast(message(user.name), "success");
		navigate({ to: redirect });
	};
}
