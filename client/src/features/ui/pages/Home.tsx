import { Link } from "@tanstack/react-router";
import background from "../../../assets/Background.jpg";
import logo from "../../../assets/NtvLogo.png";
import { useProducts } from "../../products/hooks/useProducts";
import { uniqueCategories } from "../../products/lib/uniqueCategories";
import styles from "../styling/Home.module.css";

export default function Home() {
	const { data: allProducts } = useProducts();
	const { data: featured } = useProducts({ limit: 4 });

	const categories = allProducts ? uniqueCategories(allProducts) : [];

	return (
		<div className={styles.page}>
			<section className={styles.statement}>
				<p className={styles.statementText}>
					NTV was conceived during a silent retreat in a country we are not at
					liberty to name. What emerged was not a brand. It was a frequency. You
					are either on it or you are not. There is no judgment. There is
					simplyok
				</p>
				<img src={logo} alt="NTV" className={styles.statementLogo} />
			</section>

			<div
				className={styles.banner}
				style={{ backgroundImage: `url(${background})` }}
			>
				<p className={styles.title}>New Travel Vibes</p>
				<Link to="/products" className={styles.shopLink}>
					Shop All
				</Link>
			</div>

			<div className={styles.sectionWrapper}>
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Featured</h2>
					<ul className={styles.productGrid}>
						{featured?.map((p) => (
							<li key={p.id}>
								<Link
									to="/products/$productId"
									params={{ productId: String(p.id) }}
									className={styles.productLink}
								>
									{p.imageUrl && (
										<div className={styles.productImageWrapper}>
											<img
												src={p.imageUrl}
												alt={p.name}
												className={styles.productImage}
											/>
										</div>
									)}
									<div className={styles.productName}>{p.name}</div>
									<div className={styles.productPrice}>
										{p.price.toLocaleString()} kr
									</div>
								</Link>
							</li>
						))}
					</ul>
				</section>
			</div>

			<div className={styles.sectionWrapper}>
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Shop by Category</h2>
					<ul className={styles.categoryGrid}>
						{categories.map((c) => (
							<li key={c.id}>
								<Link
									to="/products"
									search={{ categoryId: c.id }}
									className={styles.categoryTile}
								>
									{c.name}
								</Link>
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
