type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
	return (
		<>
			<nav>Layout</nav>
			<main>{children}</main>
		</>
	);
}
