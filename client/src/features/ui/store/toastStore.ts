import { create } from "zustand";

type Variant = "success" | "error";
export type Toast = { id: string; message: string; variant: Variant };

type ToastStore = {
	toasts: Toast[];
	showToast: (message: string, variant?: Variant) => void;
	dismiss: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
	toasts: [],
	showToast: (message, variant = "success") => {
		const id = crypto.randomUUID();
		set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
	},
	dismiss: (id) =>
		set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
