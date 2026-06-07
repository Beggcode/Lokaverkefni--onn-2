import type { Season } from "@ntv/shared";
import * as Select from "@radix-ui/react-select";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useProducts } from "../hooks/useProducts";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { uniqueCategories } from "../lib/uniqueCategories";
import { Route } from "../pages/products.route";
import styles from "../styling/Products.module.css";

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
	} = useProducts({ search: debouncedSearch || undefined, categoryId, season });

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
		<div className={styles.container}>
			<div className={styles.filters}>
				<input
					className={styles.searchInput}
					placeholder="Search products…"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				/>
				<Select.Root
					value={categoryId ? String(categoryId) : "all"}
					onValueChange={setCategory}
				>
					<Select.Trigger className={styles.selectTrigger}>
						<Select.Value />
						<ChevronDown size={14} strokeWidth={1.5} />
					</Select.Trigger>
					<Select.Portal>
						<Select.Content
							className={styles.selectContent}
							position="popper"
							sideOffset={4}
						>
							<Select.Viewport>
								<Select.Item value="all" className={styles.selectItem}>
									<Select.ItemText>All Categories</Select.ItemText>
								</Select.Item>
								{categories.map((c) => (
									<Select.Item
										key={c.id}
										value={String(c.id)}
										className={styles.selectItem}
									>
										<Select.ItemText>{c.name}</Select.ItemText>
									</Select.Item>
								))}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
				<Select.Root value={season ?? "all"} onValueChange={setSeason}>
					<Select.Trigger className={styles.selectTrigger}>
						<Select.Value />
						<ChevronDown size={14} strokeWidth={1.5} />
					</Select.Trigger>
					<Select.Portal>
						<Select.Content
							className={styles.selectContent}
							position="popper"
							sideOffset={4}
						>
							<Select.Viewport>
								<Select.Item value="all" className={styles.selectItem}>
									<Select.ItemText>All Seasons</Select.ItemText>
								</Select.Item>
								{(
									[
										"SPRING",
										"SUMMER",
										"AUTUMN",
										"WINTER",
										"ALL_SEASON",
									] as const
								).map((s) => (
									<Select.Item key={s} value={s} className={styles.selectItem}>
										<Select.ItemText>
											{s === "ALL_SEASON"
												? "All Season"
												: s.charAt(0) + s.slice(1).toLowerCase()}
										</Select.ItemText>
									</Select.Item>
								))}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>

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
						<li key={p.id} className={styles.card}>
							<Link
								to="/products/$productId"
								params={{ productId: String(p.id) }}
								className={styles.cardLink}
							>
								{p.imageUrl && (
									<div className={styles.cardImageWrapper}>
										<img
											src={p.imageUrl}
											alt={p.name}
											className={styles.cardImage}
										/>
									</div>
								)}
								<div className={styles.cardBody}>
									<div className={styles.cardName}>{p.name}</div>
									<div className={styles.cardMeta}>{p.category.name}</div>
									<div className={styles.cardPrice}>
										{p.price.toLocaleString()} kr
									</div>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
			{recentlyViewed.length > 0 && (
				<div className={styles.recentlyViewed}>
					<h2 className={styles.recentlyViewedTitle}>Recently Viewed</h2>
					<ul className={styles.recentlyViewedList}>
						{recentlyViewed.map((p) => (
							<li key={p.id}>
								<Link
									to="/products/$productId"
									params={{ productId: String(p.id) }}
									className={styles.recentlyViewedLink}
								>
									{p.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
