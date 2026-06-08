import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../../router.root";
import { useAuthStore } from "../../auth/store/authStore";
import Cart from "../components/Cart";

export const Route = createRoute({
	getParentRoute: () => rootRoute,
	path: "/cart",
	component: Cart,
	beforeLoad: () => {
		if (!useAuthStore.getState().user) {
			throw redirect({ to: "/login", search: { redirect: "/cart" } });
		}
	},
});
