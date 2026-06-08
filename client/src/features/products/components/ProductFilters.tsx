import type { Season } from "@ntv/shared";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { formatSeason } from "../../../shared/lib/formatSeason";
import styles from "../styling/Products.module.css";

const SEASONS = ["SPRING", "SUMMER", "AUTUMN", "WINTER", "ALL_SEASON"] as const;

type Props = {
	searchInput: string;
	onSearchChange: (value: string) => void;
	categoryId: number | undefined;
	onCategoryChange: (value: string) => void;
	season: Season | undefined;
	onSeasonChange: (value: string) => void;
	categories: { id: number; name: string }[];
};

export function ProductFilters({
	searchInput,
	onSearchChange,
	categoryId,
	onCategoryChange,
	season,
	onSeasonChange,
	categories,
}: Props) {
	return (
		<div className={styles.filters}>
			<input
				className={styles.searchInput}
				placeholder="Search products…"
				value={searchInput}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			<Select.Root
				value={categoryId ? String(categoryId) : "all"}
				onValueChange={onCategoryChange}
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
			<Select.Root value={season ?? "all"} onValueChange={onSeasonChange}>
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
							{SEASONS.map((s) => (
								<Select.Item key={s} value={s} className={styles.selectItem}>
									<Select.ItemText>{formatSeason(s)}</Select.ItemText>
								</Select.Item>
							))}
						</Select.Viewport>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
		</div>
	);
}
