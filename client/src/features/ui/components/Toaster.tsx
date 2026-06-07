import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { useToastStore } from "../store/toastStore";
import styles from "../styling/Toaster.module.css";

export default function Toaster() {
	const { toasts, dismiss } = useToastStore();

	return (
		<Toast.Provider swipeDirection="right">
			{toasts.map((toast) => (
				<Toast.Root
					key={toast.id}
					open
					duration={4000}
					onOpenChange={(open) => {
						if (!open) dismiss(toast.id);
					}}
					className={styles.toast}
				>
					<div className={styles.toastHeader}>
						<Toast.Title
							className={`${styles.title} ${toast.variant === "success" ? styles.titleSuccess : styles.titleError}`}
						>
							{toast.variant === "success" ? "Success" : "Error"}
						</Toast.Title>
						<Toast.Close className={styles.closeButton}>
							<X size={16} />
						</Toast.Close>
					</div>
					<Toast.Description className={styles.description}>
						{toast.message}
					</Toast.Description>
				</Toast.Root>
			))}
			<Toast.Viewport className={styles.viewport} />
		</Toast.Provider>
	);
}
