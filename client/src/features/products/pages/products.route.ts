import { createRoute } from "@tanstack/react-router";
import { z } from "zod";
import { rootRoute } from "../../../router.root";
import Products from "../components/Products";

const searchSchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().optional(),
});

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: Products,
  validateSearch: searchSchema,
});
