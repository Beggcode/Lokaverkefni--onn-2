import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../services/cart";

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: number;
      quantity: number;
    }) => addToCart(variantId, quantity),
    onSuccess: (updated) => queryClient.setQueryData(["cart"], updated),
  });
}
