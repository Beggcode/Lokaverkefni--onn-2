import * as Dialog from "@radix-ui/react-dialog";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRecentlyViewed } from "../../products/hooks/useRecentlyViewed";
import styles from "../styling/SearchOverlay.module.css";

export default function SearchOverlay() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	function handleSearch(e: { preventDefault(): void }) {
		e.preventDefault();
		if (!query.trim()) return;
		setOpen(false);
		setQuery("");
		navigate({ to: "/products", search: { search: query.trim() } });
	}

	const { items: recentlyViewed } = useRecentlyViewed();

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button type="button" className={styles.trigger}>
					<Search size={20} />
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className={styles.overlay} />
				<Dialog.Content className={styles.content}>
					<Dialog.Title className={styles.srOnly}>Search</Dialog.Title>
					<form onSubmit={handleSearch} className={styles.searchBar}>
						<Search size={18} />
						<input
							autoFocus
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search products…"
							className={styles.searchInput}
						/>
						<Dialog.Close className={styles.cancel}>Cancel</Dialog.Close>
					</form>

					{recentlyViewed.length > 0 && (
						<div className={styles.recentlyViewed}>
							<p className={styles.recentlyViewedLabel}>Recently viewed</p>
							{recentlyViewed.map((p) => (
								<Link
									key={p.id}
									to="/products/$productId"
									params={{ productId: String(p.id) }}
									onClick={() => setOpen(false)}
									className={styles.recentlyViewedLink}
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
