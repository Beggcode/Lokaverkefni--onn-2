import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import logo from "../../../assets/NtvLogo.png";
import styles from "../styling/Layout.module.css";
import Footer from "./Footer";
import MegaMenu from "./MegaMenu";
import SearchOverlay from "./SearchOverlay";
import Toaster from "./Toaster";
import UserDropdown from "./UserDropdown";

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
	return (
		<>
			<nav className={styles.nav}>
				<Link to="/">
					<img src={logo} alt="NTV" className={styles.logo} />
				</Link>

				<div className={styles.navCenter}>
					<MegaMenu />
				</div>

				<div className={styles.navRight}>
					<SearchOverlay />
					<Link to="/cart" title="Cart">
						<ShoppingBag size={20} color="black" />
					</Link>
					<UserDropdown />
				</div>
			</nav>
			<main>{children}</main>
			<Footer />
			<Toaster />
		</>
	);
}
