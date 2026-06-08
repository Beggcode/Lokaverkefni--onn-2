import { ApiError } from "./apiFetch";

export function handleError(err: Error, showToast: (msg: string, type: "error") => void) {
	if (err instanceof ApiError) {
		showToast(err.message, "error");
	} else {
		console.error(err);
		showToast("Something went wrong. Please try again.", "error");
	}
}
