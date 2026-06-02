import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../router.root";
import Home from "./Home";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
