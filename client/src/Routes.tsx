import { createRouter, RouterProvider } from "@tanstack/react-router";
import { rootRoute } from "./router.root";
import { Route as homeRoute } from "./shared/pages/home.route";
import { Route as loginRoute } from "./features/auth/pages/login.route";
import { Route as registerRoute } from "./features/auth/pages/register.route";
import { Route as productsRoute } from "./features/products/pages/products.route";
import { Route as productRoute } from "./features/products/pages/product.route";
import { Route as cartRoute } from "./features/cart/pages/cart.route";
import { Route as checkoutRoute } from "./features/orders/pages/checkout.route";
import { Route as orderConfirmationRoute } from "./features/orders/pages/order-confirmation.route";

const router = createRouter({
  routeTree: rootRoute.addChildren([
    homeRoute,
    loginRoute,
    registerRoute,
    productsRoute,
    productRoute,
    cartRoute,
    checkoutRoute,
    orderConfirmationRoute,
  ]),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function Routes() {
  return <RouterProvider router={router} />;
}
