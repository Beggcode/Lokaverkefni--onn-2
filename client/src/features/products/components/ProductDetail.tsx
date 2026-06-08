import type { Variant } from "@ntv/shared";
import { useEffect, useState } from "react";
import { RecentlyViewedList } from "../../../shared/components/RecentlyViewedList";
import { formatSize } from "../../../shared/lib/formatSize";
import { useAddToCart } from "../../cart/hooks/useAddToCart";
import { useProduct } from "../hooks/useProduct";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { Route } from "../pages/product.route";
import styles from "../styling/ProductDetail.module.css";

export default function ProductDetail() {
	const { productId: productIdStr } = Route.useParams();
	const productId = Number(productIdStr);

	const { data: product, isPending, error } = useProduct(productId);
	const add = useAddToCart();
	const { add: trackProduct, items: recentItems } = useRecentlyViewed();
	const recentlyViewed = recentItems.filter((p) => p.id !== productId);

	const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
	const [quantity, setQuantity] = useState(1);

	function handleVariantChange(variantId: number) {
		const v = product?.variants.find((v) => v.id === variantId);
		if (v) {
			setSelectedVariant(v);
			setQuantity(1);
		}
	}

	useEffect(() => {
		if (product) trackProduct({ id: product.id, name: product.name });
	}, [product, trackProduct]);

	if (isPending) return <p>Loading…</p>;
	if (error) return <p role="alert">{error.message}</p>;

	const variant = selectedVariant ?? product.variants[0];
	const maxQty = variant?.stock ?? 1;

	return (
		<>
			<div className={styles.container}>
				<div className={styles.layout}>
					{product.imageUrl && (
						<div className={styles.imageWrapper}>
							<img
								src={product.imageUrl}
								alt={product.name}
								className={styles.image}
							/>
						</div>
					)}
					<div className={styles.info}>
						<h1 className={styles.name}>{product.name}</h1>
						<div className={styles.meta}>
							<span>{product.category.name.toUpperCase()}</span>
							<span>{product.season.replace("_", " ")}</span>
							{product.type && <span>{product.type.toUpperCase()}</span>}
						</div>
						{product.description && (
							<p className={styles.description}>{product.description}</p>
						)}
						<p className={styles.price}>{product.price.toLocaleString()} kr</p>

						{product.variants.length > 0 && (
							<>
								<div className={styles.field}>
									<label htmlFor="variant">Size</label>
									<select
										id="variant"
										value={variant?.id}
										onChange={(e) =>
											handleVariantChange(Number(e.target.value))
										}
									>
										{product.variants.map((v) => (
											<option key={v.id} value={v.id} disabled={v.stock === 0}>
												{formatSize(v)}{" "}
												{v.stock === 0 ? "(out of stock)" : `(${v.stock} left)`}
											</option>
										))}
									</select>
								</div>

								<div className={styles.field}>
									<label>Quantity</label>
									<div className={styles.qtyControl}>
										<button
											className={styles.qtyButton}
											onClick={() => setQuantity((q) => Math.max(1, q - 1))}
											disabled={quantity <= 1}
										>
											−
										</button>
										<span className={styles.qtyValue}>{quantity}</span>
										<button
											className={styles.qtyButton}
											onClick={() =>
												setQuantity((q) => Math.min(maxQty, q + 1))
											}
											disabled={quantity >= maxQty}
										>
											+
										</button>
									</div>
								</div>

								<button
									className={styles.addButton}
									onClick={() =>
										add.mutate({ variantId: variant!.id, quantity })
									}
									disabled={add.isPending || !variant || variant.stock === 0}
								>
									{add.isPending ? "Adding…" : "Add to cart"}
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			<RecentlyViewedList items={recentlyViewed} />
		</>
	);
}
