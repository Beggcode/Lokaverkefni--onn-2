import { Link } from "@tanstack/react-router";
import styles from "../styling/Products.module.css";

type Props = {
	product: {
		id: number;
		name: string;
		imageUrl: string | null;
		category: { name: string };
		price: number;
	};
};

export function ProductCard({ product: p }: Props) {
	return (
		<li className={styles.card}>
			<Link
				to="/products/$productId"
				params={{ productId: String(p.id) }}
				className={styles.cardLink}
			>
				{p.imageUrl && (
					<div className={styles.cardImageWrapper}>
						<img src={p.imageUrl} alt={p.name} className={styles.cardImage} />
					</div>
				)}
				<div className={styles.cardBody}>
					<div className={styles.cardName}>{p.name}</div>
					<div className={styles.cardMeta}>{p.category.name}</div>
					<div className={styles.cardPrice}>{p.price.toLocaleString()} kr</div>
				</div>
			</Link>
		</li>
	);
}
