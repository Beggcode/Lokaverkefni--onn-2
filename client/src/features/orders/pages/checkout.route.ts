import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../../../router.root";
import { useAuthStore } from "../../auth/store/authStore";
import Checkout from "../components/Checkout";

export const Route = createRoute({
	getParentRoute: () => rootRoute,
	path: "/checkout",
	component: Checkout,
	beforeLoad: () => {
		if (!useAuthStore.getState().user) {
			throw redirect({ to: "/login", search: { redirect: "/checkout" } });
		}
	},
});
