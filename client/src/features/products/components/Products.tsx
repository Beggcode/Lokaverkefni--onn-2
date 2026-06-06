import { Link, useNavigate } from "@tanstack/react-router";
import { useProducts } from "../hooks/useProducts";
import { uniqueCategories } from "../lib/uniqueCategories";
import { Route } from "../pages/products.route";
import styles from "../styling/Products.module.css";

export default function Products() {
	const navigate = useNavigate({ from: "/products" });
	const { search, categoryId, season } = Route.useSearch();
	const { data: allProducts } = useProducts();
	const {
		data: products,
		isPending,
		error,
	} = useProducts({ search, categoryId, season });

	if (isPending) return <p>Loading…</p>;
	if (error) return <p role="alert">{error.message}</p>;

	const categories = uniqueCategories(allProducts ?? products);

	function setSearch(value: string) {
		navigate({ search: (prev) => ({ ...prev, search: value || undefined }) });
	}

	function setCategory(value: string) {
		navigate({
			search: (prev) => ({
				...prev,
				categoryId: value ? Number(value) : undefined,
			}),
		});
	}

	return (
		<div className={styles.container}>
			<div className={styles.filters}>
				<input
					className={styles.searchInput}
					placeholder="Search products…"
					value={search ?? ""}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<select
					className={styles.categorySelect}
					value={categoryId ?? ""}
					onChange={(e) => setCategory(e.target.value)}
				>
					<option value="">All categories</option>
					{categories.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
			</div>
			<ul className={styles.grid}>
				{products.map((p) => (
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
		</div>
	);
}
