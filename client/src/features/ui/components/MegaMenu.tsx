import { type Season } from "@ntv/shared";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { Link } from "@tanstack/react-router";
import { useProducts } from "../../products/hooks/useProducts";

const SEASONS: { label: string; value: Season }[] = [
	{ label: "Spring", value: "SPRING" },
	{ label: "Summer", value: "SUMMER" },
	{ label: "Autumn", value: "AUTUMN" },
	{ label: "Winter", value: "WINTER" },
	{ label: "All Season", value: "ALL_SEASON" },
];

const triggerStyle = {
	background: "none",
	border: "none",
	cursor: "pointer",
	fontFamily: "Inter, sans-serif",
	fontSize: "14px",
	color: "black",
	padding: 0,
};

const dropdownStyle = {
	position: "absolute" as const,
	top: "64px",
	background: "white",
	borderBottom: "1px solid lightgray",
	padding: "24px",
	minWidth: "180px",
	zIndex: 99,
};

const linkStyle = {
	display: "block",
	padding: "6px 0",
	textDecoration: "none",
	color: "black",
	fontFamily: "Inter, sans-serif",
	fontSize: "14px",
};

export default function MegaMenu() {
	const { data: allProducts } = useProducts();
	const { data: newVibes } = useProducts({ limit: 3 });

	const categories = allProducts
		? [
				...new Map(
					allProducts.map((p) => [p.category.id, p.category]),
				).values(),
			].sort((a, b) => a.id - b.id)
		: [];

	return (
		<NavigationMenu.Root>
			<NavigationMenu.List
				style={{
					listStyle: "none",
					margin: 0,
					padding: 0,
					display: "flex",
					gap: "32px",
				}}
			>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger style={triggerStyle}>
						Category
					</NavigationMenu.Trigger>
					<NavigationMenu.Content style={dropdownStyle}>
						{categories.map((c) => (
							<Link
								key={c.id}
								to="/products"
								search={{ categoryId: c.id }}
								style={linkStyle}
							>
								{c.name}
							</Link>
						))}
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger style={triggerStyle}>
						Season
					</NavigationMenu.Trigger>
					<NavigationMenu.Content style={dropdownStyle}>
						{SEASONS.map((s) => (
							<Link
								key={s.value}
								to="/products"
								search={{ season: s.value }}
								style={linkStyle}
							>
								{s.label}
							</Link>
						))}
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger style={triggerStyle}>
						New Vibes
					</NavigationMenu.Trigger>
					<NavigationMenu.Content style={dropdownStyle}>
						{newVibes?.map((p) => (
							<Link
								key={p.id}
								to="/products/$productId"
								params={{ productId: String(p.id) }}
								style={linkStyle}
							>
								{p.name}
							</Link>
						))}
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>

			<NavigationMenu.Viewport />
		</NavigationMenu.Root>
	);
}
