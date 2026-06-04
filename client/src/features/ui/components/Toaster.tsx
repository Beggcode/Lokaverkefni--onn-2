import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { useToastStore } from "../store/toastStore";

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
					style={{
						background: "white",
						border: "1px solid lightgray",
						outline: "1px solid lightgray",
						outlineOffset: -8,
						borderRadius: 8,
						padding: 16,
						boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
						display: "flex",
						flexDirection: "column",
						gap: 10,
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Toast.Title
							style={{
								fontSize: 16,
								fontWeight: 600,
								fontFamily: "Inter, sans-serif",
								color: toast.variant === "success" ? "green" : "red",
							}}
						>
							{toast.variant === "success" ? "Success" : "Error"}
						</Toast.Title>
						<Toast.Close
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: 0,
								color: "gray",
								display: "flex",
								alignItems: "center",
							}}
						>
							<X size={16} />
						</Toast.Close>
					</div>
					<Toast.Description
						style={{
							fontSize: 14,
							fontFamily: "Inter, sans-serif",
							color: "black",
							margin: 0,
						}}
					>
						{toast.message}
					</Toast.Description>
				</Toast.Root>
			))}
			<Toast.Viewport
				style={{
					position: "fixed",
					bottom: 24,
					left: 24,
					display: "flex",
					flexDirection: "column",
					gap: 8,
					width: 360,
					maxWidth: "90vw",
					listStyle: "none",
					padding: 0,
					margin: 0,
				}}
			/>
		</Toast.Provider>
	);
}
