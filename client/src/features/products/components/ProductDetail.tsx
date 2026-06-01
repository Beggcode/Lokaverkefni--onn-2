import { useState } from "react";
import { Route } from "../pages/product.route";
import type { Variant } from "@ntv/shared";
import { formatVariant } from "../../../shared/lib/formatVariant";
import { useProduct } from "../hooks/useProduct";
import { useAddToCart } from "../../cart/hooks/useAddToCart";

export default function ProductDetail() {
  const { productId: productIdStr } = Route.useParams();
  const productId = Number(productIdStr);

  const { data: product, isPending, error } = useProduct(productId);
  const add = useAddToCart();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

  function handleVariantChange(variantId: number) {
    const v = product?.variants.find((v) => v.id === variantId);
    if (v) {
      setSelectedVariant(v);
      setQuantity(1);
    }
  }

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;

  const variant = selectedVariant ?? product.variants[0];
  const maxQty = variant?.stock ?? 1;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>
        {product.category.name} — {product.season}
      </p>
      {product.description && <p>{product.description}</p>}
      <p>
        <strong>{product.price} kr</strong>
      </p>

      {product.variants.length > 0 && (
        <div>
          <label htmlFor="variant">Variant</label>
          <select
            id="variant"
            value={variant?.id}
            onChange={(e) => handleVariantChange(Number(e.target.value))}
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id} disabled={v.stock === 0}>
                {formatVariant(v)}{" "}
                {v.stock === 0 ? "(out of stock)" : `(${v.stock} left)`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={maxQty}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.min(Number(e.target.value), maxQty))
          }
        />
      </div>

      {add.isSuccess && <p>Added to cart!</p>}
      {add.isError && <p role="alert">{add.error.message}</p>}

      <button
        onClick={() => add.mutate({ variantId: variant.id, quantity })}
        disabled={add.isPending || !variant || variant.stock === 0}
      >
        {add.isPending ? "Adding…" : "Add to cart"}
      </button>
    </div>
  );
}
