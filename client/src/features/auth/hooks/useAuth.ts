import { useAuthStore } from "../store/authStore";

export function useAuth() {
	const user = useAuthStore((s) => s.user);
	const setUser = useAuthStore((s) => s.setUser);
	const clearUser = useAuthStore((s) => s.clearUser);
	return { user, setUser, clearUser };
}
