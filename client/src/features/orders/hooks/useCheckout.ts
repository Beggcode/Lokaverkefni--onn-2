import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { checkout } from "../services/orders";

export function useCheckout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkout,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      navigate({
        to: "/orders/$orderId",
        params: { orderId: String(order.id) },
      });
    },
  });
}
