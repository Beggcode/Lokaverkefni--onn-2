import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../../../router.root";
import Register from "./Register";

export const Route = createRoute({
	getParentRoute: () => rootRoute,
	path: "/register",
	component: Register,
	validateSearch: z.object({ redirect: z.string().optional().default("/") }),
});
