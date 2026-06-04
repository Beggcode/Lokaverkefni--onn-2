import { type Season } from "@ntv/shared";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useProducts } from "../../products/hooks/useProducts";

const SEASONS: { label: string; value: Season }[] = [
	{ label: "Spring", value: "SPRING" },
	{ label: "Summer", value: "SUMMER" },
	{ label: "Autumn", value: "AUTUMN" },
	{ label: "Winter", value: "WINTER" },
	{ label: "All Season", value: "ALL_SEASON" },
];

const linkStyle = {
	display: "block",
	padding: "6px 0",
	textDecoration: "none",
	fontFamily: "Bebas Neue, sans-serif",
	fontSize: "18px",
	textAlign: "center" as const,
};

const triggerStyle = {
	background: "none",
	border: "none",
	cursor: "pointer",
	fontFamily: "Bebas Neue, sans-serif",
	fontSize: "22px",
	color: "black",
	padding: 0,
};

type MenuItem = "category" | "season" | "newvibes" | null;

export default function MegaMenu() {
	const [open, setOpen] = useState<MenuItem>(null);
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
		<div
			style={{ display: "flex", gap: "32px", position: "relative" }}
			onMouseLeave={() => setOpen(null)}
		>
			<button style={triggerStyle} onMouseEnter={() => setOpen("category")}>
				Category
			</button>
			<button style={triggerStyle} onMouseEnter={() => setOpen("season")}>
				Season
			</button>
			<button style={triggerStyle} onMouseEnter={() => setOpen("newvibes")}>
				New Vibes
			</button>

			{open && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						right: 0,
						background: "white",
						padding: "0 4px 4px 4px",
					}}
				>
					<div
						style={{
							marginTop: "19px",
							borderLeft: "2.5px solid black",
							borderRight: "2.5px solid black",
							borderBottom: "2.5px solid black",
							padding: "16px 0",
							textAlign: "center",
						}}
					>
						{open === "category" &&
							categories.map((c) => (
								<Link
									key={c.id}
									to="/products"
									search={{ categoryId: c.id }}
									style={linkStyle}
								>
									{c.name}
								</Link>
							))}
						{open === "season" &&
							SEASONS.map((s) => (
								<Link
									key={s.value}
									to="/products"
									search={{ season: s.value }}
									style={linkStyle}
								>
									{s.label}
								</Link>
							))}
						{open === "newvibes" &&
							newVibes?.map((p) => (
								<Link
									key={p.id}
									to="/products/$productId"
									params={{ productId: String(p.id) }}
									style={linkStyle}
								>
									{p.name}
								</Link>
							))}
					</div>
				</div>
			)}
		</div>
	);
}
