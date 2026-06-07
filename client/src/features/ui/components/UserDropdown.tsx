import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { useToast } from "../../../shared/hooks/useToast";
import { logoutUser, useAuth } from "../../auth";
import styles from "../styling/Layout.module.css";

function UserAvatar({ initial }: { initial: string }) {
	return (
		<Avatar.Root className={styles.avatar}>
			<Avatar.Fallback className={styles.avatarFallback}>
				{initial}
			</Avatar.Fallback>
		</Avatar.Root>
	);
}

export default function UserDropdown() {
	const { user, clearUser } = useAuth();
	const navigate = useNavigate();
	const showToast = useToast();

	if (!user) {
		return (
			<Link to="/login" title="Account">
				<UserAvatar initial="?" />
			</Link>
		);
	}

	async function handleLogout() {
		await logoutUser();
		clearUser();
		navigate({ to: "/" });
		showToast("Logged out", "success");
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button type="button" className={styles.avatarButton} title={user.name}>
					<UserAvatar initial={user.name.charAt(0).toUpperCase()} />
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className={styles.dropdownContent}
					align="end"
					sideOffset={8}
				>
					<DropdownMenu.Label className={styles.dropdownLabel}>
						{user.name}
					</DropdownMenu.Label>
					<DropdownMenu.Separator className={styles.dropdownSeparator} />
					<DropdownMenu.Item
						className={styles.dropdownItem}
						onSelect={handleLogout}
					>
						Logout
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
