import { createRootRoute, Outlet } from "@tanstack/react-router";
import Layout from "./features/ui/components/Layout";

export const rootRoute = createRootRoute({
	component: () => (
		<Layout>
			<Outlet />
		</Layout>
	),
});
