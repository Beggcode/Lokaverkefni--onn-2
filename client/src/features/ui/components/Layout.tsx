import * as Avatar from "@radix-ui/react-avatar";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag } from "lucide-react";
import logo from "../../../assets/NtvLogo.png";
import { logoutUser, useAuthStore } from "../../auth";
import MegaMenu from "./MegaMenu";

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
	const user = useAuthStore((s) => s.user);
	const clearUser = useAuthStore((s) => s.clearUser);
	const navigate = useNavigate();

	async function handleLogout() {
		await logoutUser();
		clearUser();
		navigate({ to: "/" });
	}

	return (
		<>
			<nav
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 32px",
					height: "64px",
					borderBottom: "1px solid lightgray",
					background: "white",
					position: "sticky",
					top: 0,
					zIndex: 100,
				}}
			>
				<Link to="/">
					<img src={logo} alt="NTV" style={{ height: "36px" }} />
				</Link>

				<div style={{ display: "flex", gap: "32px" }}>
					<MegaMenu />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
					<Link to="/products" title="Search">
						<Search size={20} color="black" />
					</Link>
					<Link to="/cart" title="Cart">
						<ShoppingBag size={20} color="black" />
					</Link>
					{user ? (
						<button
							type="button"
							onClick={handleLogout}
							title={`Logout ${user.name}`}
							style={{
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: 0,
							}}
						>
							<Avatar.Root
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: 32,
									height: 32,
									borderRadius: "50%",
									background: "lightgray",
								}}
							>
								<Avatar.Fallback
									style={{
										fontSize: 13,
										fontFamily: "Inter, sans-serif",
										fontWeight: 600,
									}}
								>
									{user.name.charAt(0).toUpperCase()}
								</Avatar.Fallback>
							</Avatar.Root>
						</button>
					) : (
						<Link to="/login" title="Account">
							<Avatar.Root
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: 32,
									height: 32,
									borderRadius: "50%",
									background: "lightgray",
								}}
							>
								<Avatar.Fallback
									style={{
										fontSize: 13,
										fontFamily: "Inter, sans-serif",
										fontWeight: 600,
									}}
								>
									?
								</Avatar.Fallback>
							</Avatar.Root>
						</Link>
					)}
				</div>
			</nav>
			<main>{children}</main>
		</>
	);
}
