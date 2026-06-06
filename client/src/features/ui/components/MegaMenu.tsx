import { type Season } from "@ntv/shared";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link } from "@tanstack/react-router";
import { useProducts } from "../../products/hooks/useProducts";
import { uniqueCategories } from "../../products/lib/uniqueCategories";
import styles from "../styling/MegaMenu.module.css";

const SEASONS: { label: string; value: Season }[] = [
	{ label: "Spring", value: "SPRING" },
	{ label: "Summer", value: "SUMMER" },
	{ label: "Autumn", value: "AUTUMN" },
	{ label: "Winter", value: "WINTER" },
	{ label: "All Season", value: "ALL_SEASON" },
];

export default function MegaMenu() {
	const { data: allProducts } = useProducts();
	const { data: newVibes } = useProducts({ limit: 3 });

	const categories = allProducts
		? uniqueCategories(allProducts).sort((a, b) => a.id - b.id)
		: [];

	return (
		<NavigationMenu.Root className={styles.root}>
			<NavigationMenu.List className={styles.list}>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger className={styles.trigger}>
						Category
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className={styles.content}>
						{categories.map((c) => (
							<NavigationMenu.Link key={c.id} asChild>
								<Link
									to="/products"
									search={{ categoryId: c.id }}
									className={styles.link}
								>
									{c.name}
								</Link>
							</NavigationMenu.Link>
						))}
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger className={styles.trigger}>
						Season
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className={styles.content}>
						{SEASONS.map((s) => (
							<NavigationMenu.Link key={s.value} asChild>
								<Link
									to="/products"
									search={{ season: s.value }}
									className={styles.link}
								>
									{s.label}
								</Link>
							</NavigationMenu.Link>
						))}
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger className={styles.trigger}>
						New Vibes
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className={styles.content}>
						{newVibes?.map((p) => (
							<NavigationMenu.Link key={p.id} asChild>
								<Link
									to="/products/$productId"
									params={{ productId: String(p.id) }}
									className={styles.link}
								>
									{p.name}
								</Link>
							</NavigationMenu.Link>
						))}
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>

			<NavigationMenu.Viewport className={styles.viewport} />
		</NavigationMenu.Root>
	);
}
