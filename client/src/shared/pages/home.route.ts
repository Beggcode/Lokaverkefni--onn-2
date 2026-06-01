import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../router.root";
import Home from "../components/Home";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
