import * as Dialog from "@radix-ui/react-dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { getRecentlyViewed } from "../../products/hooks/useRecentlyViewed";

export default function SearchOverlay() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	function handleSearch() {
		if (!query.trim()) return;
		setOpen(false);
		setQuery("");
		navigate({ to: "/products", search: { search: query.trim() } });
	}

	const recentlyViewed = getRecentlyViewed();

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button
					type="button"
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: 0,
					}}
				>
					<Search size={20} />
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay
					style={{
						position: "fixed",
						inset: 0,
						background: "white",
					}}
				/>
				<Dialog.Content
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						padding: "24px 32px",
					}}
				>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSearch();
						}}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
							borderBottom: "1px solid",
							paddingBottom: "16px",
						}}
					>
						<Search size={18} />
						<input
							autoFocus
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search products…"
							style={{
								flex: 1,
								border: "none",
								outline: "none",
								fontSize: "16px",
								fontFamily: "Inter, sans-serif",
								background: "transparent",
							}}
						/>
						<Dialog.Close
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								fontFamily: "Inter, sans-serif",
								fontSize: "14px",
							}}
						>
							Cancel
						</Dialog.Close>
					</form>

					{recentlyViewed.length > 0 && (
						<div style={{ marginTop: "24px" }}>
							<p
								style={{
									fontFamily: "Inter, sans-serif",
									fontSize: "13px",
									fontWeight: 600,
									marginBottom: "12px",
								}}
							>
								Recently viewed
							</p>
							{recentlyViewed.map((p) => (
								<Link
									key={p.id}
									to="/products/$productId"
									params={{ productId: String(p.id) }}
									onClick={() => setOpen(false)}
									style={{
										display: "block",
										padding: "8px 0",
										textDecoration: "none",
										fontFamily: "Inter, sans-serif",
										fontSize: "14px",
									}}
								>
									{p.name}
								</Link>
							))}
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
