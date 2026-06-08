import { Link } from "@tanstack/react-router";
import styles from "./RecentlyViewedList.module.css";

type RecentProduct = {
	id: number;
	name: string;
};

type Props = {
	items: RecentProduct[];
	onItemClick?: () => void;
};

export function RecentlyViewedList({ items, onItemClick }: Props) {
	if (items.length === 0) return null;

	return (
		<div className={styles.section}>
			<h2 className={styles.title}>Recently Viewed</h2>
			<ul className={styles.list}>
				{items.map((p) => (
					<li key={p.id}>
						<Link
							to="/products/$productId"
							params={{ productId: String(p.id) }}
							className={styles.link}
							onClick={onItemClick}
						>
							{p.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
