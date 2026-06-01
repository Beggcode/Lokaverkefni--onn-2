import { useQuery } from "@tanstack/react-query";
import { type ProductQuery } from "@ntv/shared";
import { getProducts } from "../services/products";

export function useProducts(query: ProductQuery = {}) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => getProducts(query),
  });
}
