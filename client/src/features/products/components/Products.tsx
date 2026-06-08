import type { Season } from "@ntv/shared";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RecentlyViewedList } from "../../../shared/components/RecentlyViewedList";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useProducts } from "../hooks/useProducts";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { uniqueCategories } from "../lib/uniqueCategories";
import { Route } from "../pages/products.route";
import styles from "../styling/Products.module.css";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";

export default function Products() {
	const navigate = useNavigate({ from: "/products" });
	const { search, categoryId, season } = Route.useSearch();
	const [searchInput, setSearchInput] = useState(search ?? "");
	const debouncedSearch = useDebounce(searchInput, 300);
	const { data: allProducts } = useProducts();
	const {
		data: products,
		isPending,
		error,
	} = useProducts({
		search: debouncedSearch || undefined,
		categoryId,
		season,
	});

	useEffect(() => {
		navigate({
			search: (prev) => ({ ...prev, search: debouncedSearch || undefined }),
			replace: true,
		});
	}, [debouncedSearch, navigate]);

	const categories = uniqueCategories(allProducts ?? products ?? []);
	const hasFilters = !!searchInput || !!categoryId || !!season;
	const { items: recentlyViewed } = useRecentlyViewed();

	function clearFilters() {
		setSearchInput("");
		navigate({ search: () => ({}) });
	}

	function setCategory(value: string) {
		navigate({
			search: (prev) => ({
				...prev,
				categoryId: value === "all" ? undefined : Number(value),
			}),
		});
	}

	function setSeason(value: string) {
		navigate({
			search: (prev) => ({
				...prev,
				season: value === "all" ? undefined : (value as Season),
			}),
		});
	}

	return (
		<>
			<div className={styles.container}>
				<ProductFilters
					searchInput={searchInput}
					onSearchChange={setSearchInput}
					categoryId={categoryId}
					onCategoryChange={setCategory}
					season={season}
					onSeasonChange={setSeason}
					categories={categories}
				/>
				<div className={styles.toolbar}>
					{!isPending && (
						<span className={styles.count}>
							{(products ?? []).length} product
							{(products ?? []).length !== 1 ? "s" : ""}
						</span>
					)}
					{hasFilters && (
						<button className={styles.clearButton} onClick={clearFilters}>
							Clear filters
						</button>
					)}
				</div>
				{error && <p role="alert">{error.message}</p>}
				{isPending ? (
					<p>Loading…</p>
				) : (products ?? []).length === 0 ? (
					<div className={styles.empty}>
						<p>No products match your filters.</p>
						<button className={styles.clearButton} onClick={clearFilters}>
							Clear filters
						</button>
					</div>
				) : (
					<ul className={styles.grid}>
						{(products ?? []).map((p) => (
							<ProductCard key={p.id} product={p} />
						))}
					</ul>
				)}
			</div>
			<RecentlyViewedList items={recentlyViewed} />
		</>
	);
}
