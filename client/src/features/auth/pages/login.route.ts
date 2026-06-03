import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../../../router.root";
import Login from "./Login";

export const Route = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: Login,
	validateSearch: z.object({
		redirect: z.string().optional().default("/"),
	}),
});
