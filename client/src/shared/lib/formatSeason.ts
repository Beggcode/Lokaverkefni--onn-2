import type { Season } from "@ntv/shared";

export function formatSeason(season: Season): string {
	return season === "ALL_SEASON"
		? "All Season"
		: season.charAt(0) + season.slice(1).toLowerCase();
}
