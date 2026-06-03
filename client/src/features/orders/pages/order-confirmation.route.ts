import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../router.root";
import OrderConfirmation from "../components/OrderConfirmation";

export const Route = createRoute({
	getParentRoute: () => rootRoute,
	path: "/orders/$orderId",
	component: OrderConfirmation,
});
