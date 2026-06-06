import { useToastStore } from "../../features/ui/store/toastStore";

export function useToast() {
	return useToastStore((s) => s.showToast);
}
